import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';

import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

export default function HasilPencarian(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [pasienData, setPasienData] = useState('');
  const [paramsData, setParamsData] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');

  //hasil pencarian
  const [jadwalNakes, setJadwalNakes] = useState([]);
  const [id_nakes_detail, setId_nakes_detail] = useState('');
  const [waktuBooking, setWaktuBooking] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  //id faskes jika reservasi FASKES
  const [id_faskes, setId_faskes] = useState(props.route.params.id_faskes);
  const [dataFaskes, setDataFaskes] = useState(props.route.params.dataFaskes);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  //params for pagination

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  useEffect(() => {
    getLoginData();

    return () => {
      setLoading(false);
    }
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(loadingFetch === true) {
      getJadwal();
      setLoadingFetch(false);
    }

    return () => {
      setLoadingFetch(false);
    }
  },[loadingFetch]);

  const setDataSource = async () => {
    await setPasienData(props.route.params.pasienData);
    await setParamsData(props.route.params.params);
    await setDataKerabat(props.route.params.dataKerabat);

    await setLoadingFetch(true);
  }

  const getJadwal = async () => {
    setShouldFetch(true);
    let params = [];

    if(id_faskes === undefined) {
      params.push({
        base_url: props.route.params.base_url,
        startDate: paramsData[0].startDate,
        startTime: paramsData[0].startTime,
        endTime: paramsData[0].endTime,
        address: paramsData[0].address,
        note: paramsData[0].note,
        useAddress: paramsData[0].useAddress,
        lat: paramsData[0].lat,
        lon: paramsData[0].lon,
        id_profesi: paramsData[0].id_profesi,
        id_kategori: paramsData[0].kategoriPasien,
        id_klasifikasi: paramsData[0].klasifikasiPasien,
        id_layanan: 2,
        token: dataLogin.token
      });

      success = await formValidation.getJadwal(params, page, 10);
    }else {
      params.push({
        base_url: props.route.params.base_url,
        startDate: paramsData[0].startDate,
        startTime: paramsData[0].startTime,
        endTime: paramsData[0].endTime,
        id_faskes: id_faskes,
        id_profesi: paramsData[0].id_profesi,
        id_kategori: paramsData[0].kategoriPasien,
        id_klasifikasi: paramsData[0].klasifikasiPasien,
        id_layanan: 1,
        token: dataLogin.token
      });

      success = await formValidation.getJadwalFaskes(params, page, 10);
    }

    if(success.status === true) {
      //await setJadwalNakes(success.res);
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {

      }else {
        try {
          if(success.res !== undefined) {
            setJadwalNakes(oldData => [...oldData, ...success.res.result]);

            setPage(page + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
    }
    setLoading(false);
  }

  function RenderNakes() {
    const newItems = jadwalNakes;

    if(newItems.length > 0) {
      return newItems.map((item) => {
        return (
          item.jadwal[0].jam_praktek.length > 0 ?
          <TouchableOpacity key={item.id_nakes} onPress={() => openProfilNakes(item.id_nakes)}>
            <View style={styles.By_faskes}>
              <View style={styles.Group3310}>
                <View style={styles.Group4010(layout)}>
                  <View>
                    <Text style={styles.Txt647}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                    {/*<View style={styles.card(layout)}>
                      <Text style={styles.Txt1610}>{item.layanan}</Text>
                    </View>*/}
                    <View style={styles.card(layout)}>
                      <Text style={styles.Txt1610}>Pendidikan : </Text>
                      <Text style={styles.Txt1610}>{item.pendidikan}</Text>
                    </View>
                    <View style={styles.card(layout)}>
                      <Text style={styles.Txt1610}>Sertifikasi : </Text>
                      <Text style={styles.Txt1610}>{item.sertifikasi}</Text>
                    </View>
                    <View style={styles.card(layout)}>
                      <Text style={styles.Txt1610}>Tempat Praktik : </Text>
                      <Text style={styles.Txt1610}>{item.company}</Text>
                    </View>
                    {id_profesi === undefined ?
                      <View style={styles.card(layout)}>
                        <Text style={styles.Txt1610}>Jarak : </Text>
                        <Text style={styles.Txt1610}>
                          <Text style={styles.jarak}>{parseFloat(item.distance).toFixed(2)} Km</Text>
                        </Text>
                      </View>
                      :
                      <></>
                    }
                  </View>
                </View>
                <View style={styles.Group354}>
                  <Icons
                    label="Panah"
                    name="chevron-forward"
                    color="rgba(255, 255, 255, 1)"
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          :
          <></>
        )
      })
    }else {
      return (
        <View style={{marginTop: '4%'}}><Text style={{fontStyle: 'italic'}}>Jadwal tidak tersedia...</Text></View>
      )
    }
  }

  //open profile nakes
  const openProfilNakes = async (e) => {
    await setId_nakes_detail(e);
    const dataNakes = jadwalNakes.filter(
      item => item.id_nakes === e
    );
    props.navigation.navigate('profilNakes', { base_url: props.route.params.base_url, id_nakes_detail: e , jadwalNakes: dataNakes, params: paramsData, pasienData: pasienData, dataKerabat: dataKerabat, id_profesi: id_profesi, jenisLayanan: jenisLayanan, id_faskes: id_faskes });
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return <IconPanah style={styles.icon(color)} name={name} />;
    }
  };

  return (
    !loading ?
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <Spinner
            visible={loadingSave}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
            color="#236CFF"
            overlayColor="rgba(255, 255, 255, 0.5)"
          />
          <SafeAreaView style={styles.container}>
            
              <View
                style={styles.Layanan_terapi}
                onLayout={event => setLayout(event.nativeEvent.layout)}>
                <ScrollView
                  horizontal={false}
                  contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  onScrollEndDrag={getJadwal}
                >
                <RenderNakes />
                {shouldFetch ? <ActivityIndicator style={styles.group} size="small" color="#0000ff" /> : <></>}
                </ScrollView>
              </View>
            
          </SafeAreaView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    //flex: 1,
    height: 'auto',
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_terapi: {
    flex: 1,
    //top: 25,
    paddingVertical: '2%',
    flexDirection: 'column',
    paddingHorizontal: 20,
    width: '100%',
  },

  By_faskes: {
    marginBottom: 10,
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(52,65,70,1)',
    width: layout.width - 70,
  }),
  card: layout => ({
    flexDirection: 'row',
    maxWidth: layout.width - 150,
  }),
  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },

  Group3310: {
    display: 'flex',
    flexDirection: 'row',
  },

  Txt1610: {
    fontSize: 12,
    paddingBottom: 3,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
  },

  Group354: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(36,195,142,0.5)',
  },
  icon: color => ({
    backgroundColor: 'transparent',
    color: color ? color : 'rgba(0,0,0,1)',
    fontSize: 18,
    opacity: 0.8,
  }),
});
