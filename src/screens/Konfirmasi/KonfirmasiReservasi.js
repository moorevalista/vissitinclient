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

export default function KonfirmasiReservasi(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [jadwalNakes, setJadwalNakes] = useState([]);
  const [paramsData, setParamsData] = useState('');
  const [pasienData, setPasienData] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');
  const [waktuBooking, setWaktuBooking] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  const [paymentMethod, setPaymentMethod] = useState('');

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
    await setJadwalNakes(props.route.params.jadwalNakes);
    await setParamsData(props.route.params.params);
    await setPasienData(props.route.params.pasienData);
    await setDataKerabat(props.route.params.dataKerabat);
    await setWaktuBooking(props.route.params.waktuBooking);

    await setLoading(false);
  }

  function RenderNakes() {
    const item = jadwalNakes[0];
    var biaya_layanan = 0;
    var biaya_potongan = 0;

    let total = 0;

    if(item) {
      //check jika waktu booking masih dalam range jadwal layanan faskes
      if(id_faskes === undefined) {
        bookingTime = waktuBooking.substr(0, 2);

        if(item.jadwal_faskes.length > 0) {
          faskes_start_time = item.jadwal_faskes[0].faskes_start_time.substr(0, 2);
          faskes_end_time = item.jadwal_faskes[0].faskes_end_time.substr(0, 2);  

          if(bookingTime >= faskes_start_time && bookingTime <= faskes_end_time) {
            biaya_layanan = item.biaya_layanan_faskes;
            biaya_potongan = item.biaya_potongan_faskes;
          } else {
            biaya_layanan = item.biaya_layanan;
            biaya_potongan = item.biaya_potongan;
          }
        }else {
          biaya_layanan = item.biaya_layanan;
          biaya_potongan = item.biaya_potongan;
        }
        
      }else {
        biaya_layanan = item.biaya_layanan_faskes;
        biaya_potongan = item.biaya_potongan_faskes;
      }
      

        total = (biaya_layanan - biaya_potongan);
        return (
          <View key={item.id_nakes} style={styles.Group554}>
            <View>
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
                      <Text style={styles.jarak}>{parseFloat(item.distance).toFixed(2)} km</Text>
                      </Text>
                    </View>
                    :
                    <></>
                  }
                </View>
              </View>
              <View style={styles.Rincian_reservasi}>
                <Text style={styles.Txt885}>RINCIAN RESERVASI</Text>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Hari & Tanggal</Text>
                  <Text style={styles.Txt4103}>{moment(paramsData[0].startDate).format('dddd') + ', ' + moment(paramsData[0].startDate).format('DD MMM YYYY')}</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Jam Layanan</Text>
                  <Text style={styles.Txt4103}>JAM : {waktuBooking} WIB</Text>
                </View>
                <View style={styles.Line7(layout)} />
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Biaya Layanan</Text>
                  <Text style={styles.Txt4103}>{formValidation.currencyFormat(biaya_layanan)}</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Biaya Lainnya</Text>
                  <Text style={styles.Txt4103}>Rp. 0</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt4103}>Promo/Diskon</Text>
                  <Text style={styles.Txt4103}>{formValidation.currencyFormat(biaya_potongan)}</Text>
                </View>
                <View style={styles.Hari_tgl(layout)}>
                  <Text style={styles.Txt5810}>TOTAL BIAYA</Text>
                  <Text style={styles.Txt5810}>{formValidation.currencyFormat(total.toString())}</Text>
                </View>
                <View style={styles.Line7(layout)} />
              </View>
              <View style={styles.Metode_bayar}>
                <Text style={styles.Txt885}>METODE PEMBAYARAN</Text>
                <View style={styles.Metode_subbayar(layout)}>
                  <RadioButton
                    color='blue'
                    value="tunai"
                    status={paymentMethod === 'tunai' ? 'checked' : 'unchecked'}
                    onPress={() => onSelectPaymentMethod('tunai')}
                  />
                  <Text style={styles.Txt731}>Tunai</Text>
                </View>
                <View style={styles.Metode_subbayar(layout)}>
                  <RadioButton
                    color='blue'
                    value="online"
                    status={paymentMethod === 'online' ? 'checked' : 'unchecked'}
                    onPress={() => onSelectPaymentMethod('online')}
                  />
                  <Text style={styles.Txt731}>Non Tunai</Text>
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

  function onSelectPaymentMethod(e) {
    setPaymentMethod(e);
  }

  function onProses() {
    paymentMethod !== '' ?
      props.navigation.navigate('pembayaranScreen', { base_url: props.route.params.base_url, pasienData: pasienData, params: paramsData, dataKerabat: dataKerabat, jadwalNakes: jadwalNakes, waktuBooking: waktuBooking, paymentMethod: paymentMethod, id_profesi: id_profesi, jenisLayanan: jenisLayanan, id_faskes: id_faskes })
      :
      formValidation.showError('Anda belum memilih metode pembayaran...');
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

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
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
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

  Metode_subbayar: layout => ({
    //display: 'flex',
    //flexDirection: 'row',
    //alignItems: 'center',
    //padding: 10,
    //marginBottom: 10,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(145,225,199,1)',
    alignSelf: 'center',
    width: layout.width - 240,
  }),

  Txt731: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    position: 'absolute',
    padding: 10,
    marginLeft: 30,
    zIndex: -1,
  },
});
