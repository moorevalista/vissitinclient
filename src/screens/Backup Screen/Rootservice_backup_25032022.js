import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
import MaterialCheckboxWithLabel from "../components/MaterialCheckboxWithLabel";
import Reservasikerabat from "../components/Reservasikerabat";
import Formtambahkerabat from "../components/Formtambahkerabat";
import Btnlanjut from "../components/Btnlanjut";
import Btnback from "../components/Btnback";
import RadioServiceUser from "../components/RadioServiceUser";
//import CupertinoRadio1 from "../components/CupertinoRadio1";
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

function Rootservice(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [serviceUser, setServiceUser] = useState('');
  const [tambahKerabat, setTambahKerabat] = useState(false);
  const [jenisLayanan, setJenisLayanan] = useState('reguler');

  const [refCode, setRefCode] = useState('');

  //check persetujuan
  const [setujuPribadi, setSetujuPribadi] = useState(false);
  const [setujuKerabat, setSetujuKerabat] = useState(false);

  //variable untuk menampung dataset kerabat
  const [dataHubungan, setDataHubungan] = useState('');
  const [dataKerabat, setDataKerabat] = useState('')

  //variable untuk menampung list yang dimapping dari dataset
  const [itemsHubungan, setItemsHubungan] = useState([]);
  const [itemsKerabat, setItemsKerabat] = useState([]);

  //data kerabat yang dipilih
  const [id_kerabat, setId_kerabat] = useState('');
  const [nama_kerabat, setNama_kerabat] = useState('');
  const [id_hubungan, setId_hubungan] = useState('');
  const [hubungan, setHubungan] = useState('');
  const [profesi_hobi, setProfesi_hobi] = useState('');
  const [sex, setSex] = useState('');

  //style for form tambah kerabat
  const [styleKerabat, setStyleKerabat] = useState('');
  const [stylePilihKerabat, setStylePilihKerabat] = useState(false);

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [layanan, setLayanan] = useState(props.route.params.jenisLayanan);

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
      setCurrentDataPasien();
    }
  },[dataLogin]);

  useEffect(() => {
    if(serviceUser === 'kerabat') {
      setKerabatSource(true);
    }
  },[serviceUser]);

  useEffect(() => {
    if(serviceUser === 'kerabat' && itemsKerabat) {
      listKerabat()
      //console.log('uye')
    }
  },[dataKerabat]);

  const setCurrentDataPasien = async () => {
    
    setLoading(false);
  }

  const setKerabatSource = async (e) => {
    await setLoadingSave(e);
    await getHubungan();
    await getKerabat();
    await setLoadingSave(false);
  }

  const getHubungan = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.getHubungan(params);

    if(success.status === true) {
      await setDataHubungan(success.res);
    }
  }

  const getKerabat = async () => {
    let params = [];
    params.push({ id_pasien: dataLogin.id_pasien, base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.getKerabat(params);

    if(success.status === true) {
      await setDataKerabat(success.res);
    }
  }

  function pilihUser(e) {
    setServiceUser(e);
    setSetujuPribadi(false);
    setSetujuKerabat(false);
    setTambahKerabat(false);
    resetDataKerabat();
    if(e === 'kerabat') {
      setKerabatSource(false);
    }
  }

  function resetDataKerabat() {
    setId_kerabat('');
    setNama_kerabat('');
    setId_hubungan('');
    setSex('');
    setProfesi_hobi('');
    setStyleKerabat('');
  }

  function pilihLayanan(e) {
    setJenisLayanan(e);
    setServiceUser('');
    setRefCode('');
  }

  //render jenis layanan
  function Reguler() {
    if(jenisLayanan === 'reguler') {
      return (
        <>
          <Text style={styles.reguler}>REGULER</Text>
          <View style={styles.group}>
            <View style={styles.innerGroup}>
              <TouchableOpacity style={styles.button} onPress={() => pilihUser('pribadi')}>
                <View style={styles.rect}>
                  <Text style={styles.label}>PRIBADI</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => pilihUser('kerabat')}>
                <View style={styles.rect2}>
                  <Text style={styles.label2}>KERABAT</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }else {
      return (
        <></>
      )
    }
  }

  function KerabatKhusus() {
    if(!tambahKerabat) {
      return(
        <Kerabat />
      )
    }else {
      return (
        <TambahKerabat />
      )
    }
  }

  function Khusus() {
    if(jenisLayanan === 'khusus') {

      const [newRefCode, setNewRefCode] = useState(refCode);

      return (
        <>
          <View style={styles.group}>
            <View style={styles.rect5}>
              <TextInput
                placeholder="INPUT KODE NAKES"
                keyboardType="numeric"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.textInput}
                maxLength={13}
                onChangeText={(value) => {
                  const code = refValidation(value)
                  setNewRefCode(code)
                }}
                onEndEditing={() => {
                    setRefCode(newRefCode)
                }}
                value={newRefCode}
              />
            </View>
          </View>
          <Text style={styles.keterangan}>
              Input Kode Referensi dari Tenaga Kesehatan anda untuk dapat
              terhubung dan mengetahui jadwal layanan yang tersedia.
          </Text>
          <RadioServiceUser
            style={styles.radio1}
            serviceUser={serviceUser}
            setServiceUser={setServiceUser}
            pilihUser={pilihUser}
            name="pribadi"
          />
          <RadioServiceUser
            style={[styles.radio1, {marginTop: 0}]}
            serviceUser={serviceUser}
            setServiceUser={setServiceUser}
            pilihUser={pilihUser}
            name="kerabat"
          />

          {serviceUser === 'kerabat' ?
            <KerabatKhusus />
            :
            serviceUser === 'pribadi' ?
              <MaterialCheckboxWithLabel
                style={styles.materialCheckboxWithLabel}
                handlePersetujuan={handlePersetujuan}
                checked={setujuPribadi}
              />:<></>
          } 

          <Btnlanjut
            page="rootService"
            name="khusus"
            type="khusus"
            style={styles.cupertinoButtonGrey}
            handleNextKhusus={handleNextKhusus}
          />
          <Btnback style={styles.btnlanjut} setServiceUser={setServiceUser} pilihLayanan={pilihLayanan} />
        </>
      )
    }else {
      return (
        <></>
      )
    }
  }

  //handle click persetujuan
  function handlePersetujuan(name) {
    switch(name) {
      case 'pribadi':
        setSetujuPribadi(!setujuPribadi);
        break;
      case 'kerabat':
        setSetujuKerabat(!setujuKerabat);
        break;
      default:
        setSetujuPribadi(false);
        setSetujuKerabat(false);
    }
  }

  //tambah kerabat
  function handleTambahKerabat(e) {
    setTambahKerabat(e);
    listHubungan();
    resetDataKerabat();
  }

  //mapping data hubungan
  const listHubungan = async () => {
    const newItems = dataHubungan;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_hub + '|' + item.hubungan, label: item.hubungan}
        )
      });
    }
    //console.log(options);
    setItemsHubungan(options);
  }

  //mapping data kerabat
  const listKerabat = async () => {
    const newItems = dataKerabat;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kerabat + '|' + item.full_name + '|' + item.hubungan + '|' + item.sex, label: item.full_name}
        )
      });
    }
    //console.log(options);
    setItemsKerabat(options);
  }

  //render Dropdown listHubungan untuk ditampilkan di form
  const RenderHubungan = () => {
    const items = itemsHubungan;
    const placeholder = {
      label: 'Pilih Hubungan...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== null) {
                const data = value.split('|')
                if(data[0] !== id_hubungan) {
                  setId_hubungan(data[0])
                  setHubungan(data[1])
                }
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={id_hubungan + '|' + hubungan}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  //render Dropdown listKerabat untuk ditampilkan di form
  const RenderKerabat = () => {
    const items = itemsKerabat;
    const placeholder = {
      label: 'Pilih Kerabat...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== null) {
                const data = value.split('|')
                if(data[0] !== id_kerabat) {
                  setId_kerabat(data[0])
                  setNama_kerabat(data[1])
                  setHubungan(data[2])
                  setSex(data[3])
                }
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={id_kerabat + '|' + nama_kerabat + '|' + hubungan + '|' + sex}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  //render Dropdown Gender untuk ditampilkan di form
  const RenderSex = () => {
    const placeholder = {
      label: 'Pilih Gender...',
      value: null
    };

    return (
        <RNPickerSelect
            placeholder={placeholder}
            items={[
              { label: 'Pria', value: 'Pria' },
              { label: 'Wanita', value: 'Wanita' },
            ]}
            onValueChange={(value) => {
              if(value !== null && value !== sex) {
                setSex(value)
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={sex}
            useNativeAndroidPickerStyle={false}
          />
    );
  }

  //render layanan sesuai jenis user
  function Pribadi() {
    return (
      <View style={styles.group}>
        <View style={styles.innerGroup2}>
          <Text style={styles.reservasiPribadi}>Reservasi Pribadi</Text>
          <MaterialCheckboxWithLabel
            style={styles.materialCheckboxWithLabel}
            handlePersetujuan={handlePersetujuan}
            checked={setujuPribadi}
          />
        </View>
      </View>
    )
  }

  function Kerabat() {
    return (
      <Reservasikerabat
        style={styles.group}
        RenderKerabat={RenderKerabat}
        handlePersetujuan={handlePersetujuan}
        handleTambahKerabat={handleTambahKerabat}
        checked={setujuKerabat}
        tambahKerabat={tambahKerabat}
        stylePilihKerabat={stylePilihKerabat}
      />
    )
  }

  function TambahKerabat() {
    return (
      <Formtambahkerabat
        style={styles.group}
        RenderHubungan={RenderHubungan}
        RenderSex={RenderSex}
        nama_kerabat={nama_kerabat}
        setNama_kerabat={setNama_kerabat}
        profesi_hobi={profesi_hobi}
        setProfesi_hobi={setProfesi_hobi}
        simpanKerabat={simpanKerabat}
        styleKerabat={styleKerabat}
      />
    )
  }

  function Layanan() {
    if(jenisLayanan === 'reguler') {
      switch(serviceUser) {
        case 'pribadi':
          return (
            <>
              <Pribadi />
              <Btnlanjut
                page="rootService"
                name="pribadi"
                type="reguler"
                style={styles.cupertinoButtonGrey}
                handleNextReguler={handleNextReguler}
              />
            </>
          )
          break;
        case 'kerabat':
          if(!tambahKerabat) {
            return(
              <>
                <Kerabat />
                <Btnlanjut
                  page="rootService"
                  name="kerabat"
                  type="reguler"
                  style={styles.cupertinoButtonGrey}
                  handleNextReguler={handleNextReguler}
                />
              </>
            )
          }else {
            return (
              <TambahKerabat />
            )
          }
          break;
        default:
          return (
            <></>
          )
      }
    }else {
      return (
        <></>
      )
    }
  }

  //simpan data
  const simpanKerabat = async () => {
    let paramsData = [];
    paramsData.push({
      nama_kerabat: nama_kerabat,
      sex: sex,
      profesi_hobi: profesi_hobi,
      id_hubungan: id_hubungan
    });

    //alert(JSON.stringify(paramsData));
    val = formValidation.handlePreSubmitAddKerabat(paramsData);
    if(val.status === false) {
      setStyleKerabat(val);
      //alert(JSON.stringify(val));
    }else if(val.status === true) {
      setLoadingSave(true);
      const formData = new FormData();
      formData.append("full_name", nama_kerabat);
      formData.append("id_pasien", dataLogin.id_pasien);
      formData.append("sex", sex);
      formData.append("profesi_hobi", profesi_hobi);
      formData.append("id_hubungan", id_hubungan);
      formData.append("token", dataLogin.token);

      axios
      .post(props.route.params.base_url + "pasien/regisFamily/", formData)
      .then(() => {
        setLoadingSave(false);
        pilihUser('kerabat');
        formValidation.showError('Registrasi berhasil...');
        setRefreshing(true);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            formValidation.showError('Terjadi kesalahan...');
          }else {
            formValidation.showError(error);
          }
          setLoadingSave(false);
      })
    }
  }

  const handleNextReguler = async (e) => {
    let nameButton = e;

    if(nameButton === 'pribadi' && setujuPribadi === false) {
      formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran untuk melanjutkan !!!');
    }else if(nameButton === 'kerabat' && setujuKerabat === false) {
      formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran kerabat anda untuk melanjutkan !!!');
    }else {
      //await AsyncStorage.setItem('checkPribadi', JSON.stringify(setujuPribadi));
      //await AsyncStorage.setItem('checkKerabat', JSON.stringify(setujuKerabat));
      onNextReguler();
    }
  };

  const onNextReguler = async () => {
    // Go to screen 'ft_page'
    if(setujuKerabat === true && id_kerabat === '') {
      setStylePilihKerabat(true);

      formValidation.showError('Anda belum memilih data kerabat');
    }else {
      let resKerabat = [];
      resKerabat.push({
        id_kerabat: id_kerabat,
        nama_kerabat: nama_kerabat,
        id_hubungan: id_hubungan,
        hubungan: hubungan,
        sex: sex
      })
      props.navigation.navigate('layananFirst', { base_url: props.route.params.base_url, resKerabat: resKerabat, id_profesi: id_profesi, jenisLayanan: layanan });
    }
  }

  const handleNextKhusus = async (e) => {
    const nameButton = e;
    let isValid = true;

    if(serviceUser === '') {
      isValid = false;
      formValidation.showError('Pengguna Layanan harus dipilih...');
    }else {
      if(serviceUser === 'kerabat' && (id_kerabat === '' || nama_kerabat === '' || hubungan === '' || sex === '')) {
        isValid = false;
        formValidation.showError('Data Kerabat harus dipilih...');
      }
    }

    if(!refCode == '') {
      if(refCode.length < 13){
        isValid = false;
        formValidation.showError('Kode Referensi tidak valid...');
      }
    }else {
      isValid = false;
      formValidation.showError('Kode Referensi harus diisi...');
    }

    if(isValid) {
      if(serviceUser === 'pribadi' && setujuPribadi === false) {
        formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran untuk melanjutkan !!!');
      }else if(serviceUser === 'kerabat' && setujuKerabat === false) {
        formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran kerabat anda untuk melanjutkan !!!');
      }else {
        //await AsyncStorage.setItem('checkPribadi', JSON.stringify(setujuPribadi));
        //await AsyncStorage.setItem('checkKerabat', JSON.stringify(setujuKerabat));
        onNextKhusus();
      }
    }
  };

  const onNextKhusus = async () => {
    // Go to screen 'ft_page'
    if(setujuKerabat === true && id_kerabat === '') {
      setStylePilihKerabat(true);

      formValidation.showError('Anda belum memilih data kerabat');
    }else {
      let resKerabat = [];
      resKerabat.push({
        id_kerabat: id_kerabat,
        nama_kerabat: nama_kerabat,
        id_hubungan: id_hubungan,
        hubungan: hubungan,
        sex: sex
      });
      
      props.navigation.navigate('profilNakesKhusus', { base_url: props.route.params.base_url, refCode: refCode, serviceUser: serviceUser, resKerabat: resKerabat, id_profesi: id_profesi, jenisLayanan: layanan });
    }
  }

  function refValidation(e) {
    const refCode = e;
    
    if(refCode !== '') {
      if(!refCode.match(/^[0-9]+$/)){
        return('');
      }else {
        return(refCode);
      }
    }else {
      return('');
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
              <Header style={styles.header} props={props} />
              <ScrollView
                        horizontal={false}
                        contentContainerStyle={styles.scrollArea_contentContainerStyle}
                        /*refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                          />
                        }*/
                      >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                      <Reguler />

                      <Layanan />

                      <Text style={styles.khusus}>KHUSUS</Text>
                      <View style={styles.group}>
                        <TouchableOpacity style={styles.rect4} onPress={() => pilihLayanan('khusus')}>
                          <Text style={styles.referensi}>REFERENSI</Text>
                        </TouchableOpacity>
                      </View>

                      <Khusus />
                      
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
    backgroundColor: "white",
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
  reguler: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: 15
  },
  group: {
    flex: 1,
    flexDirection: "row",
    marginTop: '4%'
  },
  innerGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    flex: 1
  },
  rect: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000000",
    marginRight: 5,
    padding: '5%'
  },
  rect2: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "rgba(74,74,74,1)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000000",
    marginLeft: 5,
    padding: '5%'
  },
  label: {
    flex: 1,
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    right: 0,
    textAlign: "center"
  },
  label2: {
    flex: 1,
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    right: 0,
    textAlign: "center"
  },
  innerGroup2: {
    flex: 1,
    justifyContent: "space-between",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '4%',
    backgroundColor: "rgba(255,255,255,1)",
  },
  reservasiPribadi: {
    fontSize: 18,
    fontFamily: "roboto-regular",
    color: "#121212",
  },
  materialCheckboxWithLabel: {
    flex: 1,
    padding: '2%'
  },
  cupertinoButtonGrey: {
    flex: 1,
    padding: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    backgroundColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  khusus: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '10%'
  },
  rect4: {
    flex: 1,
    padding: '2%',
    backgroundColor: "rgba(0,0,0,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  referensi: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    alignSelf: 'center',
  },
  rect5: {
    flex: 1,
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center"
  },
  keterangan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 12,
    marginTop: '2%'
  },
  radio1: {
    flex: 1,
    flexDirection: 'row',
    padding: '2%',
    alignSelf: 'stretch',
    marginTop: '2%'
  },
  /*radio2: {
    flex: 1,
    flexDirection: 'row',
    padding: '2%',
    alignSelf: 'stretch',
    marginTop: '1%'
  },*/
  btnlanjut: {
    flex: 1,
    padding: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    marginTop: '2%',
  },
  footer: {
    height: '10%'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    padding: '4%',
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 18,
    padding: '4%',
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Rootservice;
