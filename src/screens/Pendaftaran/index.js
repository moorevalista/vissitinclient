import React, { Component, useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView, Platform
} from 'react-native';

import { form_validation } from "../../form_validation";
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

export default function Pendaftaran(props) {
  const formValidation = useContext(form_validation);

  const [loading, setLoading] = useState(false);
  const [hpNotExist, setHpNotExist] = useState(false);
  const [statusReg, setStatusReg] = useState(false);
  const [notifReg, setNotifReg] = useState('');

  const [otp, setOtp] = useState('');
  const [dataOTP, setDataOTP] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [otpMsg, setOtpMsg] = useState('');

  //variable untuk menampung data yang diinput
  const [namaDepan, setNamaDepan] = useState('');
  const [namaTengah, setNamaTengah] = useState('');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [nohp, setNohp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const refNamaDepan = useRef(null);
  const refNamaTengah = useRef(null);
  const refNamaBelakang = useRef(null);
  const refNohp = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refCpassword = useRef(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [buttonDaftar, setButtonDaftar] = useState(true);

  //style box textInput
  const [styleBoxNamaDepan, setstyleBoxNamaDepan] = useState(styles.TxtInput);
  const [styleBoxNamaTengah, setstyleBoxNamaTengah] = useState(styles.TxtInput);
  const [styleBoxNamaBelakang, setstyleBoxNamaBelakang] = useState(styles.TxtInput);
  const [styleBoxHp, setstyleBoxHp] = useState(styles.TxtInput);
  const [styleBoxMail, setstyleBoxMail] = useState(styles.TxtInput);
  const [styleBoxPassword, setstyleBoxPassword] = useState(styles.Form_pass);
  const [styleBoxCpassword, setstyleBoxCpassword] = useState(styles.Form_pass);
  const [styleBoxOTP, setstyleBoxOTP] = useState(styles.TxtInput);

  //show/hide password
  const toogleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  //show/hide confirm password
  const toogleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
  }

  //validasi no hp
  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  //render icon show/hide password
  const RenderIcon = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry}>
        <Icon {...props} type="font-awesome-5" style={styles.icon2} name={secureTextEntry ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //render icon show/hide confirm password
  const RenderIcon1 = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry1}>
        <Icon {...props} type="font-awesome-5" style={styles.icon2} name={secureTextEntry1 ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    //alert(JSON.stringify(e));
    if(e.namaDepan !== '') {
      setstyleBoxNamaDepan(styles.TxtInput_error);
    }else {
      setstyleBoxNamaDepan(styles.TxtInput);
    }
    if(e.namaTengah !== '') {
      setstyleBoxNamaTengah(styles.TxtInput_error);
    }else {
      setstyleBoxNamaTengah(styles.TxtInput);
    }
    if(e.namaBelakang !== '') {
      setstyleBoxNamaBelakang(styles.TxtInput_error);
    }else {
      setstyleBoxNamaBelakang(styles.TxtInput);
    }
    if(e.nohp !== '') {
      setstyleBoxHp(styles.TxtInput_error);
    }else {
      setstyleBoxHp(styles.TxtInput);
    }
    if(e.email !== '') {
      setstyleBoxMail(styles.TxtInput_error);
    }else {
      setstyleBoxMail(styles.TxtInput);
    }
    if(e.password !== '') {
      setstyleBoxPassword(styles.Form_pass_error);
    }else {
      setstyleBoxPassword(styles.Form_pass);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(styles.Form_pass_error);
    }else {
      setstyleBoxCpassword(styles.Form_pass);
    }
  }

  //request OTP
  const requestOTP = async () => {
    let paramsData = [];
    paramsData.push({
      namaDepan: namaDepan,
      namaTengah: namaTengah,
      namaBelakang: namaBelakang,
      nohp: nohp,
      email: email,
      password: password,
      cpassword: cpassword
    });

    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      formValidation.showError('*Data mandatory harus diisi');
    }else {
      let params = [];
      params.push({ base_url: props.route.params.base_url, nohp: nohp, hpNotExist: hpNotExist });
      success = await formValidation.requestOTP(params);

      if(success.status === true) {
        await setOtpRequested(false);
        await setSeconds(60);
        await setDataOTP(success.res);
      }
    }
  }

  //set timer setelah request OTP
  useEffect(() => {
    if(dataOTP !== '') {
      const timer = setInterval(() => {
        setSeconds(prevCount => {
          prevCount <= 1 && clearInterval(timer)
          //console.log(prevCount)
          prevCount <= 1 ? setOtpRequested(true):''
          return prevCount - 1
        }); // <-- Change this line!
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [dataOTP]);

  //trigger cek OTP yg diinput user
  useEffect(() => {
    handleValidationOTP()
  }, [otp]);

  //cek OTP yg diinput user
  const handleValidationOTP = async () => {
    if(otp !== '') {
      if(!otp.match(/^[0-9]+$/)){
        setOtp('');
      }else {
        if(otp.length >= 6) {
          const formData = new FormData();
          formData.append("hp", nohp);
          formData.append("otp", otp);
          formData.append("operation", dataOTP.operation);
          formData.append("datetime_created", dataOTP.datetime_created);
          formData.append("datetime_expired", dataOTP.datetime_expired);

          await axios
          .post(props.route.params.base_url + "pasien/checkOTP/", formData)
          .then(res => {
            if(res.data.responseCode !== '000') {
              setOtpVerified(false);
              setButtonDaftar(true);
              setstyleBoxOTP(styles.TxtInput_error);
              formValidation.showError('Kode OTP salah...');
            }else {
              setOtpVerified(true);
              setButtonDaftar(false);
              setSeconds(0);
              setstyleBoxOTP(styles.TxtInput);
            }
          })
          .catch(error=>{
            if(error.response != undefined && error.response.status == 404) {
              formValidation.showError('Terjadi kesalahan...');
            }else {
              formValidation.showError(error);
            }
          })
        }
      }
    }
  }

  //cek HP apakah sudah terdaftar/belum
  const checkHP = async () => {
    if(nohp !== '' && nohp.length >= 10) {
      setLoading(true);
      let params = [];
      params.push({ base_url: props.route.params.base_url, nohp: nohp });
      success = await formValidation.checkHP(params);
      if(success.status === false) {
        setLoading(false);
        setHpNotExist(false);
        setOtpRequested(false);
        setOtpVerified(true);
        setstyleBoxHp(styles.TxtInput_error);
        refNohp.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoading(false);
        setHpNotExist(true);
        setOtpRequested(true);
        setOtpVerified(false);
        setstyleBoxHp(styles.TxtInput);
      }
    }
  }

  //cek email apakah sudah terdaftar/belum
  const checkEmail = async () => {
    if(email !== '') {
      setLoading(true);
      let params = [];
      params.push({ base_url: props.route.params.base_url, email: email });
      success = await formValidation.checkEmail(params);
      if(success.status === false) {
        setLoading(false);
        setstyleBoxMail(styles.TxtInput_error);
        refEmail.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoading(false);
        setstyleBoxMail(styles.TxtInput);
      }
    }
  }

  //ketika user klik tombol DAFTAR
  const handleSubmit = async () => {
    let paramsData = [];
    paramsData.push({
      namaDepan: namaDepan,
      namaTengah: namaTengah,
      namaBelakang: namaBelakang,
      nohp: nohp,
      email: email,
      password: password,
      cpassword: cpassword
    });

    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      if(val.password !== '') {
        formValidation.showError(val.password);
      }else if(val.cpassword !== '') {
        formValidation.showError(val.cpassword);
      }
    }else if(val.status === true) {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", namaDepan);
      formData.append("middle_name", namaTengah);
      formData.append("last_name", namaBelakang);
      formData.append("hp", nohp);
      formData.append("email", email);
      formData.append("password", password);

      axios
      .post(props.route.params.base_url + "pasien/registrasi/", formData)
      .then(() => {
        setLoading(false);
        setNotifReg('Registrasi berhasil. Silahkan cek email untuk aktivasi akun anda.');
        setStatusReg(true);
      })
      .catch(error => {
        if(error.response != undefined && error.response.status == 404) {
            formValidation.showError('Terjadi kesalahan...');
          }else {
            formValidation.showError(error);
          }
          setLoading(false);
      })
    }
  }

  //handle input validation sebelum disubmit
  const handleValidSubmit = async(e, name) => {
    let fieldName = name;
    let errorMsg = {};

    switch(fieldName) {
      case 'namaDepan':
        if(namaDepan !== '') {
          if(namaDepan.length < 3) {
            errorMsg = '*Nama depan tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaDepan.current.focus();
            setstyleBoxNamaDepan(styles.TxtInput_error);
          }else if(!namaDepan.match(/^[^\s]+[a-zA-Z .]+$/)) {
            errorMsg = '*Nama depan tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaDepan.current.focus();
            setstyleBoxNamaDepan(styles.TxtInput_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxNamaDepan(styles.TxtInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleBoxNamaDepan(styles.TxtInput);
        }
        break;
      case 'namaTengah':
        if(namaTengah !== '') {
          if(namaTengah.length < 3) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleBoxNamaTengah(styles.TxtInput_error);
          }else if(!namaTengah.match(/^[^\s]+[a-zA-Z .]+$/)) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleBoxNamaTengah(styles.TxtInput_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxNamaTengah(styles.TxtInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleBoxNamaTengah(styles.TxtInput);
        }
        break;
      case 'namaBelakang':
        if(namaBelakang !== '') {
          if(namaBelakang.length < 3) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleBoxNamaBelakang(styles.TxtInput_error);
          }else if(!namaBelakang.match(/^[^\s]+[a-zA-Z .,_-]+$/)) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleBoxNamaBelakang(styles.TxtInput_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxNamaBelakang(styles.TxtInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleBoxNamaBelakang(styles.TxtInput);
        }
        break;
      case 'nohp':
        if(nohp !== '') {
          if(nohp.length < 10) {
            errorMsg = '*Nomor handphone tidak valid';
            setErrorMsg(errorMsg);
            setOtpRequested(false);
            setOtpVerified(true);
            formValidation.showError(errorMsg);
            refNohp.current.focus();
            setstyleBoxHp(styles.TxtInput_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setOtpRequested(true);
            setOtpVerified(false);
            setstyleBoxHp(styles.TxtInput_error);
            checkHP();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setOtpRequested(true);
          setOtpVerified(false);
          setstyleBoxHp(styles.TxtInput);
        }
        break;
      case 'email':
        if(email !== '') {
          let pattern = new RegExp(/^[^\s]+(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          if(!email.match(pattern)) {
            errorMsg = '*Email tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refEmail.current.focus();
            setstyleBoxMail(styles.TxtInput_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxMail(styles.TxtInput);
            checkEmail();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleBoxMail(styles.TxtInput);
        }
        break;
      case 'password':
        if(password !== '') {
          let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
          if(password.length < 8) {
            errorMsg = '*Password minimal 8 digit';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(styles.Form_pass_error);
          }else if(!password.match(pattern)) {
            errorMsg = '*Password harus mengandung kombinasi huruf besar, kecil dan angka';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(styles.Form_pass_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxPassword(styles.Form_pass);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleBoxPassword(styles.Form_pass);
        }
        break;
      case 'cpassword':
        if(cpassword !== '' && password !== '') {
          if(cpassword !== password) {
            errorMsg = '*Password tidak sama';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refCpassword.current.focus();
            setstyleBoxCpassword(styles.Form_pass_error);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleBoxCpassword(styles.Form_pass);
          }
        }
        break;
    }
  }

  useEffect(() => {
    showAlertBox()
  }, [statusReg])

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={statusReg}
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
          onConfirmPressed={() => {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'loginScreen'
                  }
                ],
              })
            )
          }}
        />
    )
  }

  const [styleButton, setStyleButton] = useState(otpRequested);

  useEffect(() => {
    (otpVerified || !otpRequested || nohp === '') ? setStyleButton(styles.Btn_minta_otp_disable) : setStyleButton(styles.Btn_minta_otp);
  }, [otpRequested]);

  useEffect(() => {
    (otpVerified || !otpRequested || nohp === '') ? setStyleButton(styles.Btn_minta_otp_disable) : setStyleButton(styles.Btn_minta_otp);
  }, [otpVerified]);

  useEffect(() => {
    (otpVerified || !otpRequested || nohp === '') ? setStyleButton(styles.Btn_minta_otp_disable) : setStyleButton(styles.Btn_minta_otp);
  }, [nohp]);

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <View style={[styles.container, styles.inner]}>
          <View style={styles.scrollArea}>
            <Spinner
              visible={loading}
              textContent={''}
              textStyle={styles.spinnerTextStyle}
            />
            <View
              style={styles.OtpLogin}
              onLayout={event => setLayout(event.nativeEvent.layout)}>
              <View style={styles.Group459(layout)}>
                <View style={styles.Group089(layout)}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle(layout)}
                    refreshControl={
                      <RefreshControl refreshing={false} onRefresh={() => null} />
                    }>
                    <Text style={styles.daftarAkun}>DAFTAR AKUN</Text>
                    <Text style={styles.wajibDiisi}>*Wajib diisi</Text>

                      <View style={styles.Form_pass_lama}>
                        <TextInput
                          placeholder="*Nama Depan"
                          style={styleBoxNamaDepan}
                          defaultValue=""
                          numberOfLines={1}
                          maxLength={30}
                          value={namaDepan}
                          onChangeText={setNamaDepan}
                          onEndEditing={e => handleValidSubmit(e, 'namaDepan')}
                          autoCapitalize="words"
                          ref={refNamaDepan}
                          autoFocus={true}
                        />
                      </View>
                      <View style={styles.Form_pass_lama}>
                        <TextInput
                          placeholder="Nama Tengah"
                          style={styleBoxNamaTengah}
                          numberOfLines={1}
                          maxLength={30}
                          value={namaTengah}
                          onChangeText={setNamaTengah}
                          onEndEditing={e => handleValidSubmit(e, 'namaTengah')}
                          autoCapitalize="words"
                          ref={refNamaTengah}
                        />
                      </View>
                      <View style={styles.Form_pass_lama}>
                        <TextInput
                          placeholder="Nama Belakang"
                          style={styleBoxNamaBelakang}
                          numberOfLines={1}
                          maxLength={30}
                          value={namaBelakang}
                          onChangeText={setNamaBelakang}
                          onEndEditing={e => handleValidSubmit(e, 'namaBelakang')}
                          autoCapitalize="words"
                          ref={refNamaBelakang}
                        />
                      </View>
                      <View style={styles.Form_pass_lama}>
                        <TextInput
                          placeholder="*No Handphone (Whatsapp) Aktif"
                          keyboardType="phone-pad"
                          style={styleBoxHp}
                          numberOfLines={1}
                          value={nohp}
                          onChangeText={onChangeHp}
                          onEndEditing={e => handleValidSubmit(e, 'nohp')}
                          //onBlur={e => checkHP(e, 'nohp')}
                          dataDetector="phoneNumber"
                          maxLength={15}
                          ref={refNohp}
                        />
                      </View>
                      <View style={styles.Form_pass_lama}>
                        <TextInput
                          placeholder="*Email AKtif"
                          keyboardType="email-address"
                          style={styleBoxMail}
                          numberOfLines={1}
                          maxLength={50}
                          value={email}
                          onChangeText={setEmail}
                          onEndEditing={e => handleValidSubmit(e, 'email')}
                          //onBlur={e => checkEmail(e, 'email')}
                          textContentType="emailAddress"
                          autoCapitalize="none"
                          ref={refEmail}
                        />
                      </View>
                      <View style={styleBoxPassword}>
                        <TextInput
                          placeholder="*Kata Sandi"
                          style={styles.TxtInputPass}
                          numberOfLines={1}
                          minLength={8}
                          maxLength={15}
                          value={password}
                          onChangeText={setPassword}
                          onEndEditing={e => handleValidSubmit(e, 'password')}
                          secureTextEntry={secureTextEntry}
                          ref={refPassword}
                        />
                        <RenderIcon />
                      </View>
                      <View style={styleBoxCpassword}>
                        <TextInput
                          placeholder="*Ulangi Kata Sandi"
                          style={styles.TxtInputPass}
                          numberOfLines={1}
                          minLength={8}
                          maxLength={15}
                          value={cpassword}
                          onChangeText={setCpassword}
                          onEndEditing={e => handleValidSubmit(e, 'cpassword')}
                          secureTextEntry={secureTextEntry1}
                          ref={refCpassword}
                        />
                        <RenderIcon1 />
                      </View>

                    {!otpVerified ?
                      <>
                        <View style={styles.Form_pass_lama}>
                          <TextInput
                            placeholder="Kode OTP"
                            keyboardType="numeric"
                            style={styleBoxOTP}
                            numberOfLines={1}
                            maxLength={6}
                            onChangeText={setOtp}
                            editable={!otpVerified}
                          />

                          <TouchableOpacity disabled={(otpVerified || !otpRequested || nohp === '') ? true : false} onPress={requestOTP}>
                            <View style={styleButton}>
                              <Text style={styles.TxtOTP}>{seconds > 0 ? '(' + seconds + ' detik)': 'Minta OTP'}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.multiple1}>
                            <Text style={{color: 'rgba(36,195,142,1)'}}>Kode OTP </Text>{' '}
                            akan dikirimkan pada No. Whatsapp pastikan No handphone anda
                            aktif pada
                            <Text style={{color: 'rgba(36,195,142,1)'}}> Whatsapp </Text>
                          </Text>
                        </View>
                      </>
                      :
                      <></>
                    }
                    <View>
                      {showAlertBox()}
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.wrapperBottom(layout)}>
                  {!buttonDaftar ?
                    <TouchableOpacity
                      onPress={handleSubmit}>
                      <View style={styles.Btn_lanjut}>
                        <Text style={styles.Txt4105}>DAFTAR</Text>
                      </View>
                    </TouchableOpacity>
                    :
                    <View style={styles.Btn_empty}>
                      
                    </View>
                  }
                </View>
              </View>
            </View>
          </View>
          <FlashMessage position="top" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(80,227,194,1)",
    borderWidth: 0,
    borderColor: "#000000"
  },
  containerKey: {
    flex: 1,
    // paddingTop: '10%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea: {
    flex: 1,
  },
  scrollArea_contentContainerStyle: layout => ({
    height: 'auto',
    width: layout.width * 0.8
  }),
  OtpLogin: {    
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Group459: layout => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    none: '0px',
  }),
  Group089: layout => ({
    //flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    marginHorizontal: '5%',
    width: layout.width,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    //marginBottom: '20%'
    maxHeight: layout.height * 0.85
  }),

  Form_pass_lama: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    //paddingBottom: 10,
    //marginHorizontal: 20,
    marginBottom: 10,
  },
  TxtInput: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    //marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    //width: '70%',
    height: Platform.OS === "ios" ? 40 : 40,
  },
  TxtInput_error: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'red',
    //width: '70%',
    height: Platform.OS === "ios" ? 40 : 40,
  },
  TxtOTP: {
    fontSize: 12,
    borderRadius: 20,
    color: 'rgba(255, 255, 255, 1)',
    borderColor: 'rgba(184,202,213,1)',
    marginHorizontal: 25,
  },
  wrapperBottom: layout => ({
    flex: 1,
    paddingVertical: '5%',
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: layout.width,
  }),

  multiple1: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    paddingBottom: 10,
    marginHorizontal: 40,
  },
  daftarAkun: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    fontWeight: 'bold',
  },
  wajibDiisi: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    paddingBottom: 10,
  },
  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 100,
    marginHorizontal: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
  },
  Btn_minta_otp: {
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,54)',
    height: 50,
    marginLeft: 20,
  },
  Btn_minta_otp_disable: {
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.50)',
    height: 50,
    marginLeft: 20,
  },
  Txt4105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Form_pass: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: 'rgba(184,202,213,1)',
    borderRadius: 20,
    borderWidth: 1,
  },
  Form_pass_error: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
    borderColor: 'red',
    borderRadius: 20,
    borderWidth: 1,
  },
  TxtInputPass: {
    flex: 1,
    fontSize: 12,
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    borderRadius: 20,
    color: 'rgba(0,32,51,1)',
    textAlign: 'left',
    height: 40,
    //borderWidth: 1,
    //borderColor: 'rgba(184,202,213,1)',
  },

  icon2: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginRight: '5%'
  },

  Btn_empty: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 100,
    marginHorizontal: 20,
    height: 40,
  },

});
