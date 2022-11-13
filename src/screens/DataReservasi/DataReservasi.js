import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, Image,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
  Animated, Easing, LayoutAnimation
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';

import Btnbatal from "../../components/Btnbatalres";
import Btnlanjut from "../../components/Btnlanjut";
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
import { LogBox } from 'react-native';
import { CommonActions } from '@react-navigation/native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function DataReservasi(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [buttonCancel, setButtonCancel] = useState(true);
  const [alasan, setAlasan] = useState('');
  const [idAlasan, setIdAlasan] = useState('');

  //data dari page sebelumnya
  const [dataReservasi, setDataReservasi] = useState([]);
  const [dataReservasiDetail, setDataReservasiDetail] = useState([]);

  const [dataAlasan, setDataAlasan] = useState([]);
  const [itemsAlasan, setItemsAlasan] = useState([]);

  let refAlasan = useRef(null);

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

  const [firstBoxPosition, setFirstBoxPosition] = useState("bottom");

  function PopUp() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFirstBoxPosition(firstBoxPosition === "top" ? "bottom" : "top");
  }

  async function openChat() {
    props.navigation.navigate('chatPage', { base_url: props.route.params.base_url, id_chat: dataReservasi[0].id_chat, onRefresh: onRefresh });
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
    if(dataAlasan) {
      listReasons();
    }
  },[dataAlasan]);

  const setDataSource = async () => {
    //alert(JSON.stringify(props.route.params.dataReservasiDetail)); return;
    await setDataReservasi(props.route.params.dataReservasi);
    if(props.route.params.dataReservasi[0].id_paket !== '1') {
      await getReservationDetail(props.route.params.dataReservasi[0].id_jadwal);
    }
    
    await getReasons();
    await setLoading(false);
  }

  const getReasons = async () => {
    axios
      .get(props.route.params.base_url + "layanan/getReasons/0", {params: {token: dataLogin.token}})
      .then(res => {
        setDataAlasan(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const listReasons = async () => {
    const newItems = dataAlasan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_alasan, label: item.alasan}
        )
      });
    }

    setItemsAlasan(options);
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
    PopUp();
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

        props.route.params.onRefresh('notif');
        props.navigation.goBack();
      }
    }
  }

  function RenderReservasiDetail() {
    const newItems = dataReservasiDetail;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <Text key={item.id_detail} style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  const openPayment = async() => {
    await setLoadingSave(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_jadwal: dataReservasi[0].id_jadwal,
      id_pasien: dataLogin.id_pasien,
      id_nakes: dataReservasi[0].id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getPaymentPayload(params);
    await setLoadingSave(false);
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError('Terjadi kesalahan...');
      }else {

        if(dataReservasi[0].trxIdFlip === '') {
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
                  params: { newPayment: true, dataLogin: dataLogin, id_jadwal: dataReservasi[0].id_jadwal, url: success.res.data.payloads.link_url.replace('flip.id/', formValidation.flipPaymentUrl) },
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
                  params: { newPayment: false, dataLogin: dataLogin, id_jadwal: dataReservasi[0].id_jadwal, url: formValidation.flipPaymentUrlConsolidation + dataReservasi[0].trxIdFlip },
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

  const Reasons = () => {
    const items = itemsAlasan;
    const placeholder = {
      label: 'Pilih alasan pembatalan',
      value: null
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== idAlasan) {
            const deskripsi = items.filter(
              item => item.value === value
            );

            if(value !== null) {
              setIdAlasan(value);
              setAlasan(deskripsi[0].label);
            }else {
              setIdAlasan('');
              setAlasan(null);
            }
          }
        }}
        style={pickerSelectStyles}
        value={idAlasan}
        useNativeAndroidPickerStyle={false}
        ref={el => {
          refAlasan = el;
        }}
      />
    );
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
      return (
        <View key={item.id_jadwal}>
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
                <Text style={styles.Txt656}>{formValidation.currencyFormat(item.total_price.toString())}</Text>
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
                <RenderReservasiDetail />
              }
            </View>

            <View style={styles.Jadwal1}>
              <Text style={styles.Txt091}>Gejala / Keluhan</Text>
              <Text style={styles.Txt680}>
                {item.order_note}
              </Text>
            </View>

            {/*<View style={styles.Jadwal1}>
              <Text style={styles.Txt091}>No. Kode Bayar / VA</Text>
              <Text style={styles.Txt710}>{item.va_number !== '' ? item.va_number : '-'}</Text>
            </View>*/}
            
            {item.order_state === 'OPEN' ?
              <Text style={styles.Txt680}>
                *Reservasi akan dibatalkan jika tidak ada konfirmasi dari tenaga
                professional lebih dari 60 menit.
              </Text>
              :
              <></>
            }
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
              <Text style={styles.Txt191}>Status Reservasi</Text>
              <Text style={[styles.Txt680, {fontWeight: 'bold'}]}>{status}</Text>
              {/*<Text style={styles.Txt191}>00:59:17</Text>*/}
            </View>
          </View>

          <View style={styles.wrapperCardBawah}>
              {/*!buttonCancel ? 
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

                <Box_pembatalan />
                :
                <></>*/
              }

              {item.order_state === 'OPEN' && buttonCancel ?
                <TouchableOpacity style={styles.Btn_batal} onPress={onCancel}>
                  <Text style={styles.Txt060}>{buttonCancel ? 'Batalkan Pesanan' : 'Kembali'}</Text>
                </TouchableOpacity>
                :
                item.order_state !== 'OPEN' && (item.id_chat !== '' && item.order_state !== 'CLOSE' && item.order_state !== 'CANCEL')  ?
                  <TouchableOpacity style={styles.Btn_chat} onPress={openChat}>
                    <Text style={styles.Txt060}>CHAT NAKES</Text>
                  </TouchableOpacity>
                  :<View style={styles.Btn_batal2}></View>
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

            </View>
        </View>
      )
    }else {
      return (
        <></>
      )
    }
  }

  function Box_pembatalan() {
    return (
      <View style={[styles.Box_pembatalan, firstBoxPosition === "top" ? styles.movePosition : styles.defPosition]}>
        <View style={styles.Box_batal}>
          <Text style={styles.multiple1}>
            Konfirmasi Pembatalan Sampaikan alasan pembatalan anda!
          </Text>
        </View>
        <View style={styles.Select}>
          <View style={styles.Box}>
            <Reasons />
          </View>
        </View>
        <TouchableOpacity style={styles.Group327} onPress={cancelReservasi}>
          <View style={styles.Btn_tambah}>
            <Text style={styles.Txt664}>Kirim</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Btn_close} onPress={onCancel}>
          <Image
            style={styles.Tbl_close}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/79x42gzyonm-242%3A4432?alt=media&token=5505fac2-c2f7-4ae6-9c6b-decca2e9272b",
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
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
                  >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    paddingTop: 10,
                    paddingBottom: '5%'
                  }}>
              
                  <RenderReservasi />
                </View>
              </ScrollView>
              {/*!buttonCancel ? 
                <Box_pembatalan />
                :
                <></>
              */}
              <Box_pembatalan />
          </View>
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
    height: 'auto'
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
    paddingHorizontal: 10
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

  Status_reservasi: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 9,
  },
  Txt469: {
    position: 'absolute',
    top: 40,
    left: 5012020,
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    width: 121,
    height: 21,
  },
  Txt290: {
    position: 'absolute',
    top: 20,
    left: 5028020,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(239,70,62,1)',
    textAlign: 'center',
    justifyContent: 'center',
    width: 281,
    height: 21,
  },
  Txt191: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    //fontWeight: 'bold',
    color: 'rgba(54,54,54,1)',
    textAlign: 'center',
    justifyContent: 'center',
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

  Btn_batal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginVertical: 20,
    //marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(239,70,62,1)',
    height: 40,
    marginTop: '5%',
    marginBottom: '5%',
  },
  Btn_batal2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    marginTop: '5%',
    marginBottom: '5%',
  },
  Txt060: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Btn_chat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
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

  formbatal: {
    marginTop: '5%',
  },
  rect: {
    height: 120,
    padding: '2%',
    marginBottom: '5%',
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 15,
    backgroundColor: "#fff"
  },
  textInput: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "left",
  },

  Box_pembatalan: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "absolute",
    width: '100%',
    height: 200,
  },
  Box_batal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "absolute",
    top: "0%",
    bottom: "0%",
    left: "0%",
    right: "0%",
    paddingTop: 19,
    paddingBottom: 128,
    paddingLeft: 39,
    paddingRight: 38,
    backgroundColor: "rgba(239,70,62,1)",
    shadowColor: "rgba(0,32,51,0.04)",
    elevation: 0,
    shadowOffset: { width: 0, height: 4 },
  },
  multiple1: {
    main: "Txt651",
    seg1: "[object Object]",
    seg2: "[object Object]",
  },

  Select: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "absolute",
    top: "36.84%",
    bottom: "42.11%",
    left: "11.11%",
    right: "11.11%"
  },
  Box: {
    flex: 1,
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 99,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0,66,105,0.28)",
  },
  Txt243: {
    flex: 1,
    fontSize: 12,
    //fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    lineHeight: 22,
    color: "gray",
    /*  linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(0deg, rgba(79,92,99,1), rgba(79,92,99,1)) */
    marginRight: 10
  },
  Button: {
    width: 40,
    height: 40,
  },

  Group327: {
    position: "absolute",
    top: 130,
    left: 212,
    width: 108,
    height: 40,
  },
  Btn_tambah: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 38,
    paddingRight: 38,
    borderRadius: 20,
    backgroundColor: "rgba(54,54,54,1)",
    height: 40,
  },
  Txt664: {
    fontSize: 12,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
    lineHeight: 22,
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    justifyContent: "center",
  },
  Btn_close: {
    flex: 1,
  },
  Tbl_close: {
    position: "absolute",
    top: "10.53%",
    bottom: "76.84%",
    left: "87.78%",
    right: "5.56%",
    width: 24,
    height: 24,
  },

  defPosition: {
    bottom: -200
  },
  movePosition: {
    bottom: 0
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: '100%',
    fontSize: 12,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: '100%',
    fontSize: 12,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
