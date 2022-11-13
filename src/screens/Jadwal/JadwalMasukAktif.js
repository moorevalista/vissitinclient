import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import IconPanah from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';

import FooterListener from '../../FooterListener';
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
import Scanner from '../../components/Scanner';
import { CommonActions } from '@react-navigation/native';

// import {NavBar} from '../../components/';

export default function JadwalMasukAktif(props) {
  const formValidation = useContext(form_validation);
  const [currentScreen, setCurrentScreen] = useState(props.route.name);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataJadwal, setDataJadwal] = useState([]);
  const [dataJadwalDetail, setDataJadwalDetail] = useState([]);
  const [reqParams, setReqParams] = useState('');

  //for check in
  const [allowCheckIn, setAllowCheckIn] = useState(false);
  const [paramsCheck, setParamsCheck] = useState(''); //to footer event

  //for checkout
  const [paymentState, setPaymentState] = useState(false);

  const [scanner, setScanner] = useState(false);
  const [codeUrl, setCodeUrl] = useState('');

  const scannerRef = useRef();
  const refQRCode = useRef();

  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };

  const QRCODE = () => {
    return (
      <RBSheet
        ref={refQRCode}
        closeOnDragDown={false}
        closeOnPressMask={false}
        animationType="fade"
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: 'rgba(36,195,142,1)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '80%',
          },
          draggableIcon: {
            backgroundColor: 'transparent',
          },
        }}>
        <View style={styles.Email_bantuan}>
          <View style={styles.wrapperJangan}>
            <View style={styles.Kirim_email}>
              <Text style={styles.multiple}>SCAN QR-CODE</Text>
              <Text style={styles.multiple1}>
                QR-CODE Scanner digunakan untuk konfirmasi tenaga professional
                kami telah selesai dengan aktivitasnya layanannya.
              </Text>
            </View>
            <TouchableOpacity onPress={() => refQRCode.current.close()}>
              <View style={styles.Tbl_iconClose}>
                <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'stretch',
            }}>
            <View style={styles.Box}>
              <Scanner scanner={scanner} setScanner={setScanner} setCodeUrl={setCodeUrl} />
            </View>
            <Text style={styles.Txt6105}>Posisikan Barcode didalam kotak</Text>
          </View>
        </View>
      </RBSheet>
    );
  };

  //timeout saat allow Check in
  let timer = 0;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async(val = null) => {
    if(val) {
      setRefreshing(true);
      const success = await checkAfterPayment();

      if(success) {
        setRefreshing(false)
        //setLoadingFetch(false);
      }else {
        setRefreshing(true);
        //setLoadingFetch(true);
      }
    }
    //wait(2000).then(() => setRefreshing(false));
  });

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  useEffect(() => {
    getLoginData();

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    setDataParamsCheck();

    return () => {
      setLoadingFetch(false);
    }
  }, [dataJadwal, allowCheckIn, paymentState]);

  useEffect(() => {
    if(codeUrl !== '' && !scanner) {
      handlePayment();
    }

    return () => {
      setLoadingFetch(false);
    }
  }, [codeUrl]);

  useEffect(() => {
    scanner ? scrollToBottom():'';

    return () => {
      setLoadingFetch(false);
    }
  }, [scanner]);

  useEffect(() => {
    if(allowCheckIn) {
      timer = setTimeout(() => {
        if(loadingSave) {
          setLoadingSave(false);
          setAllowCheckIn(false);
            
          formValidation.showError("Gagal mendapatkan respon dari Nakes.\n- Pastikan Nakes sudah tiba.\n- Pastikan aplikasi Nakes dalam kondisi aktif.\n- Konfirmasi kepada Nakes untuk masuk ke halaman Check-in.");
        }
      }, 15000);
    }

    return () => clearTimeout(timer);
  },[allowCheckIn]);

  const scrollToBottom = () => {
    scannerRef.current.scrollToEnd({ animated: true })
    //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const setParamsForCheckin = async (params, id_paket) => {
    //alert('kopet');
    //console.log(params);
    const newItems = params.filter(
      item => item.detail_order_state === 'REQCHECKIN'
    );
    if(newItems.length > 0) {
      //console.log(newItems);
      const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
      //console.log(data);
      if(data !== null) {
        await setReqParams(data);
      }else {
        let reqParams = [];
        reqParams.push({
          type: 'checkin',
          value: newItems[0].id_jadwal,
          value2: id_paket,
          value3: newItems[0].id_detail
        });
        await setReqParams(reqParams);
        await AsyncStorage.setItem('reqParams', JSON.stringify(reqParams));
      }
    }
  }

  const setDataSource = async () => {
    //const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
    //console.log(data);
    //await setReqParams(data);
    await setDataJadwal(props.route.params.dataJadwal);

    if(props.route.params.dataJadwal[0].id_paket !== '1') {
      if(props.route.params.dataJadwal[0].default_state === 'CLOSE') {
        await getReservationDetailClose(props.route.params.dataJadwal[0].id_jadwal, 'CLOSE');
      }else if(props.route.params.dataJadwal[0].default_state === 'CANCEL') {
        await getReservationDetailClose(props.route.params.dataJadwal[0].id_jadwal, 'CANCEL');
      }else {
        success = await getReservationDetail(props.route.params.dataJadwal[0].id_jadwal);
        await setParamsForCheckin(success, props.route.params.dataJadwal[0].id_paket);
      }

    }else {
      //set params for confirm check-in
      if(props.route.params.dataJadwal[0].order_state === 'REQCHECKIN') {
        const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
        //console.log(data);
        if(data !== null) {
          await setReqParams(data);
        }else {
          let reqParams = [];
          reqParams.push({
            type: 'checkin',
            value: props.route.params.dataJadwal[0].id_jadwal,
            value2: props.route.params.dataJadwal[0].id_paket,
            value3: props.route.params.dataJadwal[0].id_detail
          });
          await setReqParams(reqParams);
          await AsyncStorage.setItem('reqParams', JSON.stringify(reqParams));
        }
      }
    }

    await setLoading(false);
    await setLoadingSave(false);
  }

  const checkForCheckOut = async () => {
    const reqParams = await AsyncStorage.getItem('reqParams');
    
    if(reqParams !== null && JSON.parse(reqParams)[0].type === 'checkout') {
      const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        id_pasien: dataLogin.id_pasien,
        id_jadwal: data[0].value,
        id_paket: data[0].value2,
        id_detail: data[0].value3,
        token: dataLogin.token
      });

      success = await formValidation.getJadwalForCheckOut(params);
    
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          //formValidation.showError(success.res.messages);
        }else {
          await setDataJadwal(success.res.data);
          if(success.res.data[0].id_paket !== '1') {
            await getReservationDetail(success.res.data[0].id_jadwal);
          }
        }
      }
    }
    return true;
  }

  const checkAfterPayment = async () => {
    const reqParams = await AsyncStorage.getItem('reqParams');
    
    if(reqParams !== null && JSON.parse(reqParams)[0].type === 'checkout') {
      const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        id_pasien: dataLogin.id_pasien,
        id_jadwal: data[0].value,
        id_paket: data[0].value2,
        id_detail: data[0].value3,
        token: dataLogin.token
      });

      success = await formValidation.getJadwalAfterPayment(params);
    
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          //formValidation.showError(success.res.messages);
        }else {
          await setDataJadwal(success.res.data);
          if(success.res.data[0].id_paket !== '1') {
            await getReservationDetailClose(success.res.data[0].id_jadwal, 'CLOSE');
          }
          await AsyncStorage.removeItem('reqParams');
        }
      }
    }
    return true;
  }

  const getCurrentJadwal = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('reqParams'));
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      id_jadwal: data[0].value,
      token: dataLogin.token,
    });

    success = await formValidation.getJadwalForCheckIn(params);
    
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        await setDataJadwal(success.res.data);
        if(success.res.data[0].id_paket !== '1') {
          await getReservationDetail(success.res.data[0].id_jadwal);
        }
        //alert(JSON.stringify(success.res.data));
      }
    }
    clearTimeout(timer);
    setLoadingSave(false);
  }

  function setDataParamsCheck() {
    let data = [];
    data.push({
      allowCheckIn: allowCheckIn,
      getCurrentJadwal: getCurrentJadwal,
      currentScreen: currentScreen,
      checkForCheckOut: checkForCheckOut,
      paymentState: paymentState,
      afterPayment: afterPayment
    });
    setParamsCheck(data);
  }

  const confirmCheckIn = async () => {
    await setLoadingSave(true);
    await setAllowCheckIn(true);
  }

  const openLiveCamera = async () => {
    formValidation.showError('Fitur ini belum tersedia...');
  }

  const getReservationDetail = async (e) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: e,
      token: dataLogin.token
    });

    success = await formValidation.getReservationDetail(params);

    if(success.status === true) {
      setDataJadwalDetail(success.res);
      return(success.res);
    }
  }

  const getReservationDetailClose = async (e, status) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: e,
      token: dataLogin.token,
      state: status
    });

    success = await formValidation.getReservationDetail(params);

    if(success.status === true) {
      setDataJadwalDetail(success.res);
    }
  }

  async function openChat() {
    props.navigation.navigate('chatPage', { base_url: props.route.params.base_url, id_chat: dataJadwal[0].id_chat, onRefresh: onRefresh });
  }

  async function openScanner() {
    await setScanner(!scanner);
  }

  const handlePayment = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      url: codeUrl,
      token: dataLogin.token
    });

    success = await formValidation.updatePayment(params);

    if(success.status ===  true) {
      if(success.res.responseCode !== '000') {
        await formValidation.showError('Kode yang anda scan tidak sesuai...');
      }else {
        await setPaymentState(true);
        await afterPayment();
      }
    }
  }

  const afterPayment = async () => {
    //await AsyncStorage.removeItem('reqParams');
    onRefresh(true);
  }

  const openPayment = async() => {
    await setLoadingSave(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_pasien: dataLogin.id_pasien,
      id_nakes: dataJadwal[0].id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getPaymentPayload(params);
    await setLoadingSave(false);
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError('Terjadi kesalahan...');
      }else {

        if(dataJadwal[0].trxIdFlip === '') {
          // console.log(success.res.data.payloads.link_url.replace('flip.id/', formValidation.flipPaymentUrl));
          // props.navigation.navigate('payment', { newPayment: true, dataLogin: dataLogin, id_jadwal: dataJadwal[0].id_jadwal, url: success.res.data.payloads.link_url.replace('flip.id/', formValidation.flipPaymentUrl) });

          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'MainApp',
                },
                {
                  name: 'payment',
                  params: { newPayment: true, dataLogin: dataLogin, id_jadwal: dataJadwal[0].id_jadwal, url: success.res.data.payloads.link_url.replace('flip.id/', formValidation.flipPaymentUrl) },
                }
              ],
            })
          )
          
        }else {
          // console.log(formValidation.flipPaymentUrlConsolidation + dataJadwal[0].trxIdFlip);
          // props.navigation.navigate('payment', { newPayment: false, dataLogin: dataLogin, id_jadwal: dataJadwal[0].id_jadwal, url: formValidation.flipPaymentUrlConsolidation + dataJadwal[0].trxIdFlip });

          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'MainApp',
                },
                {
                  name: 'payment',
                  params: { newPayment: false, dataLogin: dataLogin, id_jadwal: dataJadwal[0].id_jadwal, url: formValidation.flipPaymentUrlConsolidation + dataJadwal[0].trxIdFlip },
                }
              ],
            })
          )
        }
        // console.log(formValidation.flipPaymentUrl + success.res.data.payloads.link_id);
        // props.navigation.navigate('payment', { url: formValidation.flipPaymentUrl + success.res.data.payloads.link_id }); //test mode
      }
    }
    // props.navigation.navigate('payment', { url: success.res.data.link_url.replace('flip.id/', formValidation.flipPaymentUrl) });
  }

  function RenderJadwalDetail() {
    const newItems = dataJadwalDetail;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <Text key={item.id_detail} style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib' + ' | ' + item.detail_order_state}</Text>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function RenderJadwal() {
    const item = dataJadwal[0];
    let newItems = '';
    let status = '';
    let order_state = '';
    let thumbProfile = '';

    if(item) {
      thumbProfile = props.route.params.base_url + 'data_assets/fotoProfileNakes/' + item.foto_profile;
      if(item.id_paket !== '1') {
        //console.log(reqParams);
        if(reqParams !== null && reqParams[0] !== undefined && reqParams[0].value === item.id_jadwal) {
          newItems = dataJadwalDetail.filter(
            item => item.id_detail === reqParams[0].value3
          );
        }else {
          newItems = dataJadwalDetail;
        }
        if(newItems) {
          order_state = newItems[0].detail_order_state;
        }
      }else {
        order_state = item.order_state;
      }
      switch(order_state) {
        case 'OPEN':
          status = 'Menunggu Konfirmasi Nakes';
          break;
        case 'CONFIRM':
          status = 'Reservasi Diterima Oleh Nakes';
          break;
        case 'REQCHECKIN':
          status = 'Nakes Sudah Tiba dan Hendak Check In.';
          break;
        case 'ONSITE':
          status = 'Nakes On Site';
          break;
        case 'CHECKOUT':
          status = 'Menunggu Pembayaran';
          break;
        case 'CLOSE':
          status = 'Selesai';
          break;
        case 'ONGOING':
          status = 'Aktif';
          break;
        case 'CANCEL':
          status = 'Dibatalkan';
          break;
        default:
          break;
      }

        let order_price = parseFloat(item.total_price);
        let platform_fee = parseFloat(item.biaya_platform);
        let sewa_alat = parseFloat(0);
        let sewa_tempat = parseFloat(0);
        let total_price = (order_price + sewa_alat + sewa_tempat);
        let total_income = (order_price + sewa_alat + sewa_tempat);

        const total_bill = formValidation.convertDecimal(total_price.toString());

      return (
        <View key={item.id_jadwal}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                paddingTop: 10,
              }}>
          <View style={styles.wrapperCardAtas}>
            <View style={styles.Group378}>
              <View style={styles.Jenis_layanan_kiri}>
                <Text style={styles.Txt319}>Kategori Layanan</Text>
                <Text style={styles.Txt656}>{item.order_type}</Text>
              </View>
              <View style={styles.Jenis_layanan_kanan}>
                <Text style={styles.Txt319}>Jenis Layanan</Text>
                <Text style={styles.Txt656}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
              </View>
            </View>
            <View style={styles.Group378}>
              <View style={styles.Jenis_layanan_kiri}>
                <Text style={styles.Txt319}>Tarif Layanan</Text>
                <Text style={styles.Txt656}>Rp. {total_bill}</Text>
              </View>
              <View style={styles.Jenis_layanan_kanan}>
                <Text style={styles.Txt319}>Metode Pembayaran</Text>
                <Text style={styles.Txt656}>{item.payment_type.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.Group378}>
              <View style={styles.Jenis_layanan_kiri}>
                <Text style={styles.Txt319}>Nama Pasien</Text>
                <Text style={styles.Txt656}>
                  {item.pasien_name}
                </Text>
              </View>
              <View style={styles.Jenis_layanan_kanan}>
                <Text style={styles.Txt319}>Nama Nakes</Text>
                <Text style={styles.Txt656}>{item.nakes}</Text>
              </View>
            </View>

            <View style={styles.Jadwal1}>
              <Text style={styles.Txt091}>Jadwal Reservasi</Text>
              {item.id_paket === '1' ?
                <Text style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                :
                <RenderJadwalDetail />
              }
            </View>

            <View style={styles.Jadwal1}>
              <Text style={styles.Txt091}>Gejala / Keluhan</Text>
              <Text style={styles.Txt710}>{item.order_note}</Text>
            </View>
          </View>
          <View style={styles.wrapperLingkaran}>
            <View style={styles.wrapperLingkaranKiriKanan} />
            <View style={styles.wrapperLingkaranKiriKanan} />
          </View>
          <View style={styles.wrapperCardBawah}>
            <View style={styles.Jadwal1}>
              <Text style={styles.Txt091}>Kode Booking</Text>
              <Text style={styles.Txt710}>{item.booking_code}</Text>
            </View>
            <View style={styles.Status_reservasi}>
              <Text style={styles.Txt091}>Status Reservasi</Text>
              <Text style={[styles.Txt710, {color: 'red'}]}>{status}</Text>
            </View>
          

            {item.order_state !== 'OPEN' && (item.id_chat !== '' && item.order_state !== 'CLOSE' && item.order_state !== 'CANCEL')  ?
              <TouchableOpacity style={styles.Btn_lanjut} onPress={openChat}>
                <Text style={styles.Txt060}>CHAT NAKES</Text>
              </TouchableOpacity>
              :<></>
            }

            {item.order_state === 'CONFIRM' && item.payment_state === 'OPEN' ?
              <>
                <TouchableOpacity style={styles.Btn_bayar} onPress={openPayment}>
                  <Text style={styles.Txt060}>BAYAR SEKARANG</Text>
                </TouchableOpacity>
                <Text style={styles.Txt680}>
                  *Lakukan pembayaran paling lambat 1 jam sebelum jadwal kunjungan.
                </Text>
              </>
              :<></>
            }

            {order_state === 'CHECKOUT' ?
              <TouchableOpacity style={styles.Btn_scan} onPress={openScanner}>
                <Text style={styles.Txt060}>{scanner ? 'TUTUP' : 'SCAN'}</Text>
              </TouchableOpacity>
              :<></>
            }

            
            {scanner ?
              <>
              <View style={styles.Group546}>
                <Text style={styles.Txt484}>METODE KONFIRMASI SELESAI</Text>
                <View style={styles.Group814}>
                  <TouchableOpacity
                    onPress={() => refQRCode.current.open()}
                    style={styles.Tbl_bertemu}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="scan" />
                    </View>
                    <Text style={styles.Txt981}>SCAN</Text>
                    <Text style={styles.Txt981}>QR-CODE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openLiveCamera}
                    style={styles.Tbl_live_cam}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="camera" />
                    </View>
                    <Text style={styles.Txt981}>LIVE </Text>
                    <Text style={styles.Txt981}>CAMERA</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <QRCODE />
              </>
              :<></>}

            {order_state === 'REQCHECKIN' ?
              <View style={styles.labelRow}>
                <Image
                  source={{uri: thumbProfile}}
                  resizeMode="cover"
                  style={styles.image}
                />
              </View>
              :
              <></>
            }

            {order_state === 'REQCHECKIN'?
              <View style={styles.Group546}>
                <Text style={styles.Txt484}>METODE KONFIRMASI KEHADIRAN</Text>
                <View style={styles.Group814}>
                  <TouchableOpacity
                    style={styles.Tbl_bertemu}
                    onPress={confirmCheckIn}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="people" />
                    </View>
                    <Text style={styles.Txt981}>BERTEMU</Text>
                    <Text style={styles.Txt981}>LANGSUNG</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Tbl_live_cam}
                    onPress={openLiveCamera}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="camera" />
                    </View>
                    <Text style={styles.Txt981}>LIVE </Text>
                    <Text style={styles.Txt981}>CAMERA</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              <></>
            }
          </View>
        </View>
      )
    }else {
      return (
        <></>
      )
    }
  }

  return (
    !loading ?
    <>
    {/*<NavBar props={props} label="JADWAL RESERVASI" />*/}
    <SafeAreaView style={styles.containerKey}>
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
            
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    ref={scannerRef}
                  >
              <RenderJadwal />
            </ScrollView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <FooterListener props={props} paramsCheck={paramsCheck}/>
    </SafeAreaView>
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
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  labelRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: '4%'
  },
  image: {
    width: '50%',
    height: 200,
    borderRadius: 10,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    paddingBottom: '10%'
  },

  Txt656: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
  },
  Txt319: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
  },

  Jenis_layanan_kiri: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
    maxWidth: '50%',
  },
  Jenis_layanan_kanan: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
    maxWidth: '50%',
  },

  Jadwal1: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  Txt710: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt091: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Group378: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  wrapperCardAtas: {
    marginBottom: -15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  wrapperCardBawah: {
    marginTop: -14,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  wrapperLingkaran: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 1, //For iOS
    elevation: 1,
  },
  wrapperLingkaranKiriKanan: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Btn_lanjut: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
  },
  Btn_bayar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(239,70,62,1)',
    height: 40,
  },
  Btn_scan: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(239,70,62,1)',
    height: 40,
  },
  Txt060: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Group546: {
    flexDirection: 'column',
    paddingTop: 20,
    marginHorizontal: 20,
  },
  Txt484: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    marginBottom: 9,
  },
  Group814: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  Tbl_bertemu: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 19,
    paddingBottom: 9,
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(251,176,64,1)',
  },
  Status_reservasi: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 9,
  },
  Txt680: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(239,70,62,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  Txt981: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
  Tbl_live_cam: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 19,
    paddingBottom: 9,
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(36,195,142,1)',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    marginBottom: 10,
    width: 50,
    height: 50,
  },
  Tbl_iconClose: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    //marginBottom: 10,
    width: 20,
    height: 20,
    marginLeft: 20
  },

  Email_bantuan: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  wrapperJangan: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  Kirim_email: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  multiple: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  multiple1: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    textAlign: 'justify',
    color: 'rgba(255, 255, 255, 1)',
  },
  Box: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 1)',
    marginVertical: 5,
    height: '60%',
  },
  Txt6105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
});
