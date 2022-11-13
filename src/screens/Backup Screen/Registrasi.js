import React, { Component, useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import Btnrequest from "../components/Btnrequest";
import Btnsubmit from "../components/Btnsubmit";

import { form_validation } from "../form_validation";
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';

import axios from 'axios';

function Registrasi(props) {
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

  //style textInput
  const [styleNamaDepan, setstyleNamaDepan] = useState(styles.inputText);
  const [styleNamaTengah, setstyleNamaTengah] = useState(styles.inputText);
  const [styleNamaBelakang, setstyleNamaBelakang] = useState(styles.inputText);
  const [styleHp, setstyleHp] = useState(styles.inputText);
  const [styleMail, setstyleMail] = useState(styles.inputText);
  const [stylePassword, setstylePassword] = useState(styles.inputText);
  const [styleCpassword, setstyleCpassword] = useState(styles.inputText);
  const [styleOTP, setstyleOTP] = useState(styles.kodeotp);

  //style box textInput
  const [styleBoxNamaDepan, setstyleBoxNamaDepan] = useState(styles.inputShape);
  const [styleBoxNamaTengah, setstyleBoxNamaTengah] = useState(styles.inputShape);
  const [styleBoxNamaBelakang, setstyleBoxNamaBelakang] = useState(styles.inputShape);
  const [styleBoxHp, setstyleBoxHp] = useState(styles.inputShape);
  const [styleBoxMail, setstyleBoxMail] = useState(styles.inputShape);
  const [styleBoxPassword, setstyleBoxPassword] = useState(styles.inputShape);
  const [styleBoxCpassword, setstyleBoxCpassword] = useState(styles.inputShape);
  const [styleBoxOTP, setstyleBoxOTP] = useState(styles.rect1);

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
      setstyleBoxNamaDepan(styles.inputShapeError);
    }else {
      setstyleBoxNamaDepan(styles.inputShape);
    }
    if(e.namaTengah !== '') {
      setstyleBoxNamaTengah(styles.inputShapeError);
    }else {
      setstyleBoxNamaTengah(styles.inputShape);
    }
    if(e.namaBelakang !== '') {
      setstyleBoxNamaBelakang(styles.inputShapeError);
    }else {
      setstyleBoxNamaBelakang(styles.inputShape);
    }
    if(e.nohp !== '') {
      setstyleBoxHp(styles.inputShapeError);
    }else {
      setstyleBoxHp(styles.inputShape);
    }
    if(e.email !== '') {
      setstyleBoxMail(styles.inputShapeError);
    }else {
      setstyleBoxMail(styles.inputShape);
    }
    if(e.password !== '') {
      setstyleBoxPassword(styles.inputShapeError);
    }else {
      setstyleBoxPassword(styles.inputShape);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(styles.inputShapeError);
    }else {
      setstyleBoxCpassword(styles.inputShape);
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

    //alert(JSON.stringify(paramsData));
    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      formValidation.showError('*Data mandatory harus diisi');
    }else {
      let params = [];
      params.push({ base_url: props.route.params.base_url, nohp: nohp, hpNotExist: hpNotExist });
      success = await formValidation.requestOTP(params);

      //alert(JSON.stringify(success)); return;
      if(success.status === true) {
        await setOtpRequested(false);
        await setSeconds(60);
        await setDataOTP(success.res);
      }
      //console.log(seconds);
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
              setstyleOTP(styles.kodeotpError);
              setstyleBoxOTP(styles.rect1Error);
              formValidation.showError('Kode OTP salah...');
            }else {
              setOtpVerified(true);
              setButtonDaftar(false);
              setSeconds(0);
              setstyleOTP(styles.kodeotp);
              setstyleBoxOTP(styles.rect1);
              //setOtpMsg('');
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
      //alert(JSON.stringify(success)); return;
      if(success.status === false) {
        setLoading(false);
        setHpNotExist(false);
        setOtpRequested(false);
        setOtpVerified(true);
        setstyleHp(styles.inputTextError);
        setstyleBoxHp(styles.inputShapeError);
        //showError(errorMsg);
        refNohp.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoading(false);
        setHpNotExist(true);
        setOtpRequested(true);
        setOtpVerified(false);
        setstyleHp(styles.inputText);
        setstyleBoxHp(styles.inputShape);
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
        setstyleMail(styles.inputTextError);
        setstyleBoxMail(styles.inputShapeError);
        //showError(errorMsg);
        refEmail.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoading(false);
        setstyleMail(styles.inputText);
        setstyleBoxMail(styles.inputShape);
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

    //alert(JSON.stringify(paramsData));
    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      if(val.password !== '') {
        formValidation.showError(val.password);
      }else if(val.cpassword !== '') {
        formValidation.showError(val.cpassword);
      }
      //alert(JSON.stringify(val));
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
            setstyleNamaDepan(styles.inputTextError);
          }else if(!namaDepan.match(/^[a-zA-Z .]+$/)) {
            errorMsg = '*Nama depan tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaDepan.current.focus();
            setstyleNamaDepan(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaDepan(styles.inputText);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaDepan(styles.inputText);
        }
        break;
      case 'namaTengah':
        if(namaTengah !== '') {
          if(namaTengah.length < 3) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleNamaTengah(styles.inputTextError);
          }else if(!namaTengah.match(/^[a-zA-Z .]+$/)) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleNamaTengah(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaTengah(styles.inputText);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaTengah(styles.inputText);
        }
        break;
      case 'namaBelakang':
        if(namaBelakang !== '') {
          if(namaBelakang.length < 3) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleNamaBelakang(styles.inputTextError);
          }else if(!namaBelakang.match(/^[a-zA-Z .,_-]+$/)) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleNamaBelakang(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaBelakang(styles.inputText);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaBelakang(styles.inputText);
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
            setstyleHp(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setOtpRequested(true);
            setOtpVerified(false);
            setstyleHp(styles.inputTextError);
            checkHP();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setOtpRequested(true);
          setOtpVerified(false);
          setstyleHp(styles.inputText);
        }
        break;
      case 'email':
        if(email !== '') {
          let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          if(!email.match(pattern)) {
            errorMsg = '*Email tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refEmail.current.focus();
            setstyleMail(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleMail(styles.inputText);
            checkEmail();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleMail(styles.inputText);
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
            setstylePassword(styles.inputTextError);
          }else if(!password.match(pattern)) {
            errorMsg = '*Password harus mengandung kombinasi huruf besar, kecil dan angka';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstylePassword(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstylePassword(styles.inputText);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstylePassword(styles.inputText);
        }
        break;
      case 'cpassword':
        if(cpassword !== '' && password !== '') {
          if(cpassword !== password) {
            errorMsg = '*Password tidak sama';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refCpassword.current.focus();
            setstyleCpassword(styles.inputTextError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleCpassword(styles.inputText);
          }
        }
        break;
    }

    //console.log(e.nativeEvent.text);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, styles.inner]}>
          <Text style={styles.text}>REGISTRASI</Text>
          <View style={styles.rect}>
            <View style={styles.scrollArea}>
            <Text style={[styles.text, {fontSize: 12, color: 'red', marginBottom: '2%'}]}>(*) Data mandatory</Text>
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
                <Spinner
                    visible={loading}
                    textContent={''}
                  />
                <View style={styles.inputBox}>
                  <View style={styleBoxNamaDepan}>
                    <TextInput
                      defaultValue=""
                      placeholder="*Nama Depan"
                      style={styleNamaDepan}
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
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxNamaTengah}>
                    <TextInput
                      placeholder="Nama Tengah"
                      style={styleNamaTengah}
                      numberOfLines={1}
                      maxLength={30}
                      value={namaTengah}
                      onChangeText={setNamaTengah}
                      onEndEditing={e => handleValidSubmit(e, 'namaTengah')}
                      autoCapitalize="words"
                      ref={refNamaTengah}
                    />
                  </View>
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxNamaBelakang}>
                    <TextInput
                      placeholder="Nama Belakang"
                      style={styleNamaBelakang}
                      numberOfLines={1}
                      maxLength={30}
                      value={namaBelakang}
                      onChangeText={setNamaBelakang}
                      onEndEditing={e => handleValidSubmit(e, 'namaBelakang')}
                      autoCapitalize="words"
                      ref={refNamaBelakang}
                    />
                  </View>
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxHp}>
                    <TextInput
                      placeholder="*No. Handphone Aktif"
                      keyboardType="numeric"
                      style={styleHp}
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
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxMail}>
                    <TextInput
                      placeholder="*Email"
                      style={styleMail}
                      numberOfLines={1}
                      keyboardType="email-address"
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
                </View>
                <View style={styles.separator}>
                  <View style={styles.kataSandiRow}>
                    <Text style={styles.kataSandi}>Kata Sandi</Text>
                    <View style={styles.rect2}></View>
                  </View>
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxPassword}>
                    <TextInput
                      placeholder="*Kata Sandi"
                      style={[stylePassword, {marginRight: '1%'}]}
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
                </View>
                <View style={styles.inputBox}>
                  <View style={styleBoxCpassword}>
                    <TextInput
                      placeholder="*Ulangi Kata Sandi"
                      style={[styleCpassword, {marginRight: '1%'}]}
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
                </View>
                <View style={styles.otp}>
                  <View style={styles.fotp}>
                    <View style={styleBoxOTP}>
                      <TextInput
                        placeholder="Kode OTP"
                        keyboardType="phone-pad"
                        style={styleOTP}
                        numberOfLines={1}
                        maxLength={6}
                        onChangeText={setOtp}
                        editable={!otpVerified}
                      />
                    </View>
                  </View>
                  <Btnrequest
                    style={styles.btnreqotp}
                    otpRequested={otpRequested}
                    otpVerified={otpVerified}
                    nohp={nohp}
                    requestOTP={requestOTP}
                    seconds={seconds}
                  />
                </View>
                <Btnsubmit
                  style={styles.cupertinoButtonLight}
                  handleSubmit={handleSubmit}
                  buttonDaftar={buttonDaftar}
                />
                <View>
                  {showAlertBox()}
                </View>
              </ScrollView>
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
    backgroundColor: "rgba(255,255,255,1)",
  },
  containerKey: {
    flex: 1
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 25,
    letterSpacing: 5,
    textAlign: "center",
    marginTop: '5%'
  },
  rect: {
    backgroundColor: "rgba(80,227,194,1)",
    borderTopRightRadius: 80,
    flex: 1,
    marginTop: 44
  },
  scrollArea: {
    flex: 1,
    //marginTop: '10%'
  },
  scrollArea_contentContainerStyle: {
    padding: '5%',
    height: 'auto'
  },
  inputBox: {
    height: 66,
    marginBottom: '2%'
  },
  inputShape: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  inputShapeError: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "red"
  },
  icon2: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginRight: '5%'
  },
  inputText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    fontSize: 20,
    marginLeft: '5%',
    marginRight: '5%'
  },
  inputTextError: {
    fontFamily: "roboto-regular",
    color: "red",
    flex: 1,
    fontSize: 20,
    marginLeft: '5%',
    marginRight: '5%'
  },
  otp: {
    height: 66,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: '2%'
  },
  fotp: {
    flex: 3,
    marginRight: '1%'
  },
  rect1: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  rect1Error: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "red"
  },
  kodeotp: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    fontSize: 20,
    marginLeft: '8%',
    marginRight: '8%'
  },
  kodeotpError: {
    fontFamily: "roboto-regular",
    color: "red",
    flex: 1,
    fontSize: 20,
    marginLeft: '8%',
    marginRight: '8%'
  },
  btnreqotp: {
    flex: 2,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
  },
  cupertinoButtonLight: {
    height: 66,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    marginTop: '2%'
  },
  separator: {
    height: 'auto',
    flexDirection: "row",
    marginTop: '2%',
    marginBottom: '2%'
  },
  kataSandi: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16
  },
  rect2: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(0,0,0,1)",
    borderRadius: 100,
    marginLeft: 11,
    marginTop: '3%'
  },
  kataSandiRow: {
    flexDirection: "row",
    flex: 1
  },
});

export default Registrasi;
