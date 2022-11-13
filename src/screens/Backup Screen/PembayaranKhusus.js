import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Btnproses from "../components/Btnproses";
import Btnbatal from "../components/Btnbatal";
import Footermenu from "../components/Footermenu";
import Header from "../components/Header";
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
import { CommonActions } from '@react-navigation/native';

function PembayaranKhusus(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [paramsData, setParamsData] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  const [paymentMethod, setPaymentMethod] = useState('');

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

  const setDataSource = async () => {
    await setParamsData(props.route.params.params);
    await setPaymentMethod(props.route.params.paymentMethod);

    await setLoading(false);
  }

  function RenderJadwal() {
    const newItems = paramsData[0].jadwalTerpilih;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.tgl + '|' + item.waktu}>
            <Text style={styles.label2}>{moment(item.tgl).format('dddd') + ', ' + moment(item.tgl).format('DD MMM YYYY') + ' -> ' + item.waktu + ' wib'}</Text>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function RenderNakes() {
    const nakes = paramsData[0].dataNakes;
    const item = paramsData[0].dataPaket;

    let total = 0;

    if(item) {
        total = (item.biaya_layanan - item.biaya_potongan);
        return (
          <View key={item.id_nakes}>
            <View style={styles.group}>
              <View style={styles.rect1Stack}>
                <View style={styles.group2}>
                  <View style={styles.rect2}>
                    <Text style={styles.namanakes1}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
                  </View>
                </View>
                <View style={styles.rect1}>
                  <View style={styles.content}>
                    <View style={styles.group3}>
                      <Text style={styles.layanan}>{jenisLayanan}</Text>
                      {/*<Text style={styles.jarak}>Jarak : {parseFloat(item.distance).toFixed(2)} km</Text>*/}
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>JADWAL</Text>
                      <RenderJadwal />
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>TOTAL TAGIHAN</Text>
                      <Text style={styles.label2}>{formValidation.currencyFormat(total.toString())}</Text>
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>Metode Pembayaran</Text>
                      <Text style={styles.label2}>{paymentMethod.toUpperCase()}</Text>
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>No. Virtual Account</Text>
                      <Text style={styles.label2}>-</Text>
                      <Icon name="docs" style={styles.icon}></Icon>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.group5}>
              <Btnproses style={styles.btnproses1} onProses={onProses} />
            </View>
          </View>
        )
    }else {
      return (
        <></>
      )
    }
  }

  async function onProses() {
    setLoadingSave(true);

    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      token: dataLogin.token,
      id_pasien: paramsData[0].id_pasien,
      id_nakes: paramsData[0].dataNakes.id_nakes,
      service_user: paramsData[0].serviceUser === 'pribadi' ? 'self' : 'family',
      id_kerabat: paramsData[0].dataKerabat[0].id_kerabat !== '' ? paramsData[0].dataKerabat[0].id_kerabat : '',
      order_type: paramsData[0].jenisLayanan,
      jadwal_paket: paramsData[0].jadwalTerpilih,
      data_paket: paramsData[0].dataPaket,
      payment_type: paymentMethod
    });

    success = await formValidation.handleSubmitReservasiKhusus(params);

    if(success.status === true) {
      if(success.res.responseCode === '000') {
        let params = [];
        params.push({
          base_url: props.route.params.base_url,
          token: dataLogin.token,
          id_nakes: paramsData[0].dataNakes.id_nakes,
          id_jadwal: success.res.id_jadwal,
          notif_type: 'reservasi'
        })

        success = await formValidation.sendNotif(params);

        if(success.status === true) {
          redirect();
        }else {
          redirect();
        }

      }else {
        await formValidation.showError(success.res.messages);
        setLoadingSave(false);
      }
    }else {
      await formValidation.showError(success.msg);
      setLoadingSave(false);
    }
    //setLoadingSave(false);
  }

  const redirect = () => {
    props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'homeScreen',
                params: { base_url: props.route.params.base_url },
              },
              {
                name: 'notifikasiScreen',
                params: {
                  base_url: props.route.params.base_url,
                  msg: success.res.messages
                }
              }
            ],
          })
        );
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
                    <View>
                      <Text style={styles.prosesPembayaran}>PROSES{"\n"}PEMBAYARAN</Text>
                      <RenderNakes />
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
  prosesPembayaran: {
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
    marginBottom: '5%'
  },
  layanan: {
    fontFamily: "roboto-regular",
    fontWeight: 'bold',
    color: "#121212",
    textAlign: "center",
    fontSize: 18,
    marginTop: '1%'
  },
  jarak: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    marginTop: '2%'
  },
  labelGroup: {
    paddingLeft: '5%',
    paddingRight: '5%',
    marginBottom: '5%'
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  label2: {
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  icon: {
    alignSelf: 'center',
    color: "rgba(0,0,0,1)",
    fontSize: 15
  },
  group5: {
  },
  btnproses1: {
    flex: 1,
    padding: '2%',
    marginTop: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)"
  },
  footer: {
    height: '10%'
  }
});

export default PembayaranKhusus;
