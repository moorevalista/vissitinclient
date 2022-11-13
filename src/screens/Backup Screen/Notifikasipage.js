import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Headnotifikasi from "../components/Headnotifikasi";
import Icon from "react-native-vector-icons/Entypo";
import Btnbatal from "../components/Btnbatalres";
import Btnlanjut from "../components/Btnlanjut";
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
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function Notifikasipage(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [buttonCancel, setButtonCancel] = useState(true);
  const [alasan, setAlasan] = useState('');

  //data dari page sebelumnya
  const [dataReservasi, setDataReservasi] = useState([]);
  const [dataReservasiDetail, setDataReservasiDetail] = useState([]);

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
    //alert(JSON.stringify(props.route.params.dataReservasiDetail)); return;
    await setDataReservasi(props.route.params.dataReservasi);
    if(props.route.params.dataReservasi[0].id_paket !== '1') {
      await getReservationDetail(props.route.params.dataReservasi[0].id_jadwal);
    }
    
    await setLoading(false);
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
      setDataReservasiDetail(success.res);
    }
  }

  const onCancel = () => {
    setAlasan('');
    setButtonCancel(!buttonCancel);
  }

  const cancelReservasi = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      id_jadwal: dataReservasi[0].id_jadwal,
      alasan: alasan,
      token: dataLogin.token
    });

    if(alasan === '') {
      formValidation.showError('Alasan pembatalan harus diisi...');
    }else {
      await setLoadingSave(true);
      success = await formValidation.submitCancelReservasi(params);

      if(success.status === true) {
        await formValidation.showError(success.res.messages);
        await setLoadingSave(false);

        props.route.params.onRefresh();
        props.navigation.goBack();
      }
    }
  }

  function RenderReservasiDetail() {
    const newItems = dataReservasiDetail;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <Text key={item.id_detail} style={styles.label3}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function RenderReservasi() {
    const item = dataReservasi[0];

    if(item) {
      let status = '';
      switch(item.order_state) {
        case 'OPEN':
          status = 'Menunggu Konfirmasi Nakes';
          break;
        case 'CONFIRM':
          status = 'Jadwal Sudah Dikonfirmasi Oleh Nakes';
          break;
        default:
          break;
      }
      return (
        <View key={item.id_jadwal}>
          <View style={styles.group}>
            <Text style={styles.label2}>Kategori Layanan</Text>
            <Text style={[styles.label3, {color: 'red'}]}>{item.order_type}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Jenis Layanan</Text>
            <Text style={styles.label3}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Nama Nakes</Text>
            <Text style={styles.label3}>{item.nakes}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Jadwal Reservasi</Text>
            {item.id_paket === '1' ?
              <Text style={styles.label3}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
              :
              <RenderReservasiDetail />
            }
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Tarif</Text>
            <Text style={styles.label3}>{formValidation.currencyFormat(item.total_price.toString())}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Metode Pembayaran</Text>
            <Text style={styles.label3}>{item.payment_type.toUpperCase()}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>No. Virtual Account</Text>
            <Text style={styles.label3}>{item.va_number}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.label2}>Status Transaksi</Text>
            <Text style={[styles.label3, {color: 'red'}]}>{status}</Text>
          </View>
          {item.order_state === 'OPEN' ?
            <Btnbatal
              style={styles.btnbatal}
              buttonCancel={buttonCancel}
              onCancel={onCancel}
            />:<></>
          }
          {!buttonCancel ? 
            <View style={styles.formbatal}>
              <View style={styles.rect}>
                <TextInput
                  placeholder="Sampaikan Alasan Pembatalan"
                  multiline={true}
                  maxLength={255}
                  defaultValue={alasan}
                  style={styles.textInput}
                  onEndEditing={(e) => setAlasan(e.nativeEvent.text)}
                />
              </View>
              <Btnlanjut
                page="notifReservasi"
                style={styles.btnlanjut}
                cancelReservasi={cancelReservasi}
              />
            </View>
            :
            <></>
            }
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
              <Headnotifikasi style={styles.header} props={props} />
              <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                      <View style={styles.group}>
                        <Icon name="bell" style={styles.icon}></Icon>
                        <Text style={styles.label}>RESERVASI</Text>
                      </View>
                      <RenderReservasi />
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
  group: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: '5%'
  },
  icon: {
    color: "rgba(189,16,224,1)",
    fontSize: 40,
    alignSelf: "center"
  },
  label: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: "center"
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    textAlign: "center",
    fontSize: 14
  },
  label3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 17
  },
  btnbatal: {
    padding: '2%',
    borderRadius: 100,
    marginTop: '5%',
  },
  formbatal: {
    marginTop: '5%'
  },
  rect: {
    height: 120,
    padding: '2%',
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 15,
    backgroundColor: "#fff"
  },
  textInput: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "left"
  },
  btnlanjut: {
    padding: '2%',
    borderRadius: 100,
    marginTop: '2%'
  },
  footer: {
    height: '10%'
  }
});

export default Notifikasipage;
