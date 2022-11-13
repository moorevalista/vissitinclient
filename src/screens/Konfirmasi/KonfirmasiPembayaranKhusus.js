import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

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
import { CommonActions } from '@react-navigation/native';

export default function KonfirmasiPembayaranKhusus(props) {
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
          <View key={item.id_nakes} style={styles.Group554}>
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
                    <Text style={styles.Txt1610}>{parseFloat(item.distance).toFixed(2)} km</Text>
                  </View>*/}
                </View>
              </View>
              <View style={styles.Rincian_reservasi}>
                <Text style={styles.Txt885}>RINCIAN RESERVASI</Text>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Jenis Layanan</Text>
                  <Text style={styles.Txt4103}>Paket {item.duration}X Visit</Text>
                </View>
                {/*<View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Jam Layanan</Text>
                  <Text style={styles.Txt4103}>JAM : 08.00 WIB</Text>
                </View>*/}
                <View style={styles.Line7(layout)} />
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Biaya Layanan</Text>
                  <Text style={styles.Txt4103}>{formValidation.currencyFormat(item.biaya_layanan)}</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Biaya Lainnya</Text>
                  <Text style={styles.Txt4103}>Rp. 0</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Promo/Diskon</Text>
                  <Text style={styles.Txt4103}>{formValidation.currencyFormat(item.biaya_potongan)}</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt5810}>TOTAL BIAYA</Text>
                  <Text style={styles.Txt5810}>{formValidation.currencyFormat(total.toString())}</Text>
                </View>
                <View style={styles.Line7(layout)} />
              </View>
              <View style={styles.Metode_bayar}>
                <Text style={styles.Txt885}>PEMBAYARAN</Text>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Metode Pembayaran</Text>
                  <Text style={styles.Txt4103}>{paymentMethod.toUpperCase()}</Text>
                </View>
                <View style={[styles.Hari_tgl(layout), {alignItems: 'center'}]}>
                  <Text style={styles.Txt4103}>No. Virtual Account</Text>
                  <View style={styles.pembayarnVa}>
                    <Text style={[styles.Txt4103, {fontWeight: 'bold'}]}>-</Text>
                    {/*<TouchableOpacity
                      onPress={() => {
                        copyVa('1234567891239545');
                      }}>
                      <View style={styles.Tbl_iconPanah}>
                        <Icons label="Panah" name="md-copy" />
                      </View>
                    </TouchableOpacity>*/}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.Group1039}>
              {/*<TouchableOpacity
                style={styles.Btn_lanjut(layout)}
                onPress={() => alert('Batal')}>
                <Text style={styles.Txt721}>BATAL</Text>
              </TouchableOpacity>*/}
              <TouchableOpacity
                style={styles.Btn_lanjut1(layout)}
                onPress={onProses}>
                <Text style={styles.Txt721}>LANJUT</Text>
              </TouchableOpacity>
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
                name: 'MainApp',
                params: { base_url: props.route.params.base_url },
              },
              {
                name: 'alertReservasi',
                params: {
                  base_url: props.route.params.base_url,
                  msg: success.res.messages
                }
              }
            ],
          })
        );
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const [checked, setChecked] = useState('');

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 14,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };
  //untuk copy VA
  const copyVa = e => {
    ToastAndroid.show('VA berhasil di salin', ToastAndroid.SHORT);
    Clipboard.setString(e);
  };

  const dataNakes = {
    key: 1,
    nama: 'Qoryatullistya, SST.FT, Ftr',
    layanan: 'Fisioterapi',
    pendidikan: 'Profesi',
    sertifikasi: '-',
    tempatPraktik: 'Klinik Sehati',
    jarak: '5 Km',
  };

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
              <ScrollView
                nestedScrollEnabled={true}
                refreshControl={
                  <RefreshControl refreshing={false} onRefresh={() => null} />
                }>
                <View
                  style={styles.Profil_nakes}
                  onLayout={event => setLayout(event.nativeEvent.layout)}>
                  <RenderNakes />
                </View>
              </ScrollView>
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
    height: 'auto'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Profil_nakes: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
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

  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },
  Group554: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  Txt885: {
    paddingVertical: 20,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },

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

  Rincian_reservasi: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  Hari_tgl: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: layout.width - 70,
  }),
  Txt4103: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgba(0,0,0,1)',
  },

  Line7: layout => ({
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,1)',
    height: 1,
    marginBottom: 10,
    width: layout.width - 70,
  }),

  Txt5810: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 18,
    color: 'rgba(0,0,0,1)',
  },

  Metode_bayar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    width: 30,
    height: 30,
    marginLeft: 15,
  },
  pembayarnVa: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
