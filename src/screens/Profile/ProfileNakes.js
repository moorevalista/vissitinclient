import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {RadioButton} from 'react-native-paper';

import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';

export default function ProfilNakes(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [jadwalNakes, setJadwalNakes] = useState([]);
  const [id_nakes_detail, setId_nakes_detail] = useState('');
  const [paramsData, setParamsData] = useState('');
  const [pasienData, setPasienData] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  const [waktuBooking, setWaktuBooking] = useState('');

  //id faskes jika reservasi FASKES
  const [id_faskes, setId_faskes] = useState(props.route.params.id_faskes);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

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
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);

  const setDataSource = async () => {
    await setJadwalNakes(props.route.params.jadwalNakes);
    await setId_nakes_detail(props.route.params.id_nakes_detail);
    await setParamsData(props.route.params.params);
    await setPasienData(props.route.params.pasienData);
    await setDataKerabat(props.route.params.dataKerabat);

    await setLoading(false);
  }

  function RenderNakesDetail() {
    /*const newItems = jadwalNakes.result.filter(
      item => item.id_nakes === id_nakes_detail
    );*/

    const newItems = jadwalNakes;

    if(newItems) {

      return newItems.map((item, index) => {
        let rowTime = [];

        const jadwal = item.jadwal;
        jadwal.map((key, i) => {
          let jam = jadwal[i].jam_praktek;
          jam.sort();

          jam.map(jadwal => {
            rowTime.push(
              <View key={jadwal} style={styles._0800(layout)}>
                <RadioButton
                  color='blue'
                  value={jadwal}
                  status={waktuBooking === jadwal ? 'checked' : 'unchecked'}
                  onPress={() => onSelectTime(jadwal)}
                />
                <Text style={styles.txtRadio}>{jadwal + ' WIB'}</Text>
              </View>
            )
          })
        })

        return (
          <View style={styles.boxTop} key={item.id_nakes}>
            <View style={styles.box}>
              <View style={styles.Group4010(layout)}>
                <View>
                  <Text style={styles.Txt647}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                  <View style={styles.card(layout)}>
                    <Text style={styles.Txt1610}>{jenisLayanan}</Text>
                  </View>
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
                    <Text style={styles.Txt1610}>
                      {item.company}
                    </Text>
                  </View>
                  {id_faskes === undefined ?
                    <View style={styles.card(layout)}>
                      <Text style={styles.Txt1610}>Jarak : </Text>
                      <Text style={styles.Txt1610}>
                      <Text style={styles.label}>{parseFloat(item.distance).toFixed(2)} km</Text>
                      </Text>
                    </View>
                    :
                    <></>
                  }
                </View>
              </View>
              <View style={[styles.Group4011(layout), {flex: 1, maxHeight: 100}]}>
                <Text style={styles.Txt142}>Tentang Saya</Text>

                <ScrollView
                  horizontal={false}
                  contentContainerStyle={styles.scrollArea_contentContainerStyle}
                >
                  <Text style={[styles.Txt980, {flex: 1}]}>
                    {item.about_me}
                  </Text>
                </ScrollView>
              </View>
            </View>
            <View style={[styles.boxTop(layout), {flex: 1}]}>
              <Text style={styles.Txt885}>JADWAL TERSEDIA</Text>
              <Text style={[styles.Txt287, {marginBottom: 10}]}>{moment(paramsData[0].startDate).format('dddd') + ', ' + moment(paramsData[0].startDate).format('DD MMM YYYY')}</Text>
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
                {rowTime}
              </ScrollView>
            </View>
            <View style={styles.Group1039}>
              {/*<TouchableOpacity
                style={styles.Btn_lanjut(layout)}
                onPress={() => alert('Batal')}>
                <Text style={styles.Txt721}>BATAL</Text>
              </TouchableOpacity>*/}
              <TouchableOpacity
                style={styles.Btn_lanjut1(layout)}
                onPress={onSelectJadwal}>
                <Text style={styles.Txt721}>LANJUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
    }
  }

  function onSelectTime(e) {
    setWaktuBooking(e);
  }

  function onSelectJadwal() {
    waktuBooking !== '' ?
      props.navigation.navigate('konfirmasiLayanan', { base_url: props.route.params.base_url, pasienData: pasienData, params: paramsData, dataKerabat: dataKerabat, jadwalNakes: jadwalNakes, waktuBooking: waktuBooking, id_profesi: id_profesi, jenisLayanan: jenisLayanan, id_faskes: id_faskes })
      :
      formValidation.showError('Anda belum memilih jam layanan...');
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

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
            <View style={styles.Profil_nakes} onLayout={event => setLayout(event.nativeEvent.layout)}>
              <View style={styles.Group554}>
                <ScrollView
                  horizontal={false}
                  contentContainerStyle={styles.scrollArea_contentContainerStyle}
                >
                  <RenderNakesDetail />
                </ScrollView>
              </View>
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
    height: 'auto',
  },
  txtRadio: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    padding: 10,
    marginLeft: 30,
    zIndex: -1
  },
  Profil_nakes: {
    flex: 1,
    top: 25,
  },
  Group554: {
    flex: 1,
    display: 'flex',
  },
  boxTop: layout => ({
    //flex: 1,
    maxHeight: layout.height - 300,
  }),
  box:{
    flex: 1,
    alignItems: 'center',
  },
  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //backgroundColor: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(52,65,70,1)',
    width: layout.width - 70,
  }),

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  
  Group4011: layout => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(145,225,199,1)',
    width: layout.width - 70,
  }),
  card: layout => ({
    flexDirection: 'row',
    maxWidth: layout.width - 150,
  }),
  Txt1610: {
    fontSize: 12,
    paddingBottom: 3,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
  },
  Txt287: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },
  

  Txt142: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 5,
  },
  Txt980: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'justify',
    paddingBottom: 10,
  },

  Txt885: {
    paddingTop: 25,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  _0800: layout => ({
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(145,225,199,1)',
    width: layout.width - 240,
  }),

  Group1039: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 10,
  },
  Btn_lanjut: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 19,
    paddingRight: 19,
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    width: layout.width - 250,
  }),
  Txt721: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Btn_lanjut1: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    width: layout.width - 180,
  }),
});
