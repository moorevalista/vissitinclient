import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Header from "../components/Header";
import Svg, { Ellipse } from "react-native-svg";
import Footermenu from "../components/Footermenu";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

function Hasilpencarian(props) {
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
          <TouchableOpacity key={item.id_nakes} style={styles.group} onPress={() => openProfilNakes(item.id_nakes)}>
            <View style={styles.rect1}>
              <View style={styles.namanakesColumnRow}>
                <View style={styles.namanakesColumn}>
                  <Text style={styles.namanakes}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                  <Text style={styles.layanan}>{jenisLayanan}</Text>
                  <Text style={styles.pendidikannakes}>Pendidikan : {item.pendidikan}</Text>
                  <Text style={styles.sertifikasinakes}>Sertifikasi : {item.sertifikasi}</Text>
                  {id_profesi === undefined ?
                    <Text style={styles.jarak}>Jarak : {parseFloat(item.distance).toFixed(2)} Km</Text>
                    :
                    <></>
                  }
                </View>
                {/*<View style={styles.rating}>
                  <View style={styles.ellipseStack}>
                    <Svg viewBox="0 0 60 55" style={styles.ellipse}>
                      <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>5.0</Text>
                      </View>
                      <Ellipse
                        strokeWidth={0}
                        fill="rgba(0,0,0,1)"
                        cx={28}
                        cy={28}
                        rx={28}
                        ry={28}
                      ></Ellipse>
                    </Svg>
                  </View>
                </View>*/}
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

  return (
    !loading ?
    <>
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
              <Header style={styles.header} props={props} />
              <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={getJadwal}
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                      <View style={styles.textColumn}>
                        <Text style={styles.text}>HASIL{"\n"}PENCARIAN</Text>
                        
                          <RenderNakes />
                          {shouldFetch ? <ActivityIndicator style={styles.group} size="small" color="#0000ff" /> : <></>}

                      </View>
                  </View>
                </View>
              </ScrollView>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
    </>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '25%'
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  header: {
    height: 75
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
    padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  textColumn: {
    marginTop: '4%',
    padding: '2%'
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center"
  },
  group: {
    flex: 1,
    marginTop: '4%'
  },
  rect1: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  namanakesColumnRow: {
    flexDirection: "row",
    padding: '2%'
  },
  namanakesColumn: {
    flex: 0.8
  },
  namanakes: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontWeight: 'bold'
  },
  layanan: {
    fontFamily: "roboto-regular",
    color: "#FF3F26",
    fontWeight: 'bold'
  },
  pendidikannakes: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  sertifikasinakes: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  jarak: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  rating: {
    flex: 0.2,
    flexDirection: 'column',
    alignItem: 'center'
  },
  ellipseStack: {
  },
  ellipse: {
    flexDirection: 'row',
  },
  ratingBox: {
    flex: 1,
    flexDirection: 'row',
    alignItem: 'center'
  },
  ratingText: {
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    paddingLeft: '23.5%'
  },
  footer: {
    height: '10%'
  },
});

export default Hasilpencarian;
