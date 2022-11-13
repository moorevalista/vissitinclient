import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';

import Mapslokasi from "../../components/Mapslokasi";
import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import moment from 'moment-timezone';
import 'moment/locale/id';
import DatePicker from 'react-native-date-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from '@react-native-community/geolocation';

export default function LayananReservasiWaktu(props) {
  const formValidation = useContext(form_validation);
  const [jamAwal, setJamAwal] = useState('');
  const [jamAkhir, setJamAkhir] = useState('');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [openDate, setOpenDate] = useState(false);
  const refStartDate = useRef(null);

  //dataset dari database
  const [pasienData, setPasienData] = useState([]);

  //parameter yang diinput user
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [useAddress, setUseAddress] = useState('');
  const [id_profesi, setId_profesi] = useState('');
  const [jenisLayanan, setJenisLayanan] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');
  const [kategoriPasien, setKategoriPasien] = useState('');
  const [klasifikasiPasien, setKlasifikasiPasien] = useState('');
  const id_paket = '1';

  //limit parameter for date & time select
  const [currDate, setCurrDate] = useState(new Date);
  const [currTime, setCurrTime] = useState('');

  //id faskes jika reservasi FASKES
  const [id_faskes, setId_faskes] = useState(props.route.params.id_faskes);
  const [dataFaskes, setDataFaskes] = useState(props.route.params.dataFaskes);

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
    if(startDate !== currDate) {
      setStartTime('');
      listJamAwal();
      listJamAkhir();
    }
  },[startDate]);

  useEffect(() => {
    setEndTime('');
    listJamAkhir();
  },[startTime]);

  useEffect(() => {
    if(address) {
      getLocationByAddress(address);
    }
  },[address]);

  useEffect(() => {
    if(id_faskes && dataFaskes) {
      setUseAddress('faskes_address');
      setAddress(dataFaskes[0].address);
      setLat(dataFaskes[0].lat);
      setLon(dataFaskes[0].lon);
    }
  },[id_faskes]);

  const setDataSource = async () => {
    const today = new Date();
    const time = today.getHours();

    //await setStartDate(today);
    await setCurrTime(time);
    await setId_profesi(props.route.params.id_profesi);
    await setJenisLayanan(props.route.params.jenisLayanan);
    await setDataKerabat(props.route.params.dataKerabat);
    await setKategoriPasien(props.route.params.kategoriPasien);
    await setKlasifikasiPasien(props.route.params.klasifikasiPasien);
    await getDataPasien();

    if(useAddress === 'current_address') {
      if(address !== '') {
        getLocationByAddress(address);
      }else {
        //if(lat !== '' && lon !== '') {
          getLocation(lat, lon);
        //}
      }
    }
    setLoading(false);
  }

  async function getLocation(lat, lon) {
    success = await formValidation.getLocation(lat, lon);
    //alert(JSON.stringify(success));
    setAddress(success);
    return(success);
  }

  async function getLocationByAddress(ev) {
    success = await formValidation.getLocationByAddress(ev);
    
    setLat(success.lat);
    setLon(success.lng);
    return(success);
  }

  function onMarkerDragEnd(coord) {
    setLat(coord.latitude);
    setLon(coord.longitude);

    getLocation(coord.latitude, coord.longitude);
  }

  const getDataPasien = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getDataPasien(params);

    if(success.status === true) {
      await setPasienData(success.res);
    }
  }

  async function pilihAlamat(e) {
    if(e === 'ktp_address') {
      setAddress(pasienData.ktp_address + ', ' + pasienData.nama_kelurahan + ', ' + pasienData.nama_kecamatan + ', ' + pasienData.nama_kota + ', ' + pasienData.nama_provinsi + ' ' + pasienData.kodepos);
    }else {
      setLoadingSave(true);
      //getLocation(lat, lon);
      await Geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          getLocation(position.coords.latitude, position.coords.longitude);
          setLoadingSave(false);
        },
        (error) => {
          setLoadingSave(false);
          setUseAddress('ktp_address');
          console.log(error.code, error.message);
          formValidation.showError(error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }      
      );
    }
    setUseAddress(e);
  }

  //listing jamAwal
  const listJamAwal = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      options.push({value: '', label: ''});
      newItems.items.map((item) => {
        let jam_awal = '';
        if((moment(startDate).format('YYYY/MM/DD') === moment(currDate).format('YYYY/MM/DD')) && currTime >= 6) {
          jam_awal = currTime + 3;
          if(jam_awal < 10) {
            jam_awal = '0' + jam_awal + '.00';
          }
        }else {
          jam_awal = '06.00';
        }

        if(item.jam >= jam_awal) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAwal(options);
  }

  //render jamAwal
  function RenderJamAwal() {
    const items = jamAwal;
    const placeholder = {
      label: '',
      value: null
    };

    if(items) {
      return (
        <RNPickerSelect
              placeholder={placeholder}
              items={items}
              onValueChange={(value) => {
                if(value !== startTime) {
                  setStartTime(value)
                }
              }}
              style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
              value={startTime}
              useNativeAndroidPickerStyle={false}
            />
      )
    }
  }

  //listing jamAkhir
  const listJamAkhir = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      options.push({value: '', label: ''});
      newItems.items.map((item) => {
        let jam_awal = '';
        if((moment(startDate).format('YYYY/MM/DD') === moment(currDate).format('YYYY/MM/DD')) && currTime >= 6) {
          jam_awal = currTime + 3;
          if(jam_awal < 10) {
            jam_awal = '0' + jam_awal + '.00';
          }
        }else {
          jam_awal = startTime;
        }

        if(item.jam >= jam_awal) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAkhir(options);
  }

  //render jamAkhir
  function RenderJamAkhir() {
    const items = jamAkhir;
    const placeholder = {
      label: '',
      value: null
    };

    if(items) {
      return (
        <RNPickerSelect
              placeholder={placeholder}
              items={items}
              onValueChange={(value) => {
                if(value !== endTime) {
                  setEndTime(value)
                }
              }}
              style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
              value={endTime}
              useNativeAndroidPickerStyle={false}
            />
      )
    }
  }

  function RenderAddress() {
    return (
      id_faskes === undefined ?
        <>
          <View style={styles.Waktu_tgl}>
            <Text style={styles.Txt973}>PILIH LOKASI LAYANAN</Text>
            <View>
              <RadioButton
                value="ktp_address"
                status={useAddress === 'ktp_address' ? 'checked' : 'unchecked'}
                onPress={() => pilihAlamat('ktp_address')}
              />
              <Text style={styles.Txt185}>Gunakan alamat utama</Text>
            </View>
            <View>
              <RadioButton
                value="current_address"
                status={useAddress === 'current_address' ? 'checked' : 'unchecked'}
                onPress={() => pilihAlamat('current_address')}
              />
              <Text style={styles.Txt185}>Gunakan lokasi saat ini</Text>
            </View>
          </View>

          {(useAddress === 'current_address' && (lat !== '' && lon !== '')) ?
            <>
              <View style={styles.Maps}>
                <Mapslokasi
                  style={styles.mapstag}
                  onMarkerDragEnd={onMarkerDragEnd}
                  lat={lat}
                  lon={lon}
                />
                <Text style={styles.Txt853}>
                  Detail alamat menggunakan lokasi maps pada posisi anda berada saat
                  ini.
                </Text>
                <View style={styles.group2}>
                  <View style={styles.rect4}>
                    <TextInput
                      editable={useAddress === 'current_address' ? true : false}
                      style={styles.catatan}
                      multiline={true}
                      autoCapitalize="words"
                      onEndEditing={(e) => setAddress(e.nativeEvent.text)}
                    >{address}</TextInput>
                  </View>
                </View>
              </View>
            </>
            :<></>
          }

          <View style={styles.Gejala}>
            <Text style={styles.Txt372}>GEJALA / KELUHAN</Text>
            <View style={[styles.BoxKeluhan, {height: 100, alignItems: 'flex-start'}]}>
              <TextInput
                placeholder="Isi gejala atau keluhan yang dialami..."
                multiline={true}
                maxLength={255}
                style={styles.Txt865} />
            </View>
          </View>
          
        </>
        :
        
        <View style={styles.Waktu_tgl}>
          <Text style={styles.Txt372}>GEJALA / KELUHAN</Text>
          <View style={[styles.BoxKeluhan, {height: 100, alignItems: 'flex-start'}]}>
            <TextInput
              placeholder="Isi gejala atau keluhan yang dialami..."
              multiline={true}
              maxLength={255}
              style={styles.Txt865} />
          </View>
        </View>
    )
  }

  async function handleCari() {
    if(startDate === '') {
      formValidation.showError('Tanggal harus dipilih...');
      refStartDate.current.focus();
    }else if(startTime === '') {
      formValidation.showError('Rentang jam pencarian harus dipilih...');
    }else if(endTime === '') {
      formValidation.showError('Rentang jam pencarian harus dipilih...');
    }else if(useAddress === '' || (lat === '' || lon === '')) { //update 28/11/2021
      formValidation.showError('Alamat harus dipilih...'); //update 28/11/2021
    }else if(lat === undefined || lon === undefined) { //update 28/11/2021
      formValidation.showError('Gagal mendapatkan lokasi...'); //update 28/11/2021
    }else {
      /*await AsyncStorage.setItem('startDate', moment(startDate).format('DD/MM/YYYY'));
      await AsyncStorage.setItem('startTime', startTime);
      await AsyncStorage.setItem('endTime', endTime);
      await AsyncStorage.setItem('address', address);
      await AsyncStorage.setItem('note', note);
      await AsyncStorage.setItem('useAddress', useAddress);
      await AsyncStorage.setItem('lat', lat.toString());
      await AsyncStorage.setItem('lon', lon.toString());*/
      handleNext();
    }
  }

  function handleNext() {
    let params = [];

    params.push({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      startTime: startTime,
      endTime: endTime,
      address: address,
      note: note,
      useAddress: useAddress,
      lat: lat,
      lon: lon,
      id_profesi: id_profesi,
      jenisLayanan: jenisLayanan,
      kategoriPasien: kategoriPasien,
      klasifikasiPasien: klasifikasiPasien,
      id_paket: id_paket
    });

    props.navigation.navigate('hasilPencarian', { base_url: props.route.params.base_url, pasienData: pasienData, params: params, dataKerabat: dataKerabat, id_profesi: id_profesi, jenisLayanan: jenisLayanan, id_faskes: id_faskes, dataFaskes: dataFaskes });
  }

  const [date, setDate] = useState(new Date());
  const [tgl, setTgl] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState('');

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 16,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };

  return (
    !loading ?
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
          >
            <SafeAreaView style={styles.container}>
              <View style={styles.Layanan_reservasi_waktu}>
                <View style={styles.Waktu_tgl}>
                  <Text style={styles.Txt973}>PILIH TANGGAL LAYANAN</Text>
                  <View style={styles.Pilih_tanggal}>
                    <View style={styles.Box}>
                      <TextInput
                        placeholder="dd/mm/yyyy"
                        placeholderTextColor="rgba(0,0,0,1)"
                        style={{flex: 1, fontSize: 14, alignSelf: 'center', letterSpacing: 5,}}
                        showSoftInputOnFocus={false}
                        clearButtonMode="never"
                        textBreakStrategy="simple"
                        dataDetector="calendarEvent"
                        ref={refStartDate}
                        onFocus={() => setOpenDate(true)}
                      >{startDate !== '' ? moment(startDate).format('DD/MM/YYYY'):''}
                        <DatePicker
                          theme="auto"
                          modal
                          locale="en"
                          mode="date"
                          open={openDate}
                          date={startDate !== '' ? new Date(startDate) : new Date()}
                          minimumDate={new Date()}
                          onConfirm={(date) => {
                            setOpenDate(false)
                            setStartDate(date)
                          }}
                          onCancel={() => {
                            setOpenDate(false)
                          }}
                        />
                      </TextInput>

                      <Icons label="Panah" name="ios-calendar" />
                    </View>
                  </View>
                </View>
                <View style={styles.Waktu_tgl}>
                  <Text style={styles.Txt973}>PILIH JAM PENCARIAN</Text>
                  <View style={styles.Group728}>
                    <View style={styles.Box1}>
                      {!loadingFetch && startDate ? <RenderJamAwal key="jamAwal" />:<TextInput editable={false} style={{flex: 1}} />}

                      <Icons label="Panah" name="ios-time" />
                    </View>
                    <Text style={styles.Txt898}>s/d</Text>
                    <View style={styles.Box1}>
                      {!loadingFetch && startDate ? <RenderJamAkhir key="jamAkhir" />:<TextInput editable={false} style={{flex: 1}} />}

                      <Icons label="Panah" name="ios-time" />
                    </View>
                  </View>
                </View>

                <RenderAddress />

                <TouchableOpacity
                  onPress={handleCari}>
                  <View style={styles.Btn_lanjut}>
                    <Text style={styles.Txt1077}>CARI</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  mapstag: {
    flex: 1,
    height: 180
  },

  Txt372: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 10,
  },

  BoxKeluhan: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0,66,105,0.28)",
    //width: 280,
  },
  Txt865: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    //lineHeight: 22,
    color: 'rgba(0,32,51,1)',
    //borderWidth: 1,
    padding: 0
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_reservasi_waktu: {
    display: 'flex',
    flexDirection: 'column',
  },
  Group772: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  Txt117: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Tbl_home: {
    width: 24,
    height: 24,
  },

  Waktu_tgl: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 35,
    paddingTop: 25,
  },
  Maps: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    //paddingTop: 25,
    paddingHorizontal: '6%',
  },
  Txt973: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    marginBottom: 9,
  },
  Pilih_tanggal: {
    display: 'flex',
    flexDirection: 'column',
  },
  Box: {
    // justifyContent: 'space-around',
    // paddingHorizontal: '4%',
    // borderWidth: 0.5,
    // borderColor: 'rgba(54,54,54,1)',
    // borderRadius: 20,
    // marginVertical: 20,
    // color: 'rgba(0,32,51,1)',
    // height: 40,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(0,66,105,0.28)',
    padding: Platform.OS === 'ios' ? '4%' : 0
  },
  Txt197: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0,32,51,1)',
    marginRight: 10,
  },
  Button: {
    width: 40,
    height: 40,
  },

  Txt705: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    marginBottom: 9,
  },
  Group728: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  Box1: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,66,105,0.28)',
    padding: Platform.OS === 'ios' ? '4%' : 0
  },
  Txt610: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0,32,51,1)',

    marginRight: 10,
  },
  Button: {
    width: 40,
    height: 40,
  },

  Txt898: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  Button: {
    width: 40,
    height: 40,
  },

  Txt229: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    width: 161,
    height: 21,
  },

  Radio_alamat_utama: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: -8,
  },

  Txt185: {
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

  Radio_geotag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 300,
  },
  Ellipse32: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,1)',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },

  Group062: {
    borderRadius: 20,
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  Txt853: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    paddingTop: 10,
    textAlign: 'center',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt1077: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Gejala: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: '8%'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    minWidth: 80,
    width: 'auto',
    fontSize: 14,
    alignSelf: 'center',
    letterSpacing: 5,
    //flexShrink: 1,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
  },
  inputAndroid: {
    flex: 1,
    minWidth: 80,
    width: 'auto',
    fontSize: 14,
    alignSelf: 'center',
    letterSpacing: 5,
    //flexShrink: 1,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black'
  },
});
