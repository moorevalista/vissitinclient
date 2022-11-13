import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {RadioButton} from 'react-native-paper';

import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

export default function LayananReservasiKetegori(props) {
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
          <View key={item.id_kategori}>
            <RadioButton
                value={item.id_kategori}
                status={item.id_kategori === kategoriPasien ? 'checked' : 'unchecked'}
                onPress={() => selectKategori(item.id_kategori)}
              />
            <Text style={styles.txtRadio}>{item.kategori + " (" + item.rentang_umur + ") "}</Text>
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
          <Text style={{ flexShrink: 1, paddingVertical: Platform.OS === 'ios' ?  0 : '4%'}}>
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

  /*const [favSport0, setFavSport0] = useState(undefined);
  const [checked, setChecked] = useState('');
  // data untuk klasifikasi pasien
  const inputRefs = {
    firstTextInput: null,
    favSport1: null,
    favSport0: null,
  };
  const dataKlasifikasiPasien = [
    {label: 'yanto', value: 'yanto'},
    {label: 'nugroho', value: 'nugroho'},
  ];*/

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
          <SafeAreaView style={styles.container}>
            <ScrollView
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => null} />
              }>
              <View style={styles.Layanan_reservasi_ketegori}>
                <View style={styles.Kategori}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.Txt372}>KATEGORI PASIEN</Text>
                    <Text style={[styles.Txt372, {marginLeft: 10, color: 'red', fontStyle: 'italic', fontSize: 10, fontWeight: 'normal'}]}>(*pilih salah satu)</Text>
                  </View>

                  <RenderKategori />

                  <View style={styles.KlasifikasiPasien}>
                    <Text style={styles.Txt372}>KLASIFIKASI PASIEN</Text>
                    <View style={styles.selectOption}>
                      <RenderKlasifikasi />
                    </View>
                  </View>
                  {/*<View style={styles.Gejala}>
                    <Text style={styles.Txt372}>GEJALA / KELUHAN</Text>
                    <View style={[styles.Box1, {height: 100, alignItems: 'flex-start'}]}>
                      <TextInput
                        placeholder="Isi gejala atau keluhan yang dialami..."
                        multiline={true}
                        maxLength={255}
                        style={styles.Txt865} />
                    </View>
                  </View>*/}
                </View>
                <TouchableOpacity
                  onPress={handleNext}>
                  <View style={styles.Btn_lanjut}>
                    <Text style={styles.Txt060}>LANJUT</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
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

  txtRadio: {
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

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_reservasi_ketegori: {
    flex: 1,
    paddingTop: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  Kategori: {
    display: 'flex',
    flexDirection: 'column',
    //marginBottom: 150,
  },
  KlasifikasiPasien: {
    //flex: 1,
    paddingTop: 20,
    //display: 'flex',
    //flexDirection: 'column',
    marginBottom: 20,
  },
  Txt372: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 10,
  },

  Gejala: {
    display: 'flex',
    flexDirection: 'column',
  },

  Box1: {
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
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
    width: 300
  },
  Txt060: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  selectOption: {
    justifyContent: 'space-around',
    paddingHorizontal: '4%',
    borderWidth: 0.5,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    //marginVertical: 20,
    color: 'rgba(0,32,51,1)',
    paddingVertical: Platform.OS === 'ios' ? '4%' : 0,
    //minHeight: 40,
    //height: 'auto',
    width: 300
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    //padding: '4%',
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    //borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 12,
    //padding: '4%',
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    //borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
