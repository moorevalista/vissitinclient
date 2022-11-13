import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, Image,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Headerjadwal from "../components/Headerjadwal";
import Footermenu from "../components/Footermenu";
import Icon from "react-native-vector-icons/FontAwesome";
import Btnchatnakes from "../components/Btnchatnakes";
import Btnkonfirmasihadir from "../components/Btnkonfirmasihadir";
import Btnscanbarcode from "../components/Btnscanbarcode";
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
import Scanner from '../components/Scanner';
import { CommonActions } from '@react-navigation/native';

function Detailjadwal(props) {
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
      paymentState: paymentState
    });
    setParamsCheck(data);
  }

  const confirmCheckIn = async () => {
    await setLoadingSave(true);
    await setAllowCheckIn(true);
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
    await setScanner(true);
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

  function RenderJadwalDetail() {
    const newItems = dataJadwalDetail;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <Text key={item.id_detail} style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib' + ' | ' + item.detail_order_state}</Text>
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
        <View key={item.id_jadwal}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Kategori Layanan</Text>
            <Text style={styles.label2}>{item.order_type}</Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Jenis Layanan</Text>
            <Text style={styles.label2}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Nama Nakes</Text>
            <Text style={styles.label2}>{item.nakes}</Text>
          </View>
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
          <View style={styles.labelRow}>
            <Text style={styles.label}>Jadwal Reservasi</Text>
            {item.id_paket === '1' ?
              <Text style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
              :
              <RenderJadwalDetail />
            }
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Nominal Pembayaran</Text>
            <Text style={[styles.label2, {color: 'red'}]}>Rp. {total_bill}</Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.label2, {color: 'red'}]}>{status}</Text>
          </View>

          {item.order_state !== 'OPEN' && (item.id_chat !== '' && item.order_state !== 'CLOSE' && item.order_state !== 'CANCEL')  ?
            <Btnchatnakes style={styles.chatnakesbtn}  openChat={openChat}/>
            :<></>
          }
          {order_state === 'REQCHECKIN'?
            <Btnkonfirmasihadir
              style={styles.konfirmasihadirbtn}
              confirmCheckIn={confirmCheckIn}
            />
            :
            <></>
          }
          {order_state === 'CHECKOUT' ?
            <Btnscanbarcode style={styles.scanbarcodebtn} openScanner={openScanner} />
            :<></>
          }

          
          {scanner ?
            <View style={styles.scanner}>
              <Scanner scanner={scanner} setScanner={setScanner} setCodeUrl={setCodeUrl} />
            </View>:<></>}
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
              <Headerjadwal style={styles.header} props={props} />
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
                <View style={styles.container}>
                  <View style={styles.footerpasien1Stack}>
                    <View style={styles.scrollArea}>
                        <View style={styles.group}>
                          <Icon name="calendar-check-o" style={styles.icon1}></Icon>
                          <Text style={styles.terjadwal}>TERJADWAL</Text>
                        </View>

                        <RenderJadwal />

                    </View>
                  </View>
                </View>
              </ScrollView>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} paramsCheck={paramsCheck}/>
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
  group: {
    marginTop: '5%'
  },
  icon1: {
    color: "rgba(2,203,19,1)",
    fontSize: 40,
    alignSelf: "center"
  },
  terjadwal: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    marginTop: '2%',
    alignSelf: "center"
  },
  labelRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: '4%'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    textAlign: "center",
    fontSize: 14
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 17
  },
  chatnakesbtn: {
    padding: '2%',
    borderRadius: 100,
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  konfirmasihadirbtn: {
    padding: '2%',
    borderRadius: 100,
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  scanner: {
    height: 300,
    marginTop: 20,
    marginLeft: 18,
    marginRight: 18
  },
  scanbarcodebtn: {
    padding: '2%',
    borderRadius: 100,
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  image: {
    width: '50%',
    height: 200,
    borderRadius: 10,
  },
  footer: {
    height: '10%'
  }
});

export default Detailjadwal;
