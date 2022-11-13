import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
//import DatePicker from 'react-native-date-picker';
//import moment from 'moment';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Loader from '../../components/Loader';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

export default function EditDataPribadi(props) {
  const formValidation = useContext(form_validation);
  const [notifReg, setNotifReg] = useState('');
  const [statusUpdate, setStatusUpdate] = useState(false);

  const [dataLogin, setDataLogin] = useState('');
  const [dataPasien, setDataPasien] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(props.route.params.updateData);
  const [location, setLocation] = useState('');

  //variable untuk menampung data input
  const [first_name, setFirst_name] = useState('');
  const [middle_name, setMiddle_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [hp, setHp] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [birth_place, setBirth_place] = useState('');
  const [birth_date, setBirth_date] = useState('');
  const [ktp_address, setKtp_address] = useState('');
  const [id_provinsi, setId_provinsi] = useState('');
  const [id_kota, setId_kota] = useState('');
  const [id_kecamatan, setId_kecamatan] = useState('');
  const [id_kelurahan, setId_kelurahan] = useState('');
  const [kodepos, setKodepos] = useState('');

  const [nama_provinsi, setNama_provinsi] = useState('');
  const [nama_kota, setNama_kota] = useState('');
  const [nama_kecamatan, setNama_kecamatan] = useState('');
  const [nama_kelurahan, setNama_kelurahan] = useState('');
  const [full_address, setFull_address] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const [locationValid, setLocationValid] = useState(false);

  //variable untuk menampung dataset dari database (provinsi, kota, dll)
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataKelurahan, setDataKelurahan] = useState([]);

  //variable untuk menampung list yang dirender dari dataset untuk ditampilkan pada dropdown (pendidikan, provinsi, dll)
  const [itemsProvinsi, setItemsProvinsi] = useState([]);
  const [itemsKota, setItemsKota] = useState([]);
  const [itemsKecamatan, setItemsKecamatan] = useState([]);
  const [itemsKelurahan, setItemsKelurahan] = useState([]);

  //date time picker
  const [openDate, setOpenDate] = useState(false);

  //ref untuk field input
  let refKodepos = useRef(null);
  let refKtp_address = useRef(null);
  let refBirth_date = useRef(null);
  let refBirth_place = useRef(null);
  let refEmail = useRef(null);
  let refSex = useRef(null);

  const [styleKodepos, setstyleKodepos] = useState(styles.inputShape);
  const [styleId_kelurahan, setstyleId_kelurahan] = useState(styles.inputShape);
  const [styleId_kecamatan, setstyleId_kecamatan] = useState(styles.inputShape);
  const [styleId_kota, setstyleId_kota] = useState(styles.inputShape);
  const [styleId_provinsi, setstyleId_provinsi] = useState(styles.inputShape);
  const [styleKtp_address, setstyleKtp_address] = useState(styles.inputShape);
  const [styleBirth_date, setstyleBirth_date] = useState(styles.inputShape);
  const [styleBirth_place, setstyleBirth_place] = useState(styles.inputShape);
  const [styleEmail, setstyleEmail] = useState(styles.inputShape);
  const [styleSex, setstyleSex] = useState(styles.inputShape);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    refreshing ? getLoginData() : '';
  },[refreshing]);

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

  const getDataPasien = async () => {
    axios
      .get(props.route.params.base_url + "pasien/getUser/" + dataLogin.id_pasien, {params: {token: dataLogin.token}})
      .then(res => {
        setDataPasien(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getLoginData();
  },[]);

  useEffect(() => {
    if(dataLogin) {
      getDataPasien();
    }
  },[dataLogin]);

  useEffect(() => { //trigger render listProvinsi
    listProvinsi();
  }, [dataProvinsi]);

  useEffect(() => {
    listKota();
  }, [dataKota]);

  useEffect(() => {
    listKecamatan();
  }, [dataKecamatan]);

  useEffect(() => {
    listKelurahan();
  },[dataKelurahan]);

  useEffect(() => { //set existing data Pasien
    if(dataPasien) {
      //alert(JSON.stringify(dataPasien.data));
      setCurrentDataPasien();
    }
  }, [dataPasien]);

  const setCurrentDataPasien = async () => {
    await setLoading(true);
    await setFirst_name(dataPasien.data.first_name);
    await setMiddle_name(dataPasien.data.middle_name);
    await setLast_name(dataPasien.data.last_name);
    await setHp(dataPasien.data.hp);
    await setEmail(dataPasien.data.email);
    await setSex(dataPasien.data.sex);
    await setBirth_place(dataPasien.data.birth_place);
    await setBirth_date(dataPasien.data.birth_date);
    await setKtp_address(dataPasien.data.ktp_address);
    await setId_provinsi(dataPasien.data.id_provinsi);
    await setId_kota(dataPasien.data.id_kota);
    await setId_kecamatan(dataPasien.data.id_kecamatan);
    await setId_kelurahan(dataPasien.data.id_kelurahan);
    await setKodepos(dataPasien.data.kodepos);

    await setNama_provinsi(dataPasien.data.nama_provinsi);
    await setNama_kota(dataPasien.data.nama_kota);
    await setNama_kecamatan(dataPasien.data.nama_kecamatan);
    await setNama_kelurahan(dataPasien.data.nama_kelurahan);
    await setFull_address(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
    //setLat(location.lat);
    //setLon(location.lng);

    await getProvinsi();
    if(dataPasien.data.id_provinsi !== null) { getKota(dataPasien.data.id_provinsi); }
    if(dataPasien.data.id_kota !== null) { getKecamatan(dataPasien.data.id_kota); }
    if(dataPasien.data.id_kecamatan !==  null) { getKelurahan(dataPasien.data.id_kecamatan); }
    await setLoading(false);
  }

  function getLocationByAddress(ev) {
    success = formValidation.getLocationByAddress(ev);
    //alert(JSON.stringify(success));
    setLocation(success);
    return(success);
  }

  //fetch list provinsi
  const getProvinsi = async () => {
    axios
      .get(props.route.params.base_url + "pasien/getProvinsi/", {params: {token: dataLogin.token}})
      .then(res => {
        setDataProvinsi(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kota
  const getKota = async (id) => {
    axios
      .get(props.route.params.base_url + "pasien/getKota/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        setDataKota(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kecamatan
  const getKecamatan = async (id) => {
    axios
      .get(props.route.params.base_url + "pasien/getKecamatan/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        setDataKecamatan(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kelurahan
  const getKelurahan = async (id) => {
    axios
      .get(props.route.params.base_url + "pasien/getKelurahan/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        setDataKelurahan(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kodepos
  const getKodepos = async (id) => {
    if(id !== '' && id !== null && id !== undefined) {
      const newItems = dataKelurahan.data;
      setKodepos(newItems.filter(
        item => item.id_kelurahan === id
      )[0].kodepos);
    }
  }

  //set listProvinsi dari dataset provinsi
  const listProvinsi = async () => {
    const newItems = dataProvinsi.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_provinsi, label: item.nama_provinsi}
        )
      });
    }
    //console.log(options);
    setItemsProvinsi(options);
  }

  //set listKota dari dataset kota
  const listKota = async () => {
    const newItems = dataKota.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kota, label: item.nama_kota}
        )
      });
    }
    //console.log(options);
    setItemsKota(options);
  }

  //set listKecamatan dari dataset kecamatan
  const listKecamatan = async () => {
    const newItems = dataKecamatan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kecamatan, label: item.nama_kecamatan}
        )
      });
    }
    //console.log(options);
    setItemsKecamatan(options);
  }

  //set listKelurahan dari dataset kelurahan
  const listKelurahan = async () => {
    const newItems = dataKelurahan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kelurahan, label: item.nama_kelurahan}
        )
      });
    }
    //console.log(options);
    setItemsKelurahan(options);
  }

  //render Dropdown list Jenis Kelamin untuk ditampilkan di form
  const Sex = () => {
    const placeholder = {
      label: 'Pilih Jenis Kelamin',
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
              if(value !== sex) {
                setSex(value)
              }
            }}
            //onDonePress={() => console.log(gender)}
            style={pickerSelectStyles}
            value={sex}
            useNativeAndroidPickerStyle={false}
            ref={el => {
              refSex = el;
            }}
          />
        
    );
  }

  useEffect(() => {
    if(!loading && updateData) {
      if(id_provinsi !== undefined && id_provinsi !== '' && id_provinsi !== null) {
        const newItems = itemsProvinsi.filter(
          item => item.value === id_provinsi
        );
        setNama_provinsi(newItems[0].label);

        getKota(id_provinsi);
      }
    }
  },[id_provinsi]);

  //render Dropdown listProvinsi untuk ditampilkan di form
  const Provinsi = () => {
    const items = itemsProvinsi;
    const placeholder = {
      label: 'Pilih Provinsi',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_provinsi) {
                setId_provinsi(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_provinsi}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  useEffect(() => {
    if(!loading && updateData) {
      if(id_kota !== undefined && id_kota !== '' && id_kota !== null) {
        const newItems = itemsKota.filter(
          item => item.value === id_kota
        );
        setNama_kota(newItems[0].label);

        getKecamatan(id_kota);
      }
    }
  },[id_kota]);

  //render Dropdown listKota untuk ditampilkan di form
  const Kota = () => {
    const items = itemsKota;
    const placeholder = {
      label: 'Pilih Kota',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kota) {
                setId_kota(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kota}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  useEffect(() => {
    if(!loading && updateData) {
      if(id_kecamatan !== undefined && id_kecamatan !== '' && id_kecamatan !== null) {
        const newItems = itemsKecamatan.filter(
          item => item.value === id_kecamatan
        );
        setNama_kecamatan(newItems[0].label);

        getKelurahan(id_kecamatan);
      }
    }
  },[id_kecamatan]);

  //render Dropdown listKecamatan untuk ditampilkan di form
  const Kecamatan = () => {
    const items = itemsKecamatan;
    const placeholder = {
      label: 'Pilih Kecamatan',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kecamatan) {
                setId_kecamatan(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kecamatan}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  useEffect(() => {
    if(!loading && updateData) {
      if(id_kelurahan !== undefined && id_kelurahan !== '' && id_kelurahan !== null) {
        const newItems = itemsKelurahan.filter(
          item => item.value === id_kelurahan
        );
        setNama_kelurahan(newItems[0].label);
        //alert(newItems[0].label);
        getKodepos(id_kelurahan);
      }
    }
  },[id_kelurahan]);

  //render Dropdown listKelurahan untuk ditampilkan di form
  const Kelurahan = () => {
    const items = itemsKelurahan;
    const placeholder = {
      label: 'Pilih Kelurahan',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kelurahan) {
                setId_kelurahan(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kelurahan}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  useEffect(() => {
    showAlertBox()
  }, [statusUpdate])

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={statusUpdate}
          showProgress={false}
          title="Info"
          message={notifReg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          //showCancelButton={true}
          showConfirmButton={true}
          //cancelText="No, cancel"
          confirmText="Ok"
          confirmButtonColor="#DD6B55"
          //onCancelPressed={() => {
          //  setShowAlert(false);
          //}}
        />
    )
  }

  //check Email
  const checkEmail = async (e) => {
    let params = [];
    params.push({ en_id_pasien: dataPasien.data.en_id_pasien, email: e, base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.checkEmailUpdate(params);
    
    if(success.status === false) {
      formValidation.showError(success.msg);
      refEmail.current.focus();
      setstyleEmail(styles.inputShapeError);
    }else {
      setstyleEmail(styles.inputShape);
    }
  }

  //cek apakah data yang akan disubmit sudah valid
  const handleValidSubmit = () => {
    let isValid = true;
    let errorMsg = {};

    if(email !== '') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(!email.match(pattern)) {
        isValid = false;
        errorMsg = '*Email tidak valid';
        formValidation.showError(errorMsg);
        refEmail.current.focus();
        setstyleEmail(styles.inputShapeError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleEmail(styles.inputShape);
      }
    }else {
      isValid = false;
      errorMsg = '*Email harus diisi';
      formValidation.showError(errorMsg);
      refEmail.current.focus();
      setstyleEmail(styles.inputShapeError);
      return isValid;
    }

    if(sex === null) {
      isValid = false;
      errorMsg = '*Jenis kelamin harus diisi';
      formValidation.showError(errorMsg);
      setstyleSex(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleSex(styles.inputShape);
    }

    if(birth_place !== '' && birth_place !== null && birth_place !== 'null') {
      if(birth_place.length < 3) {
        isValid = false;
        errorMsg = '*Tempat lahir tidak valid';
        formValidation.showError(errorMsg);
        refBirth_place.current.focus();
        setstyleBirth_place(styles.inputShapeError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleBirth_place(styles.inputShape);
      }
    }else {
      isValid = false;
      errorMsg = '*Tempat lahir harus diisi';
      formValidation.showError(errorMsg);
      refBirth_place.current.focus();
      setstyleBirth_place(styles.inputShapeError);
      return isValid;
    }

    if(birth_date === '' || birth_date === null) {
      isValid = false;
      errorMsg = '*Tanggal lahir harus diisi';
      formValidation.showError(errorMsg);
      refBirth_date.current.focus();
      setstyleBirth_date(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleBirth_date(styles.inputShape);
    }

    if(ktp_address !== '' && ktp_address !== null && ktp_address !== 'null') {
      if(ktp_address.length < 3) {
        isValid = false;
        errorMsg = '*Alamat tidak valid';
        formValidation.showError(errorMsg);
        refKtp_address.current.focus();
        setstyleKtp_address(styles.inputShapeError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleKtp_address(styles.inputShape);
      }
    }else {
      isValid = false;
      errorMsg = '*Alamat harus diisi';
      formValidation.showError(errorMsg);
      refKtp_address.current.focus();
      setstyleKtp_address(styles.inputShapeError);
      return isValid;
    }

    if(id_provinsi === null || id_provinsi === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_provinsi.current.focus();
      setstyleId_provinsi(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_provinsi(styles.inputShape);
    }

    if(id_kota === null || id_kota === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kota.current.focus();
      setstyleId_kota(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kota(styles.inputShape);
    }

    if(id_kecamatan === null || id_kecamatan === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kecamatan.current.focus();
      setstyleId_kecamatan(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kecamatan(styles.inputShape);
    }

    if(id_kelurahan === null || id_kelurahan === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kelurahan.current.focus();
      setstyleId_kelurahan(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kelurahan(styles.inputShape);
    }

    if(kodepos === null || kodepos === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refKodepos.current.focus();
      setstyleKodepos(styles.inputShapeError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleKodepos(styles.inputShape);
    }

    return isValid;
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      setLoadingSave(true);

      await setFull_address(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
      const geoLocation = await getLocationByAddress(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
      
      //console.log(JSON.stringify(geoLocation));
      
      if((geoLocation.lat !== '' && geoLocation.lat !== null) && (geoLocation.lng !== '' && geoLocation.lng !== null)) {
        //alert(JSON.stringify(geoLocation)); return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("sex", sex);
        formData.append("birth_place", birth_place);
        formData.append("birth_date", moment(birth_date, 'MM-DD-YYYY').format('YYYY-MM-DD'));
        formData.append("ktp_address", ktp_address);
        formData.append("id_kelurahan", id_kelurahan);
        formData.append("lat", geoLocation.lat);
        formData.append("lon", geoLocation.lng);
        formData.append("token", dataLogin.token);

        axios
          .post(props.route.params.base_url + "pasien/updateDataPasien/" + dataPasien.data.en_id_pasien, formData)
          .then((res =>{
            setLoadingSave(false);
            if(res.data.responseCode !== "000") {
              formValidation.showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
            }else {
              setUpdateData(false);
              formValidation.showError('Data berhasil disimpan...');
              props.navigation.goBack();
            }
          }))
          .catch(error => {
            setLoadingSave(false);
            if(error.response != undefined && error.response.status == 404) {
              formValidation.showError('Terjadi kesalahan...');
            }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
              formValidation.showError(error.response.data.messages.error);
            }else {
              formValidation.showError(error);
            }
          })
      }else {
        formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif.');
      }
    }
  }

  const onCancel = async () => {
    //alert(birth_date);
    await setUpdateData(!updateData);
    //(dataPasien ? setCurrentDataPasien():'');
    onRefresh();
  }

  return (
    !loading ?
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
      <SafeAreaView style={styles.container}>

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
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => null} />
          }>
          <View style={styles.Group326}>
            {/*<View style={styles.Group0401}>
              <Image
                style={styles.Useravatar}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/df31r87ukza-326%3A6716?alt=media&token=75118522-a3ef-47c9-b1ca-8e13c29a8d98',
                }}
              />
              <Text style={styles.Txt279}>Ganti Foto Profil</Text>
            </View>*/}
            <View style={styles.Group040}>
              <Text style={styles.Txt798}>*Wajib diisi</Text>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Nama Lengkap</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="*Nama Lengkap"
                    editable={false}
                  >{first_name + " " + middle_name + " " + last_name}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*No. Handphone</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    keyboardType="phone-pad"
                    placeholder="*No. Handphone"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="phoneNumber"
                    editable={false}
                  >{hp}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Email Aktif</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    keyboardType="email-address"
                    placeholder="*Email Aktif"
                    editable={updateData}
                    maxlength={50}
                    onChangeText={(e) => {
                      setEmail(e);
                      checkEmail(e);
                    }}
                    onEndEditing={(e) => {
                      checkEmail(e.nativeEvent.text);
                    }}
                    ref={refEmail}
                    autoCapitalize="none"
                  >{email}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Jenis Kelamin</Text>
                <View style={styles.Form_pass_lama}>
                  {!updateData ?
                    <TextInput
                      placeholder="Jenis Kelamin"
                      editable={false}
                    >{sex}</TextInput>
                    :
                    <Sex />
                  }
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Tempat Lahir</Text>

                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Tempat Lahir"
                    editable={updateData}
                    maxLength={50}
                    onChangeText={setBirth_place}
                    ref={refBirth_place}
                    autoCapitalize="words"
                  >{birth_place}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Tanggal Lahir</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    showSoftInputOnFocus={false}
                    style={styles.Txt346}
                    placeholder="Tanggal Lahir"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="calendarEvent"
                    editable={updateData}
                    ref={refBirth_date}
                    onFocus={() => setOpenDate(true)}
                  >{(birth_date !== null && birth_date !== '0000-00-00') ? moment(birth_date, 'MM-DD-YYYY').format('DD-MM-YYYY'):''}
                  <DatePicker
                    theme="auto"
                    modal
                    locale="en"
                    mode="date"
                    open={openDate}
                    date={(birth_date !== '0000-00-00' && birth_date !== null) ? new Date(birth_date):new Date()}
                    maximumDate={new Date('2004-12-31')}
                    onConfirm={(date) => {
                      setOpenDate(false)
                      setBirth_date(date)
                    }}
                    onCancel={() => {
                      setOpenDate(false)
                    }}
                  />
                  </TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Alamat Tempat Tinggal</Text>
                <View style={styles.Alamat}>
                  <TextInput
                    style={styles.Txt_Alamat}
                    placeholder="Alamat Tempat Tinggal"
                    multiline={true}
                    maxLength={255}
                    editable={updateData}
                    onChangeText={(e) => {
                      setKtp_address(e)
                      setId_kelurahan('')
                      setKodepos('')
                    }}
                    ref={refKtp_address}
                    autoCapitalize="words"
                  >{ktp_address}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Provinsi</Text>
                <View style={styles.Form_pass_lama}>
                  {!updateData ?
                    <TextInput
                      placeholder="Pilih Provinsi"
                      editable={false}
                    >{nama_provinsi}</TextInput>
                    :
                    <Provinsi />
                  }
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Kabupaten</Text>
                <View style={styles.Form_pass_lama}>
                  {!updateData ?
                    <TextInput
                      placeholder="Pilih Kabupaten"
                      editable={false}
                    >{nama_kota}</TextInput>
                    :
                    <Kota />
                  }
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Kecamatan</Text>
                <View style={styles.Form_pass_lama}>
                  {!updateData ?
                    <TextInput
                      placeholder="Pilih Kecamatan"
                      editable={false}
                    >{nama_kecamatan}</TextInput>
                    :
                    <Kecamatan />
                  }
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Kelurahan</Text>
                <View style={styles.Form_pass_lama}>
                  {!updateData ?
                    <TextInput
                      placeholder="Pilih Kelurahan"
                      editable={false}
                    >{nama_kelurahan}</TextInput>
                    :
                    <Kelurahan />
                  }
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Kode Pos</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="*Kode Pos"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="none"
                    editable={false}
                    ref={refKodepos}
                  >{kodepos}</TextInput>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onSubmit}>
              <View style={styles.Btn_lanjut}>
                <Text style={styles.Txt760}>SIMPAN</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            {showAlertBox()}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  Group326: {
    paddingVertical: 26,
  },

  Nama_lengkap: {
    marginBottom: 10,
    borderRadius: 20,
  },
  Form_pass_lama: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
    height: 40,
  },

  Alamat: {
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
    height: 80,
    paddingVertical: 10
  },
  Txt_Alamat: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
  },

  Txt346: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
  },

  Txt869: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
  },

  Group0401: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  Group040: {
    marginHorizontal: 20,
  },
  Txt279: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 12,
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  Txt798: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(0,0,0,1)',
    width: 261,
    height: 13,
  },

  Useravatar: {
    width: 98,
    height: 98,
    borderRadius: 100,
  },

  selectOption: {
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    borderWidth: 0.2,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    marginVertical: 20,
    color: 'rgba(0,32,51,1)',
    backgroundColor: 'white',
    height: 40,
  },
  Btn_lanjut: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingVertical: '2%',
    marginBottom: 10,
    marginHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Txt760: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Nav_header: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 19,
    paddingRight: 19,
    backgroundColor: "rgba(217,217,217,1)",
    
  },
  Tbl_home: {
    width: 24,
    height: 24,
  },
  Txt827: {
    fontSize: 12,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    justifyContent: "center",
  },

  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    //marginTop: '15%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
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
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
