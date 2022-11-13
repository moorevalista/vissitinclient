import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
import RadioJamLayanan from "../components/RadioJamLayanan";
import Btnpilih from "../components/Btnpilih";
import Btnfavourite from "../components/Btnfavourite";
import Footermenu from "../components/Footermenu";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';

function Profilnakes(props) {
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
              <View key={jadwal} style={styles.group4}>
                <RadioJamLayanan
                  name="jadwalTersedia"
                  value={jadwal}
                  style={styles.radio}
                  onSelectTime={onSelectTime}
                  waktuBooking={waktuBooking}
                />
                <Text style={styles.jam}>{jadwal + ' wib'}</Text>
              </View>
            )
          })
        })

        return (
          <View key={item.id_nakes}>
            <View style={styles.group6}>
              <View style={styles.rect1Stack}>
                <View style={styles.group2}>
                  <View style={styles.rect2}>
                    <Text style={styles.namanakes1}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                  </View>
                </View>
                <View style={styles.rect1}>
                  <View style={styles.content}>
                    <View style={styles.group3}>
                      <Text style={[styles.label, {color: "#FF3F26", fontWeight: 'bold'}]}>{jenisLayanan}</Text>
                      <Text style={styles.label}>Pendidikan : {item.pendidikan}</Text>
                      <Text style={styles.label}>Sertifikasi : {item.sertifikasi}</Text>
                      <Text style={styles.label}>Tempat Kerja : {item.company}</Text>
                      <Text style={styles.label}>Domisili : {item.nama_kota}</Text>
                      <Text style={styles.label}>Usia : {formValidation.calc_age(item.birth_date)} Tahun</Text>
                      {id_faskes === undefined ?
                        <Text style={styles.label}>Jarak : {parseFloat(item.distance).toFixed(2)} km</Text>
                        :
                        <></>
                      }
                      <Text style={styles.label}>Tentang saya : {item.about_me}</Text>
                      <Text style={styles.label2}>Jadwal Tersedia :</Text>
                      <Text style={[styles.labelDate, {color: "#FF3F26", fontWeight: 'bold'}]}>{moment(paramsData[0].startDate).format('dddd') + ', ' + moment(paramsData[0].startDate).format('DD MMM YYYY')}</Text>
                    </View>
                    {rowTime}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.group}>
              <Btnpilih style={styles.tblpilih} onSelectJadwal={onSelectJadwal} />
              {/*<Btnfavourite style={styles.tbllainnya}></Btnfavourite>*/}
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
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                      <View>
                        <Text style={styles.profilSingkat}>PROFIL{"\n"}SINGKAT</Text>
                        <RenderNakesDetail />
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
    paddingBottom: '25%',
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
  profilSingkat: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center"
  },
  group6: {
    flex: 1,
    marginTop: '4%'
  },
  rect1Stack: {
    flex: 1
  },
  group2: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  rect2: {
    flex: 0.8,
    padding: '2%',
    alignSelf: 'center',
    backgroundColor: "rgba(80,227,194,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 100
  },
  namanakes1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    textAlign: "center"
  },
  rect1: {
    zIndex: -1,
    flex: 1,
    marginTop: -15,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  content: {
    padding: '4%',
    marginTop: '5%'
  },
  group3: {
  },
  label: {
    marginTop: '1%',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: '5%'
  },
  labelDate: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: '2%',
    marginLeft: '2%'
  },
  group4: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '4%'
  },
  radio: {
    flex: 0.1
  },
  jam: {
    flex: 0.9,
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: 'center'
  },
  group: {
  },
  tblpilih: {
    flex: 1,
    padding: '2%',
    marginTop: '2%',
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,1)"
  },
  footer: {
    height: '10%'
  }
});

export default Profilnakes;
