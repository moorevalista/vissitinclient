import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import DataSheet_jam from './DataSheet_jam.js';
import { showMessage, hideMessage } from 'react-native-flash-message';
import moment from 'moment-timezone';

const APIKeyGoogle = 'AIzaSyCVZYXWQhorAn5yF0p_CBEioM71GA-bZ6I';
const baseUrl = 'https://apiuat.vissit.in/';
const flipPaymentUrl = 'https://flip.id/'; //production
const flipPaymentUrlConsolidation = 'https://flip.id/pwf/transaction/consolidation?redirected_from=internal&id='; //production
// const flipPaymentUrl = 'https://sandbox-test.flip.id/'; //sandbox
// const flipPaymentUrlConsolidation = 'https://sandbox-test.flip.id/pwf/transaction/consolidation?redirected_from=internal&id='; //sandbox

const dataSheets = {
  jam: new DataSheet_jam('jam'),
};

export const form_validation = React.createContext({
  env: 'development',
  base_url: baseUrl,
  flipPaymentUrl: flipPaymentUrl,
  flipPaymentUrlConsolidation: flipPaymentUrlConsolidation,
  theme: 'light',
  allowCheckIn: false,
  setAllowCheckIn: () => {},
  reqParams: '',
  setReqParams: () => {},
  toggleTheme: () => {},

  onChangeHp: (currVal, val) => {
    //const numericRegex = /^([0-9]{1,13})$/
    const numericRegex = /^(0|08|08[0-9]{1,13})$/
    if(val !== '' && val !== null) {
      if(numericRegex.test(val)) {
          return(val);
      }else {
        return(currVal);
      }
    }else {
      return('');
    }
  },

  onChangeInput: (val) => {
    if(val !== '' && val !== null) {
      return(val);
    }else {
      return('');
    }
  },

  //registrasi
  handlePreSubmit: (params) => {
    let isValid = true;
    let responseMsg = {};

    if(params[0].cpassword !== '' && params[0].password !== '') {
      if(params[0].cpassword != params[0].password) {
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(params[0].password !== '') {
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(params[0].password.length < 8) {
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!params[0].password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    if(params[0].email !== '') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(!params[0].email.match(pattern)){
        isValid = false;
        responseMsg['email'] = '*Email tidak valid';
      }else {
        responseMsg['email'] = '';
      }
    }else {
      isValid = false;
      responseMsg['email'] = '*Email tidak boleh kosong';
    }

    if(params[0].nophp !== '') {
      if(params[0].nohp.length < 10){
        isValid = false;
        responseMsg['nohp'] = '*No. Handphone tidak valid';
      }else {
        responseMsg['nohp'] = '';
      }
    }else {
      isValid = false;
      responseMsg['nohp'] = '*No. Handphone tidak boleh kosong';
    }

    if(params[0].namaBelakang !== '') {
      if(params[0].namaBelakang.length < 3){
        isValid = false;
        responseMsg['namaBelakang'] = '*Nama tidak valid';
      }else if(!params[0].namaBelakang.match(/^[a-zA-Z .,_-]+$/)){
        isValid = false;
        responseMsg['namaBelakang'] = '*Nama tidak valid';
      }else {
        responseMsg['namaBelakang'] = '';
      }
    }else {
      responseMsg['namaBelakang'] = '';
    }

    if(params[0].namaTengah !== '') {
      if(params[0].namaTengah.length < 3){
        isValid = false;
        responseMsg['namaTengah'] = '*Nama tidak valid';
      }else if(!params[0].namaTengah.match(/^[a-zA-Z .]+$/)){
        isValid = false;
        responseMsg['namaTengah'] = '*Nama tidak valid';
      }else {
        responseMsg['namaTengah'] = '';
      }
    }else {
      responseMsg['namaTengah'] = '';
    }

    if(params[0].namaDepan !== '') {
      if(params[0].namaDepan.length < 3){
        isValid = false;
        responseMsg['namaDepan'] = '*Nama tidak valid';
      }else if(!params[0].namaDepan.match(/^[a-zA-Z .]+$/)){
        isValid = false;
        responseMsg['namaDepan'] = '*Nama tidak valid';
      }else {
        responseMsg['namaDepan'] = '';
      }
    }else {
      isValid = false;
      responseMsg['namaDepan'] = '*Nama tidak boleh kosong';
    }

    //setErrorMsg(errorMsg);
    responseMsg['status'] = isValid;
    return(responseMsg);

  },

  checkHP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    if(params[0].nohp !== '') {
      callBack = await axios
      .get(params[0].base_url + "pasien/validationHp/" + params[0].nohp)
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Nomor handphone sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  checkEmail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    if(params[0].nohp !== '') {
      callBack = await axios
      .get(params[0].base_url + "pasien/validationEmail/" + params[0].email)
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Email sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  //registrasi
  requestOTP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    if(params[0].nohp !== '' && params[0].nohp !== undefined && params[0].hpNotExist) {
      callBack = await axios
      .get(params[0].base_url + "pasien/requestOTP/" + params[0].nohp)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = ''
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  logout: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    
    const formData = new FormData();
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "/pasien/logout/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getLoginData: async () => {
    const params = [];
    try {
      const loginState = await AsyncStorage.getItem('loginStatePasien');
      const hp = await AsyncStorage.getItem('hp');
      const id_pasien = await AsyncStorage.getItem('id_pasien');
      const nama_pasien = await AsyncStorage.getItem('nama_pasien');
      const verified = await AsyncStorage.getItem('verified');
      const token = await AsyncStorage.getItem('token');
      await params.push({
        loginState: loginState,
        hp: hp,
        id_pasien: id_pasien,
        nama_pasien: nama_pasien,
        verified: verified,
        token: token
      });
      //setDataLogin(params);
      //alert(JSON.stringify(dataLogin));

    } catch (error) {
      // Error saving data
      alert(error);
    } finally {
      return(params);
      //await setLoading(false);
    }
  },

  //saat update data
  checkEmailUpdate: async (params) => {
    let callBack = [];
    let isValid = true;
    let en_id_pasien = params[0].en_id_pasien;
    let email = params[0].email;
    let responseMsg = {};

    if(email != '') {
      callBack = await axios
      .get(params[0].base_url + "pasien/validationEmailUpdate/" + en_id_pasien, {params: {email: email, token: params[0].token}})
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Email sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error =>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }
    return(callBack);
  },

  //cek password lama saat update password
  checkCurrentPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let id_pasien = params[0].id_pasien;
    let old_pass = params[0].old_pass;
    let responseMsg = {};

    //const data = new URLSearchParams();
    //data.append('old_password', old_pass);

    if(old_pass !== '') {
      callBack = await axios
      .get(params[0].base_url + "pasien/validationPassword/" + id_pasien, {params: {old_password: params[0].old_pass}})
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Password lama salah";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }
    return(callBack);
  },

  handlePreSubmitUpdatePassword: (params) => {
    let isValid = true;
    let responseMsg = {};

    const password = params[0].password;
    const cpassword = params[0].cpassword;

    if(!cpassword == '' && !password == '') {
      if(cpassword != password){
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(!password == '') {
      //let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(password.length < 8){
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    responseMsg['status'] = isValid;
    return(responseMsg);
  },

  getHubungan: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "pasien/getHubungan/", {params: {token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getKerabat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "pasien/getKerabat/", {params: {id_pasien: params[0].id_pasien, token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  handlePreSubmitAddKerabat: (params) => {
    const nama_kerabat = params[0].nama_kerabat;
    const sex = params[0].sex;
    const profesi_hobi = params[0].profesi_hobi;
    const id_hubungan = params[0].id_hubungan;

    let isValid = true;
    let responseMsg = {};

    if(!profesi_hobi == '') {
      if(profesi_hobi.length < 3){
        isValid = false;
        responseMsg['profesi_hobi'] = '*Profesi/Hobi tidak valid';
      }else if(!profesi_hobi.match(/^[a-zA-Z .,_-]+$/)){
        isValid = false;
        responseMsg['profesi_hobi'] = '*Profesi/Hobi tidak valid';
      }else {
        responseMsg['profesi_hobi'] = '';
      }
    }else {
      responseMsg['profesi_hobi'] = '';
    }

    if(sex == '') {
      isValid = false;
      responseMsg['sex'] = '*Jenis kelamin tidak boleh kosong';
    }

    if(!nama_kerabat == '') {
      if(nama_kerabat.length < 3){
        isValid = false;
        responseMsg['nama_kerabat'] = '*Nama tidak valid';
      }else if(!nama_kerabat.match(/^[a-zA-Z .]+$/)){
        isValid = false;
        responseMsg['nama_kerabat'] = '*Nama tidak valid';
      }else {
        responseMsg['nama_kerabat'] = '';
      }
    }else {
      isValid = false;
      responseMsg['nama_kerabat'] = '*Nama tidak boleh kosong';
    }

    if(id_hubungan == '') {
      isValid = false;
      responseMsg['id_hubungan'] = '*Hubungan keluarga tidak boleh kosong';
    }

    responseMsg['status'] = isValid;
    return(responseMsg);
  },

  getKategoriPasien: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "pasien/getKategoriPasien/", {params: {token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getKlasifikasiPasien: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_profesi", params[0].id_profesi);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "pasien/getKlasifikasiPasien/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getDataPasien: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const id_pasien = params[0].id_pasien;

    callBack = await axios
      .get(params[0].base_url + "pasien/getUser/" + id_pasien, {params: {token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getLocationByAddress: async (address) => {
    //Geocode.setApiKey('AIzaSyCVZYXWQhorAn5yF0p_CBEioM71GA-bZ6I');

    Geocoder.init(APIKeyGoogle);

    const callBack = await Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location;
        return(location);
      })
      .catch(error => console.warn(error));

    return(callBack);
  },

  getLocation: async (lat, lon) => {
    //Geocode.setApiKey('AIzaSyCVZYXWQhorAn5yF0p_CBEioM71GA-bZ6I');

    Geocoder.init(APIKeyGoogle);

    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    if(lat !== '' && lon !== '') {
      callBack = await Geocoder.from(lat, lon)
        .then(json => {
          var location = json.results[0].formatted_address;
          //console.log(location);
          return(location);
        })
        .catch(error => console.warn(error));
    }

    return(callBack);
  },

  getJadwal: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("startDate", params[0].startDate);
      formData.append("startTime", params[0].startTime);
      formData.append("endTime", params[0].endTime);
      formData.append("address", params[0].address);
      formData.append("note", params[0].note);
      formData.append("useAddress", params[0].useAddress);
      formData.append("lat", params[0].lat);
      formData.append("lon", params[0].lon);
      formData.append("id_profesi", params[0].id_profesi);
      formData.append("id_kategori", params[0].id_kategori);
      formData.append("id_klasifikasi", params[0].id_klasifikasi);
      formData.append("id_layanan", params[0].id_layanan);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalNakes/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = res.messages;
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  handleSubmitReservasi: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();

    formData.append("token", params[0].token);
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("service_user", params[0].service_user);
    formData.append("id_paket", params[0].id_paket);
    formData.append("id_kerabat", params[0].id_kerabat);
    formData.append("order_type", params[0].order_type);
    formData.append("order_date", params[0].order_date);
    formData.append("order_start_time", params[0].order_start_time);
    formData.append("order_price", params[0].order_price);
    formData.append("order_discount", params[0].order_discount);
    formData.append("payment_type", params[0].payment_type);
    formData.append("destination_address", params[0].destination_address);
    formData.append("lat", params[0].lat);
    formData.append("lon", params[0].lon);
    formData.append("order_note", params[0].order_note);
    formData.append("id_faskes", params[0].id_faskes);
    formData.append("id_profesi", params[0].id_profesi);
    formData.append("id_kategori", params[0].id_kategori);
    formData.append("id_klasifikasi", params[0].id_klasifikasi);
    //console.log(formData);

    callBack = await axios
      .post(params[0].base_url + "layanan/reservation/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  handleSubmitReservasiKhusus: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();

    formData.append("token", params[0].token);
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("service_user", params[0].service_user);
    formData.append("id_kerabat", params[0].id_kerabat);
    formData.append("order_type", params[0].order_type);
    formData.append("jadwal_paket", JSON.stringify(params[0].jadwal_paket));
    formData.append("data_paket", JSON.stringify(params[0].data_paket));
    formData.append("payment_type", params[0].payment_type);

    callBack = await axios
      .post(params[0].base_url + "layanan/refReservation/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  //untuk menampilkan error
  showError: (e) => {
    showMessage({
      message: e,
      //description: "My message description",
      type: "default",
      backgroundColor: "#41aadf",
      color: "rgba(255,255,255,1)",
      duration: 5000
    });
  },

  currencyFormat: (num) => {
    return 'Rp. ' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  },

  getDataNakes: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "layanan/getNakesByRef/", {params: {ref: params[0].refCode, token: params[0].token, id_pasien: params[0].id_pasien, id_profesi: params[0].id_profesi}})
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  calc_age: (params) => {
    let today = new Date();
    let birthDate = new Date(params);  // create a date object directly from `dob1` argument
    let age_now = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age_now--;
    }
    return age_now;
  },

  addFavorite: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = ''; 

    const formData = new FormData();
    formData.append('id_pasien', params[0].id_pasien);
    formData.append('id_nakes', params[0].id_nakes);
    formData.append('favorite', params[0].favorite);
    formData.append('token', params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/setFavoriteNakes/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getJadwalKhusus: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    let id_nakes = params[0].id_nakes.substr(3);

    let selectDate = moment(params[0].selectDate).format('YYYY-MM-DD');
    let startTime = '00.00';
    let endTime = '22.00';

    const formData = new FormData();
      formData.append("ref", id_nakes);
      formData.append("startDate", selectDate);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalNakesByRef/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getPaket: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    let id_nakes = params[0].id_nakes.substr(3);
    let jenisPaket = params[0].jenisPaket;

    const formData = new FormData();
      formData.append("ref", id_nakes);
      formData.append("jenisPaket", jenisPaket);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getPaketNakesByRef/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getReservation: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getReservation/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getReservationDetail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("token", params[0].token);
      formData.append("state", params[0].state);

    callBack = await axios
      .post(params[0].base_url + "layanan/getReservationDetail/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  submitCancelReservasi: async(params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("alasan", params[0].alasan);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "pasien/cancelReservation/", formData)
      .then(res => {
        isValid = true;
          res = res.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  getAllChat: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getAllChatUser/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  getDetailChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_chat", params[0].id_chat);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getDetailChatUser/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  getFilterReport: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("token", params[0].token);
      formData.append("filter", params[0].filter);

    callBack = await axios
      .post(params[0].base_url + "pasien/getAllReport/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getAllReport: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "pasien/getAllReport/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getDataJadwal: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/" + params[0].method + "/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getJadwalForCheckIn: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalForCheckIn/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getJadwalForCheckOut: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalForCheckOut/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getJadwalAfterPayment: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_pasien", params[0].id_pasien);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalAfterPayment/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  convertDecimal: (ev) => {
    let biaya = ev;
    biaya = biaya.replace(/\./g,"");
    let biaya_fix = biaya.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    biaya_fix = biaya_fix.replace(/,/g, ".");
    return biaya_fix;
  },

  getDataSheet: (sheetId) => {
    // This method is the default implementation and could be customized by a state management plugin.
    return dataSheets[sheetId];
  },

  sendChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_chat", params[0].id_chat);
    formData.append("id_sender", params[0].id_sender);
    formData.append("messages", params[0].messages);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/sendChat/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  saveMsgRef: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_chat", params[0].id_chat);
    formData.append("id_msg", params[0].id_msg);
    formData.append("id_sender", params[0].id_sender);
    formData.append("ref", params[0].ref);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/saveMsgRef/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  readChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("prevChat", JSON.stringify(params[0].prevChat));
    formData.append("id_sender", params[0].id_sender);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/readChat/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  updatePayment: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("token", params[0].token);

    if(params[0].url !== '') {
      callBack = await axios
      .post(params[0].url, formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
      return(responseMsg);
    }
  },

  login: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("password", params[0].password);
    formData.append("fcmToken", params[0].fcmToken);

    callBack = await axios
      .post(params[0].base_url + "pasien/login/" + params[0].nohp, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  forgotPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .post(params[0].base_url + "pasien/forgot_password/" + params[0].hp)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        alert(JSON.stringify(error));
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  //reset password
  handlePreSubmitResetPassword: (params) => {
    let isValid = true;
    let responseMsg = {};

    if(params[0].cpassword !== '' && params[0].password !== '') {
      if(params[0].cpassword != params[0].password) {
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(params[0].password !== '') {
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(params[0].password.length < 8) {
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!params[0].password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    //setErrorMsg(errorMsg);
    responseMsg['status'] = isValid;
    return(responseMsg);

  },

  resetPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("en_id_pasien", params[0].en_id_pasien);
      formData.append("password", params[0].password);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "pasien/resetPassword/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  getDataFaskes: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "layanan/getAllFaskes/" + page + "/" + limit, {params: {lat: params[0].lat, lon: params[0].lon, token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getProfesiFaskes: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_faskes", params[0].id_faskes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getProfesiFaskes/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  getJadwalFaskes: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("startDate", params[0].startDate);
      formData.append("startTime", params[0].startTime);
      formData.append("endTime", params[0].endTime);
      formData.append("address", params[0].address);
      formData.append("id_faskes", params[0].id_faskes);
      formData.append("id_profesi", params[0].id_profesi);
      formData.append("id_kategori", params[0].id_kategori);
      formData.append("id_klasifikasi", params[0].id_klasifikasi);
      formData.append("id_layanan", params[0].id_layanan);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getJadwalFaskes/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = res.messages;
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  sendNotif: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("id_chat", params[0].id_chat);
    formData.append("token", params[0].token);
    formData.append("notif_type", params[0].notif_type);

    callBack = await axios
      .post(params[0].base_url + "layanan/sendNotif/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  convertToken: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("fcmToken", params[0].fcmToken);

    callBack = await axios
      .post(params[0].base_url + "layanan/convertTokenClient/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getAsyncStorage: async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  },

  checkToken: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "pasien/checkToken/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  //relogin
  getOTP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    if(params[0].nohp !== '' && params[0].nohp !== undefined) {
      callBack = await axios
      .get(params[0].base_url + "pasien/getOTP/" + params[0].nohp + '/' + params[0].operation)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = ''
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  getAds: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "layanan/getAds/", {params: {token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getFaskesById: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_faskes", params[0].id_faskes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getFaskesById/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getPaymentPayload: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getPaymentPayload/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  saveTrxIdFlip: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("trxId", params[0].trxId);
    formData.append("token", params[0].token);

    callBack = await axios
    .post(params[0].base_url + "layanan/saveTrxIdFlip/", formData)
    .then(res =>{
      isValid = true;
      res = res.data;
      responseMsg['msg'] = '';
      responseMsg['status'] = isValid;
      responseMsg['res'] = res;
      return(responseMsg);
    })
    .catch(error => {
      if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
      return(responseMsg);
    })
    return(callBack);
  },
























  


});

