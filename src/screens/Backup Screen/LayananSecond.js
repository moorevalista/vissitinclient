import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text, TouchableOpacity,
  TextInput, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
import RadioAlamat from "../components/RadioAlamat";
import Mapslokasi from "../components/Mapslokasi";
import Btnmencari from "../components/Btnmencari";
import Footermenu from "../components/Footermenu";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
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

function LayananSecond(props) {
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
          <View style={styles.group}>
            <RadioAlamat
              name="ktp_address"
              style={styles.radio1}
              pilihAlamat={pilihAlamat}
              useAddress={useAddress}
            />
            <Text style={styles.innerLabel}>Gunakan alamat utama</Text>
          </View>
          <View style={styles.group}>
            <RadioAlamat
              name="current_address"
              style={styles.radio1}
              pilihAlamat={pilihAlamat}
              useAddress={useAddress}
            />
            <Text style={styles.innerLabel}>Gunakan lokasi saat ini</Text>
          </View>

          {(useAddress === 'current_address' && (lat !== '' && lon !== '')) ?
            <>
              <View style={styles.group}>
                <Mapslokasi
                  style={styles.mapstag}
                  onMarkerDragEnd={onMarkerDragEnd}
                  lat={lat}
                  lon={lon}
                />
              </View>
              <Text style={styles.detailalamat}>Detail alamat berdasarkan lokasi maps saat ini.</Text>
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
            </>
            :<></>
          }

          <View style={styles.pesanlain}>
            <View style={styles.rect5}>
              <TextInput
                placeholder="Informasikan Gejala dan Keluhan"
                multiline={true}
                placeholderTextColor="rgba(0,0,0,1)"
                style={styles.catatan}
              />
            </View>
          </View>
        </>
        :
        <>
          <View style={styles.pesanlain}>
            <View style={styles.rect5}>
              <TextInput
                placeholder="Informasikan Gejala dan Keluhan"
                multiline={true}
                placeholderTextColor="rgba(0,0,0,1)"
                style={styles.catatan}
              />
            </View>
          </View>
        </>
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

  return (
    !loading ?
    <>
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
                          <View style={styles.imageStack}>
                            <Image
                              source={require("../assets/images/Idea1-011.png")}
                              resizeMode="contain"
                              style={styles.image}
                            ></Image>
                          </View>
                          <View style={styles.rect1}>
                            <Text style={styles.pilihTanggal}>Pilih Tanggal</Text>
                            <View style={styles.fpilihtgl}>
                              <View style={styles.rect2}>
                                <TextInput
                                  placeholder="dd/mm/yyyy"
                                  placeholderTextColor="rgba(0,0,0,1)"
                                  style={styles.textInput}
                                  showSoftInputOnFocus={false}
                                  clearButtonMode="never"
                                  textBreakStrategy="simple"
                                  dataDetector="calendarEvent"
                                  ref={refStartDate}
                                  onFocus={() => setOpenDate(true)}
                                >{startDate !== '' ? moment(startDate).format('DD/MM/YYYY'):''}
                                  <DatePicker
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
                              </View>
                            </View>
                            <Text style={styles.rentangjam}>Rentang Jam Pencarian</Text>
                            <View style={styles.group3}>
                              <View style={styles.jam1}>
                                <View style={[styles.rect3, {alignSelf: 'flex-start'}]}>
                                  {!loadingFetch && startDate ? <RenderJamAwal key="jamAwal" />:<TextInput editable={false} style={styles.textInput2} />}
                                </View>
                              </View>
                              <View style={styles.jam1}>
                                <View style={[styles.rect3, {alignSelf: 'flex-end'}]}>
                                  {!loadingFetch && startDate ? <RenderJamAkhir key="jamAkhir" />:<TextInput editable={false} style={styles.textInput2} />}
                                </View>
                              </View>
                            </View>

                            <RenderAddress />
                            
                          </View>
                        
                        <Btnmencari style={styles.materialButtonDark} handleCari={handleCari}/>
                    </View>
                </View>
              </ScrollView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
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
  imageStack: {
    height: 'auto',
    marginTop: 8
  },
  image: {
    height: 176,
    alignSelf: 'center'
  },
  rect1: {
    flex: 1,
    height: 'auto',
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  pilihTanggal: {
    marginTop: '2%',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  fpilihtgl: {
    marginTop: '2%'
  },
  rect2: {
    padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%',
    backgroundColor: "#E6E6E6",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18
  },
  rentangjam: {
    marginTop: '5%',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  group3: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: '2%'
  },
  jam1: {
    flex: 1
  },
  rect3: {
    width: '98%',
    padding: '4%',
    paddingLeft: '6%',
    paddingRight: '6%',
    backgroundColor: "#E6E6E6",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  textInput2: {
    width: '100%',
    textAlign: 'center',
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    alignSelf: 'center',
    letterSpacing: 5
  },
  group: {
    flexDirection: "row",
    marginTop: '2%'
  },
  radio1: {
    flex: 0.1,
    alignSelf: 'center'
  },
  innerLabel: {
    flex: 0.8,
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  mapstag: {
    flex: 1,
    height: 180
  },
  group2: {
    marginTop: '2%'
  },
  detailalamat: {
    flex: 1,
    marginTop: '4%',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  rect4: {
    flex: 1,
    padding: '4%',
    backgroundColor: "#E6E6E6",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  pesanlain: {
    flex: 1,
    height: 100,
    marginTop: '4%'
  },
  rect5: {
    flex: 1,
    padding: '4%',
    backgroundColor: "#E6E6E6",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  catatan: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  materialButtonDark: {
    flex: 1,
    padding: '4%',
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    marginTop: '2%'
  },
  footer: {
    height: '10%'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    alignSelf: 'center',
    letterSpacing: 5,
    flexShrink: 1,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 18,
    alignSelf: 'center',
    letterSpacing: 5,
    flexShrink: 1,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black'
  },
});

export default LayananSecond;
