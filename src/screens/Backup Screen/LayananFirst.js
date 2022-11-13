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
import RadioKategoriPasien from "../components/RadioKategoriPasien";
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
import RNPickerSelect from 'react-native-picker-select';

function LayananFirst(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [dataKerabat, setDataKerabat] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  //untuk menampung dataset dari database
  const [dataKategori, setDataKategori] = useState([]);
  const [dataKlasifikasi, setDataKlasifikasi] = useState([]);

  //untuk menampung data dari Asyncstorage
  const [kategoriPasien, setKategoriPasien] = useState('');
  const [klasifikasiPasien, setKlasifikasiPasien] = useState('');
  const [klasifikasi, setKlasifikasi] = useState('');
  const [labelKlasifikasi, setLabelKlasifikasi] = useState('');

  //variable untuk menampung list yang dimapping dari dataset
  const [itemsKlasifikasi, setItemsKlasifikasi] = useState([]);

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
    if(dataKlasifikasi) {
      listKlasifikasi();
    }
  },[dataKlasifikasi]);

  const setDataSource = async () => {
    /*await AsyncStorage.removeItem('kategoriPasien');
    await AsyncStorage.removeItem('klasifikasiPasien');
    await AsyncStorage.removeItem('klasifikasi');

    const katPasien = await AsyncStorage.getItem('kategoriPasien');
    const klasPasien = await AsyncStorage.getItem('klasifikasiPasien');
    const klas = await AsyncStorage.getItem('klasifikasi');

    katPasien !== null ? setKategoriPasien(katPasien):'';
    klasPasien !== null ? setKlasifikasiPasien(klasPasien):'';
    klas !== null ? setKlasifikasi(klas):'';*/

    //await setId_profesi(props.route.params.id_profesi);
    //await setJenisLayanan(props.route.params.jenisLayanan);

    await setDataKerabat(props.route.params.resKerabat);
    await getKategoriPasien();
    await getKlasifikasiPasien();

    setLoading(false);
  }

  const getKategoriPasien = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.getKategoriPasien(params);

    if(success.status === true) {
      await setDataKategori(success.res);
    }
  }

  const getKlasifikasiPasien = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_profesi: id_profesi, token: dataLogin.token });

    success = await formValidation.getKlasifikasiPasien(params);

    if(success.status === true) {
      await setDataKlasifikasi(success.res);
    }
  }

  function selectKategori(e) {
    setKategoriPasien(e);
  }

  //render kategori
  function RenderKategori() {
    const newItems = dataKategori;
    if(newItems) {
      return newItems.map((item) => {
        return (
          <View key={item.id_kategori} style={styles.label}>
            <View style={styles.radioBox}>
              <RadioKategoriPasien
                name={item.id_kategori}
                style={styles.radioBtn}
                kategoriPasien={kategoriPasien}
                selectKategori={selectKategori}
              />
              <Text style={styles.innerLabel}>{item.kategori + " (" + item.rentang_umur + ") "}</Text>
            </View>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  //mapping data klasifikasi
  const listKlasifikasi = async () => {
    const newItems = dataKlasifikasi;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        let desc = item.deskripsi !== '' ? ' (' + item.deskripsi + ')' : '';
        return (
          {value: item.id_klasifikasi, label: item.klasifikasi + desc}
        )
      });
    }
    //console.log(options);
    setItemsKlasifikasi(options);
  }

  //render klasifikasi
  function RenderKlasifikasi() {
    const items = itemsKlasifikasi;
    const placeholder = {
      label: 'Pilih Klasifikasi...',
      value: null
    };

    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== null && value !== klasifikasiPasien) {
                setKlasifikasiPasien(value)
                const desc = items.filter(
                  item => item.value === value
                )
                setKlasifikasi(desc[0].value - 1)
                setLabelKlasifikasi(desc[0].label);
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={klasifikasiPasien}
            useNativeAndroidPickerStyle={false}
          >
        {klasifikasi !== '' ?
          <Text style={{ padding: '4%', flexShrink: 1 }}>
            {labelKlasifikasi}
          </Text>
          :''
        }
      </RNPickerSelect>
    )
  }

  const handleNext = async () => {

    if(kategoriPasien === '') {
      formValidation.showError('Kategori Pasien harus dipilih...');
    }else if(klasifikasiPasien === '') {
      formValidation.showError('Klasifikasi Pasien harus dipilih...');
    }else {
      //alert(klasifikasi); return;
      /*await AsyncStorage.setItem('kategoriPasien', kategoriPasien);
      await AsyncStorage.setItem('klasifikasiPasien', klasifikasiPasien);
      await AsyncStorage.setItem('klasifikasi', klasifikasi.toString());*/
      onNext();
    }

  };

  const onNext = async () => {
    props.navigation.navigate('layananSecond', { base_url: props.route.params.base_url, id_profesi: id_profesi, jenisLayanan: jenisLayanan, dataKerabat: dataKerabat, kategoriPasien: kategoriPasien, klasifikasiPasien: klasifikasiPasien, id_faskes: id_faskes, dataFaskes: dataFaskes });
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
                        <Image
                          source={require("../assets/images/Idea2-01.png")}
                          resizeMode="contain"
                          style={styles.image}
                        ></Image>
                        <View style={styles.group}>
                          <View style={styles.rect1}>
                            <Text style={styles.title}>Kategori Pasien</Text>
                            
                            <RenderKategori />

                            <Text style={styles.title}>Klasifikasi Pasien</Text>

                            <View style={styles.pilihanklasifikasi}>
                              <View style={styles.rect2}>
                                <RenderKlasifikasi />
                              </View>
                            </View>

                          </View>
                        </View>
                        <Btnlanjut
                          page="LayananFirst"
                          style={styles.btnlanjut}
                          handleNext={handleNext}
                        />
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
  image: {
    height: 176,
    alignSelf: 'center'
  },
  group: {
    flex: 1,
    flexDirection: "row"
  },
  rect1: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  title: {
    marginTop: '3%',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  label: {
    flexDirection: "row",
    marginTop: '2%'
  },
  radioBox: {
    flex: 1,
    flexDirection: "row"
  },
  radioBtn: {
    flex: 0.1,
    alignSelf: 'center'
  },
  innerLabel: {
    flex: 0.8,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    alignSelf: 'center'
  },
  pilihanklasifikasi: {
    flex: 1,
    marginTop: '3%'
  },
  rect2: {
    backgroundColor: "#E6E6E6",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000000"
  },
  textInput: {
    padding: '4%',
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 18
  },
  btnlanjut: {
    flex: 1,
    padding: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    backgroundColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  footer: {
    height: '10%'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    padding: '4%',
    flexShrink: 1,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 12,
    padding: '4%',
    flexShrink: 1,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default LayananFirst;
