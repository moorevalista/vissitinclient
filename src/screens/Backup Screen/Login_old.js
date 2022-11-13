import React, { Component, useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from "react-native";
import BtnLogin from "../components/BtnLogin";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

import PushNotification, {Importance} from 'react-native-push-notification';

function Login(props) {
  const formValidation = useContext(form_validation);
  const base_url = formValidation.base_url;

  const [loginState, setLoginState] = useState(false);
  const [nohp, setNohp] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  //let dataPasien = [];
  //let token = '';
  const [dataPasien, setDataPasien] = useState('');
  const [token, setToken] = useState('');

  const [deviceToken, setDeviceToken] = useState(null);

  const [relogin, setRelogin] = useState(false);
  const [otp, setOtp] = useState('');
  const [dataOTP, setDataOTP] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const [styleOTP, setstyleOTP] = useState(styles.kodeotp);
  const [styleBoxOTP, setstyleBoxOTP] = useState(styles.rect1);
  const [buttonSubmit, setButtonSubmit] = useState(true);

  const setData = (key, value) => {
    switch(key) {
      case 'setNohp':
        setNohp(value);
        break;
      case 'setPassword':
        setPassword(value);
        break;
    }
  }

  useEffect(() => {
    showAlertBox();

    return () => {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loginCheck();

    return () => {
      setLoginState(false);
    }
  }, []);

  //trigger cek OTP yg diinput user
  useEffect(() => {
    handleValidationOTP()
  }, [otp]);

  useEffect(() => {
    if(otpVerified) {
      onLoginSuccess();
    }

    return () => {
      setDeviceToken(deviceToken);
    }
  }, [otpVerified]);

  const registerToken = () => {
    PushNotification.configure({
      onRegister: async function(fcmToken) {
        console.log('TOKEN:', fcmToken);

        if(Platform.OS === 'ios') {
          let params = [];
          params.push({
            base_url: base_url,
            fcmToken: fcmToken['token']
          })
          success = await formValidation.convertToken(params);

          if(success.status === true) {
            await setDeviceToken(success.res.registration_token);
          }else {
            await setDeviceToken(null);
          }
        }else {
          await setDeviceToken(fcmToken['token']);
        }
      },
    })
    return () => {
      setDeviceToken(deviceToken);
    }
  }

  const loginCheck = async() => {
    try {
      const value = await AsyncStorage.getItem('loginStatePasien')
      if(value) {
        const token = await AsyncStorage.getItem('token');
        if(token !== null) {
          let params = [];
          params.push({
            base_url: base_url,
            token: token
          });

          success = await formValidation.checkToken(params);
          //console.log(success);

          if(success.status === true) {
            if(success.res.responseCode === '000') {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'homeScreen',
                      params: { base_url: base_url },
                    }
                  ],
                })
              )
            }else {
              await AsyncStorage.clear();
              try {
                const value = await AsyncStorage.getItem('loginStatePasien')
                if(!value) {
                  registerToken();
                }
              } catch(e) {
                alert(e);
              }
            }
          }
        }else {
          registerToken();
        }
      }else {
        registerToken();
      }
    } catch(e) {
      // error reading value
      alert(e);
    }
  }

  /*const setDataPasien = async(val) => {
    dataPasien.push({
      id_pasien: val.data.id_pasien,
      nama_pasien: val.data.nama_pasien,
      hp: val.data.hp,
      verified: val.data.verified
    });
    token = val.token;
  }*/

  const handleSubmit = async() => {
    //alert(base_url); return;
    if(nohp !== '' && password !== '') {
      setLoading(true);

      if(deviceToken !== null) {
        let params = [];
        params.push({
          base_url: base_url,
          nohp: nohp,
          password: password,
          fcmToken: deviceToken
        });

        success = await formValidation.login(params);

        if(success.status === true) {
          if(success.res.responseCode !== '000') {
            await setErrMsg(success.res.messages);
            await setShowAlert(true);
          }else {
            //await setDataPasien(success.res);
            let pasien = [];
            pasien.push({
              id_pasien: success.res.data.id_pasien,
              nama_pasien: success.res.data.nama_pasien,
              hp: success.res.data.hp,
              verified: success.res.data.verified
            });
            await setDataPasien(pasien);
            await setToken(success.res.token);

            let params = [];
            params.push({
              base_url: base_url,
              nohp: nohp,
              operation: 'login'
            });
            getOTP = await formValidation.getOTP(params);

            if(getOTP.status === true) {
              await setDataOTP(getOTP.res);
              await setRelogin(true);
            }else {
              formValidation.showError('Terjadi kesalahan...');
            }
            //await onLoginSuccess();
          }
          await setLoading(false);
        }
      }else {
        setLoading(false);
        formValidation.showError('Terjadi kesalahan...');
      }
    }
  }

  const onLoginSuccess = async () => {
    //alert(JSON.stringify(dataNakes)); return;
    try {
      await AsyncStorage.setItem('loginStatePasien', JSON.stringify(true));
      await AsyncStorage.setItem('hp', dataPasien[0].hp);
      await AsyncStorage.setItem('id_pasien', dataPasien[0].id_pasien);
      await AsyncStorage.setItem('nama_pasien', dataPasien[0].nama_pasien);
      await AsyncStorage.setItem('verified', dataPasien[0].verified);
      await AsyncStorage.setItem('token', token);

    } catch (error) {
      // Error saving data
      alert(error);
    }
    
    //props.navigation.navigate('mainMenuScreen', { base_url: base_url} );
    props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'homeScreen',
                  params: { base_url: base_url },
                }
              ],
            })
          )
  }

  const onRegistrasi = async () => {
    //alert(base_url);
    props.navigation.navigate('registrasiScreen', { base_url: base_url });
  }

  const resetPass = () => {
    props.navigation.navigate('lupaPass', { base_url: base_url });
  }

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Info"
          message={errMsg}
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
            setErrMsg('');
            setShowAlert(false);
          }}
        />
    )
  }

  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  const onChangeInput = (e) => {
    val = formValidation.onChangeInput(e);
    setPassword(val);
  }

  //cek OTP yg diinput user
  const handleValidationOTP = async () => {
    if(otp !== '') {
      if(!otp.match(/^[0-9]+$/)){
        setOtp('');
      }else {
        if(otp.length >= 6) {
          setLoading(true);
          const formData = new FormData();
          formData.append("hp", nohp);
          formData.append("otp", otp);
          formData.append("operation", dataOTP.operation);
          formData.append("datetime_created", dataOTP.datetime_created);
          formData.append("datetime_expired", dataOTP.datetime_expired);

          await axios
          .post(base_url + "pasien/verifyOTP/", formData)
          .then(res => {
            setLoading(false);
            if(res.data.responseCode !== '000') {
              setOtpVerified(false);
              setstyleOTP(styles.kodeotpError);
              setstyleBoxOTP(styles.rect1Error);
              formValidation.showError('Kode OTP salah...');
            }else {
              setstyleOTP(styles.kodeotp);
              setstyleBoxOTP(styles.rect1);
              setOtpVerified(true);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, styles.inner]}>
          <View style={styles.scrollArea}>
            {/*<ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
            >*/}
              <Spinner
                  visible={loading}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                />
              <View style={styles.group1}>
                <View style={styles.header1}>
                  <Image
                    source={require("../assets/images/Logo_bb-01.png")}
                    resizeMode="contain"
                    style={styles.logo1}
                  ></Image>
                </View>
              </View>

              {!relogin ?
                <View style={styles.inputBox}>
                  <View style={styles.fnohp}>
                    <View style={styles.shapenohp}>
                      <TextInput
                        placeholder="No. Handphone"
                        style={styles.nohp}
                        value={nohp}
                        onChangeText={onChangeHp}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.fsandi}>
                    <View style={styles.shapepass}>
                      <TextInput
                        placeholder="Kata Sandi"
                        secureTextEntry={true}
                        style={styles.pass}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={onChangeInput}
                      />
                    </View>
                  </View>
                  <BtnLogin
                    style={styles.btnmasuk}
                    handleSubmit={handleSubmit}
                  />

                  <TouchableOpacity onPress={resetPass}>
                    <View style={styles.rect}>
                      <Text style={[styles.label, {fontWeight: 'bold'}]}>Lupa Password!</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.rect}>
                      <Text style={styles.label}>Belum Punya Akun!</Text>
                  </View>
                  <TouchableOpacity onPress={onRegistrasi}>
                    <View style={[styles.rect, {marginTop: 0}]}>
                      <Text style={[styles.label, {fontWeight: 'bold'}]}>Daftar Baru</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                :
                <View style={styles.inputBox}>
                  <View style={styles.fnohp}>
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
                  <TouchableOpacity
                    style={[styles.buttonKembali, styles.btnmasuk]}
                    onPress={() => setRelogin(false)}
                  >
                    <Text style={styles.kembali}>KEMBALI</Text>
                  </TouchableOpacity>
                </View>
              }

              <View>
                {showAlertBox()}
              </View>
            {/*</ScrollView>*/}
          </View>
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
    flex: 1
  },
  scrollArea_contentContainerStyle: {
    flex: 1
  },
  group1: {
    height: '20%'
  },
  header1: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItem: 'center',
  },
  logo1: {
    flex: 1,
    alignSelf: 'center',
    marginTop: '5%',
    width: '60%',
    height: 50
  },
  inputBox: {
    flex: 1,
    padding: '5%'
  },
  fnohp: {
    height: 66,
    marginTop: '20%'
  },
  shapenohp: {
    flex: 1,
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  nohp: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    width: '100%',
    fontSize: 20,
    marginLeft: 21
  },
  fsandi: {
    height: 66,
    marginTop: '2%',
  },
  shapepass: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    borderWidth: 3,
    borderColor: "#000000"
  },
  pass: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    width: '100%',
    fontSize: 20,
    marginLeft: 21
  },
  btnmasuk: {
    height: 65,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    marginTop: '4%'
  },
  rect: {
    height: 30,
    marginTop : '5%',
    width: '100%',
    alignItem: 'center'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    alignSelf: 'center'
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
  buttonKembali: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  kembali: {
    color: "rgba(0,0,0,1)",
    fontSize: 17
  }
});

export default Login;
