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
import { Icon } from 'react-native-elements';

export default function ProfileNakesKhusus(props) {
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

  async function onSelectPaket(e) {
    await setLoadingSave(true);
    await setJenisPaket(e);
    await setLoadingSave(false);
  }

  function RenderPaket() {
    const newItems = dataNakes.data_paket;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_paket} style={styles._0800(layout)}>
            <RadioButton
              color='blue'
              value={item.jenis_paket}
              status={jenisPaket === item.jenis_paket ? 'checked' : 'unchecked'}
              onPress={() => onSelectPaket(item.jenis_paket)}
            />
            <Text style={styles.txtRadio}>{item.deskripsi}</Text>
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
        <View style={styles.boxTop} key={nakes.id_nakes}>
          <View>
            <View style={styles.Group4010(layout)}>
              <View>
                <Text style={styles.Txt647}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>{jenisLayanan}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Pendidikan : </Text>
                  <Text style={styles.Txt1610}>{nakes.pendidikan}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Sertifikasi : </Text>
                  <Text style={styles.Txt1610}>{nakes.sertifikasi}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Tempat Praktik : </Text>
                  <Text style={styles.Txt1610}>
                    {nakes.company}
                  </Text>
                </View>
                {/*<View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Jarak : </Text>
                  <Text style={styles.Txt1610}>{dataNakes.jarak}</Text>
                </View>*/}
              </View>
            </View>
            <View style={[styles.Group4011(layout), {maxHeight: 100}]}>
                <Text style={styles.Txt142}>Tentang Saya</Text>

                <ScrollView
                  horizontal={false}
                  contentContainerStyle={styles.scrollArea_contentContainerStyle}
                >
                  <Text style={[styles.Txt980, {flex: 1}]}>
                    {nakes.about_me}
                  </Text>
                </ScrollView>
              </View>
          </View>
          <View>
            <Text style={styles.Txt885}>JADWAL PAKET TERSEDIA</Text>
            {/*<Text style={styles.Txt287}>Minggu, 10 Juni 2022</Text>*/}
            <RenderPaket />
          </View>
          <View style={[styles.group1(layout), {flex: 1, maxHeight: 100}]}>
            <Text style={styles.Txt2878(layout)}>
              Saat ini Layanan Paket Khusus hanya tersedia untuk jenis layanan
              Home Care saja.
            </Text>
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
    }else {
      return (
        <View style={styles.group6}><Text style={{fontStyle: 'italic'}}>Data Nakes tidak ditemukan...</Text></View>
      )
    }
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const [checked, setChecked] = useState('');

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
            <SafeAreaView style={styles.container}>
              <View
                style={styles.Profil_nakes}
                onLayout={event => setLayout(event.nativeEvent.layout)}>
                <View style={styles.Group554}>
                  <ScrollView
                    horizontal={false}
                    contentContainerStyle={[styles.scrollArea_contentContainerStyle, {flex: 1}]}
                  >
                    <RenderNakes />
                  </ScrollView>
                </View>
              </View>
            </SafeAreaView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  boxTop: {
    //flex: 1,
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
  group1: layout => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: layout.width - 70,
  }),

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Profil_nakes: {
    top: 25,
    flexDirection: 'column',
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //backgroundColor: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(52,65,70,1)',
    width: layout.width - 70,
  }),
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
  Txt2878: layout => ({
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
  }),
  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },
  Group554: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    width: layout.width - 120,
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
