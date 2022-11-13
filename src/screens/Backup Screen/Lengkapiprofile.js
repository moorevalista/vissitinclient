import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import HeaderPasien from "../components/HeaderPasien";
import Simpanbtn from "../components/Simpanbtn";
import Btnbatal from "../components/Btnbatal";
import Footermenu from "../components/Footermenu";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Loader from '../components/Loader';
import DatePicker from 'react-native-date-picker';
//import {Picker} from '@react-native-picker/picker';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import RNPickerSelect from 'react-native-picker-select';

function Lengkapiprofile(props) {
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

  useEffect(() => { //set existing data Nakes
    if(dataPasien) {
      //alert(JSON.stringify(dataNakes.data));
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
    if(updateData) {
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
      label: 'Pilih Provinsi...',
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
    if(updateData) {
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
      label: 'Pilih Kota...',
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
    if(updateData) {
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
      label: 'Pilih Kecamatan...',
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
    if(updateData) {
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
      label: 'Pilih Kelurahan...',
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
        formData.append("birth_date", moment(birth_date).format('YYYY-MM-DD'));
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
    <>
      <View style={styles.headerPasien}>
        <HeaderPasien dataLogin={dataLogin} />
      </View>
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
              <View style={styles.container}>
                <Text style={styles.lengkapiDataDiri}>INFORMASI{"\n"}PRIBADI</Text>
                <View style={[styles.scrollArea, styles.inner]}>
                    <View style={styles.box}>
                      <View style={styles.inputShape}>
                        <TextInput
                          placeholder="Nama Depan"
                          style={styles.inputText}
                          editable={false}
                        >{first_name + " " + middle_name + " " + last_name}</TextInput>
                      </View>
                    </View>
                    {/*<View style={styles.box}>
                      <View style={styles.inputShape}>
                        <TextInput
                          placeholder="Nama Tengah"
                          style={styles.inputText}
                        >{middle_name}</TextInput>
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={styles.inputShape}>
                        <TextInput
                          placeholder="Nama Belakang"
                          style={styles.inputText}
                        >{last_name}</TextInput>
                      </View>
                    </View>*/}
                    <View style={styles.box}>
                      <View style={styles.inputShape}>
                        <TextInput
                          placeholder="No. Handphone Aktif"
                          clearButtonMode="never"
                          textBreakStrategy="simple"
                          dataDetector="phoneNumber"
                          keyboardType="phone-pad"
                          style={styles.inputText}
                        >{hp}</TextInput>
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={styleEmail}>
                        <TextInput
                          placeholder="Email"
                          style={styles.inputText}
                          keyboardType="email-address"
                          editable={updateData}
                          maxLength={50}
                          onChangeText={(e) => {
                            setEmail(e);
                            checkEmail(e);
                          }}
                          onEndEditing={(e) =>{
                            checkEmail(e.nativeEvent.text)
                          }}
                          ref={refEmail}
                          autoCapitalize="none"
                        >{email}</TextInput>
                      </View>
                    </View>

                    <View style={styles.box}>
                      {!updateData ?
                        <View style={[styles.inputShape, {flex: 0.5, alignSelf: 'flex-start'}]}>
                          <TextInput
                            placeholder="Jenis Kelamin"
                            style={styles.inputText}
                            editable={false}
                          >{sex}</TextInput>
                        </View>
                        :
                        <View style={[styleSex, {flex: 0.5, alignSelf: 'flex-start'}]}>
                          <Sex />
                        </View>
                      }
                    </View>

                    <View style={styles.box}>
                      <View style={styleBirth_place}>
                        <TextInput
                          placeholder="Tempat Lahir"
                          style={styles.inputText}
                          editable={updateData}
                          maxLength={50}
                          onChangeText={setBirth_place}
                          ref={refBirth_place}
                          autoCapitalize="words"
                        >{birth_place}</TextInput>
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={[styleBirth_date, {flex: 0.5, alignSelf: 'flex-start'}]}>
                        <TextInput
                          placeholder="Tgl. Lahir"
                          style={styles.inputText}
                          showSoftInputOnFocus={false}
                          clearButtonMode="never"
                          textBreakStrategy="simple"
                          dataDetector="calendarEvent"
                          editable={updateData}
                          ref={refBirth_date}
                          onFocus={() => setOpenDate(true)}
                        >{(birth_date !== null && birth_date !== '0000-00-00') ? moment(birth_date, 'MM-DD-YYYY').format('DD-MM-YYYY'):''}
                          <DatePicker
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
                    <View style={[styles.box, {height: 120}]}>
                      <View style={[styleKtp_address, {borderRadius: 28}]}>
                        <TextInput
                          placeholder="Alamat Domisili"
                          multiline={true}
                          style={styles.inputText}
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
                    <View style={styles.box}>
                      {!updateData ?
                        <View style={styles.inputShape}>
                          <TextInput
                            placeholder="Provinsi"
                            style={styles.inputText}
                            editable={false}
                          >{nama_provinsi}</TextInput>
                        </View>
                        :
                        <View style={styleId_provinsi}>
                          <Provinsi />
                        </View>
                      }
                    </View>
                    <View style={styles.box}>
                      <View style={styleId_kota}>
                        {!updateData ?
                          <TextInput
                            placeholder="Kabupaten Kota"
                            style={styles.inputText}
                            editable={false}
                          >{nama_kota}</TextInput>
                          :<Kota />
                        }
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={styleId_kecamatan}>
                        {!updateData ?
                          <TextInput
                            placeholder="Kecamatan"
                            style={styles.inputText}
                            editable={false}
                          >{nama_kecamatan}</TextInput>
                          :<Kecamatan />
                        }
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={styleId_kelurahan}>
                        {!updateData ?
                          <TextInput
                            placeholder="Kelurahan"
                            style={styles.inputText}
                            editable={false}
                          >{nama_kelurahan}</TextInput>
                          :<Kelurahan />
                        }
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={[styleKodepos, {flex: 0.5, alignSelf: 'flex-start'}]}>
                        <TextInput
                          placeholder="Kode Pos"
                          style={styles.inputText}
                          clearButtonMode="never"
                          textBreakStrategy="simple"
                          dataDetector="none"
                          editable={false}
                          ref={refKodepos}
                        >{kodepos}</TextInput>
                      </View>
                    </View>

                    <View style={styles.box}>
                      <Simpanbtn
                        style={styles.button}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                        onSubmit={onSubmit}
                      />
                    </View>
                    {updateData ?
                      <View style={styles.box}>
                        <Btnbatal
                          style={styles.button}
                          updateData={updateData}
                          setUpdateData={setUpdateData}
                          onCancel={onCancel}
                        />
                      </View>
                      :<></>
                    }
                </View>
              </View>
              <View>
                {showAlertBox()}
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
    paddingBottom: '60%'
  },
  containerKey: {
    height: 'auto',
    backgroundColor: "white",
    top: '-7%',
    zIndex: -100,
  },
  inner: {
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  headerPasien: {
    height: '20%'
  },
  scrollArea: {
    flex: 1,
    height: 'auto',
    padding: '4%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    marginTop: '15%'
  },
  lengkapiDataDiri: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '4%'
  },
  box: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: '4%'
  },
  inputShape: {
    flex: 1,
    padding: '4%',
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  inputShapeError: {
    flex: 1,
    padding: '4%',
    borderRadius: 100,
    backgroundColor: "#FF8063",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  inputText: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20
  },
  button: {
    flex: 1,
    padding: '4%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)"
  },
  footer: {
    height: '10%',
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 20,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Lengkapiprofile;
