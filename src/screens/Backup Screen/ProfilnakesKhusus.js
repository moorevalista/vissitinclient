import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
import RadioPaket from "../components/RadioPaket";
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
import { Icon } from 'react-native-elements';

function ProfilnakesKhusus(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  //untuk menampung dataset dari database
  const [dataNakes, setDataNakes] = useState('');

  //parameter dari prev page
  const [refCode, setRefCode] = useState('');
  const [serviceUser, setServiceUser] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');

  const [waktuBooking, setWaktuBooking] = useState('');
  const [jenisPaket, setJenisPaket] = useState('');
  const [favorite, setFavorite] = useState(false);

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

  useEffect(() => {
    if(dataNakes) {
      dataNakes.favorite === '1' ? setFavorite(true) : setFavorite(false)
    }
  },[dataNakes]);

  const setDataSource = async () => {
    await setRefCode(props.route.params.refCode);
    await setServiceUser(props.route.params.serviceUser);
    await setDataKerabat(props.route.params.resKerabat);
    await getDataNakes(props.route.params.refCode);
  }

  //render icon favorit
  const RenderIcon = (props) => {
    return (
      <TouchableOpacity style={{flex: 0.2, alignSelf: 'flex-end'}} onPress={addFavorite}>
        <Icon {...props} type="font-awesome-5" color="red" solid={favorite ? true : false} style={styles.icon} name='star'/>
      </TouchableOpacity>
    )
  }

  //add favorite
  const addFavorite = async () => {
    let fav = !favorite;
    await setFavorite(fav);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      id_nakes: dataNakes.id_nakes,
      favorite: fav,
      token: dataLogin.token
    });

    success = await formValidation.addFavorite(params);

    if(success.status === true) {
      if(success.res.responseCode === '000') {
        if(favorite === false) {
          formValidation.showError('Ditambahkan ke Favorit');
        }else {
          formValidation.showError('Dihapus dari Favorit');
        }
      }else {
        formValidation.showError(success.res.messages);
      }
    }
  }

  const getDataNakes = async (e) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
      refCode: e,
      id_profesi: id_profesi
    });

    success = await formValidation.getDataNakes(params);
    
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError(success.res.messages);
      }else {
        setDataNakes(success.res.data);
      }
    }
    setLoading(false);
  }

  function onSelectPaket(e) {
    setJenisPaket(e);
  }

  function RenderPaket() {
    const newItems = dataNakes.data_paket;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_paket} style={styles.group4}>
            <RadioPaket
              name="jenisPaket"
              style={styles.radio}
              value={item.jenis_paket}
              jenisPaket={jenisPaket}
              onSelectPaket={onSelectPaket}
            />
            <Text style={styles.jam}>{item.deskripsi}</Text>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function onSelectJadwal() {
    jenisPaket !== '' ?
      props.navigation.navigate('layananKhusus', {
        base_url: props.route.params.base_url,
        jenisPaket: jenisPaket,
        dataNakes: dataNakes,
        id_profesi: id_profesi,
        jenisLayanan: jenisLayanan,
        refCode: refCode,
        serviceUser: serviceUser,
        dataKerabat: dataKerabat
      })
      :
      formValidation.showError('Anda belum memilih paket layanan...');
  }

  function RenderNakes() {
    const nakes = dataNakes;

    if(nakes) {
      return (
        <View key={nakes.id_nakes}>
          <View>
            <Text style={styles.profilSingkat}>PROFIL{"\n"}SINGKAT</Text>
          </View>
          <View style={styles.group6}>
            <View style={styles.rect1Stack}>
              <View style={styles.group2}>
                <View style={styles.rect2}>
                  <Text style={styles.namanakes1}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
                </View>
              </View>
              <View style={styles.rect1}>
                <View style={styles.content}>
                  <View style={styles.group3}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.label, {flex: 0.8, alignSelf: 'center', color: "#FF3F26", fontWeight: 'bold'}]}>{jenisLayanan}</Text>
                      <RenderIcon />
                    </View>
                    <Text style={styles.label}>Pendidikan : {nakes.pendidikan}</Text>
                    <Text style={styles.label}>Sertifikasi : {nakes.sertifikasi}</Text>
                    <Text style={styles.label}>Tempat Kerja : {nakes.company}</Text>
                    <Text style={styles.label}>Domisili : {nakes.nama_kota}</Text>
                    <Text style={styles.label}>Usia : {formValidation.calc_age(nakes.birth_date)} Tahun</Text>
                    <Text style={styles.label}>Tentang saya : {nakes.about_me}</Text>
                  </View>
                  <View style={styles.group3}>
                    <Text style={styles.label2}>Jadwal Paket Tersedia :</Text>
                  </View>
                  
                  <RenderPaket />

                  {/*<Text style={[styles.label3, {fontSize: 12, color: "#FF3F26", fontStyle: 'italic'}]}>
                      *Pemilihan Tgl dan Jam untuk jadwal paket ini ditentukan
                      oleh tenaga kesehatan berdasarkan kesepakatan selanjutnya.
                  </Text>*/}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.group}>
            <Btnpilih style={styles.tblpilih} onSelectJadwal={onSelectJadwal} />
          </View>
        </View>
      )
    }else {
      return (
        <View style={styles.group6}><Text style={{fontStyle: 'italic'}}>Data Nakes tidak ditemukan...</Text></View>
      )
    }
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
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
                    <RenderNakes />
                  </View>
                </View>
              </ScrollView>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
    </View>
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
  label3: {
    marginTop: '4%',
    color: "#121212"
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
  tblpilih: {
    flex: 1,
    padding: '2%',
    marginTop: '2%',
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,1)"
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    fontSize: 20,
  },
  footer: {
    height: '10%'
  }
});

export default ProfilnakesKhusus;
