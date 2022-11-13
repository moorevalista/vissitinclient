import React, { Component, useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, View, TextInput, Image, SafeAreaView, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import Btnreset from "../components/Btnreset";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Icon } from 'react-native-elements';
import { showMessage, hideMessage } from 'react-native-flash-message';
import axios from "axios";

function Gantipass(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [valid_old_pass, setValid_old_pass] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cPassword, setCPassword] = useState('');

  let refOldPassword = useRef(null);
  let refNewPassword = useRef(null);
  let refCPassword = useRef(null);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);

  const [styleOldPassword, setStyleOldPassword] = useState(styles.inputShape);
  const [styleNewPassword, setStyleNewPassword] = useState(styles.inputShape);
  const [styleCPassword, setStyleCPassword] = useState(styles.inputShape);

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
        await setLoading(false);
      }
    }
  }

  useEffect(() => {
    getLoginData();
  },[]);

  //show/hide password
  const toogleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  //show/hide confirm password
  const toogleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
  }

  //show/hide confirm password
  const toogleSecureEntry2 = () => {
    setSecureTextEntry2(!secureTextEntry2);
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

  //render icon show/hide confirm password
  const RenderIcon2 = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry2}>
        <Icon {...props} type="font-awesome-5" style={styles.icon2} name={secureTextEntry2 ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //check old password
  const checkCurrentPassword = async (e) => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_pasien: dataLogin.id_pasien, old_pass: e.nativeEvent.text });
    success = await formValidation.checkCurrentPassword(params);

    //alert(JSON.stringify(success)); return;
    if(success.status === false) {
      await setValid_old_pass(false);
      await setStyleOldPassword(styles.inputShapeError);
      await setOldPassword('');
      await formValidation.showError(success.msg);
      await refOldPassword.current.focus();
    }else {
      await setValid_old_pass(true);
      await setStyleOldPassword(styles.inputShape);
    }
    //console.log(seconds);
  }

  const matchPassword = (e) => {
    let password = newPassword;
    let confirmPassword = cPassword;
    let errorMsg = {};

    //const valid_old_pass = this.state.valid_old_pass;

    if(password !== '') {
      //let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(password.length < 8){
        errorMsg = '*Kata sandi tidak valid';
        refNewPassword.current.focus();
        formValidation.showError(errorMsg);
        setNewPassword('');
      }else {
        if(!password.match(passPattern)) {
          errorMsg = '*Kata sandi tidak valid';
          refNewPassword.current.focus();
          formValidation.showError(errorMsg);
          setNewPassword('');
        }
      }
    }else {
      if(valid_old_pass) {
        errorMsg = '*Kata sandi tidak boleh kosong';
        //showError(errorMsg);
      }
    }

    if(password !== '' && confirmPassword !== '') {
      if(confirmPassword !== password) {
        errorMsg = '*Kata sandi tidak sama';
        refCPassword.current.focus();
        formValidation.showError(errorMsg);
        setCPassword('');
      }
    }
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    if(e.password !== '') {
      setStyleNewPassword(styles.inputShapeError);
    }else {
      setStyleNewPassword(styles.inputShape);
    }
    if(e.cpassword !== '') {
      setStyleCPassword(styles.inputShapeError);
    }else {
      setStyleCPassword(styles.inputShape);
    }
  }

  const handleSubmit = async () => {
    let paramsData = [];
    paramsData.push({
      password: newPassword,
      cpassword: cPassword
    });

    val = formValidation.handlePreSubmitUpdatePassword(paramsData);
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
      formData.append("password", newPassword);
      formData.append("token", dataLogin.token);

      axios
      .post(props.route.params.base_url + "pasien/updatePassword/" + dataLogin.id_pasien, formData)
      .then(() => {
        setLoading(false);
        formValidation.showError('Kata sandi berhasil diperbarui...');
        backToSetting();
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

  const backToSetting = async() => {
    props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'settingScreen',
                  params: { base_url: props.route.params.base_url },
                }
              ],
            })
          )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, styles.inner]}>
          <Spinner
                    visible={loading}
                    textContent={''}
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
          <View style={styles.inputBox}>
            <View style={styles.inputStack}>
              <View style={styleOldPassword}>
                <TextInput
                  placeholder="Password Lama"
                  style={styles.inputText}
                  numberOfLines={1}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  onEndEditing={e => checkCurrentPassword(e)}
                  secureTextEntry={secureTextEntry}
                  ref={refOldPassword}
                />
                <RenderIcon />
              </View>
            </View>

            <View style={styles.inputStack}>
              <View style={styleNewPassword}>
                <TextInput
                  placeholder="Password Baru"
                  style={styles.inputText}
                  numberOfLines={1}
                  minLength={8}
                  maxLength={15}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onEndEditing={e => matchPassword(e)}
                  secureTextEntry={secureTextEntry1}
                  ref={refNewPassword}
                />
                <RenderIcon1 />
              </View>
            </View>

            <View style={styles.inputStack}>
              <View style={styleCPassword}>
                <TextInput
                  placeholder="Ulangi Password"
                  style={styles.inputText}
                  numberOfLines={1}
                  minLength={8}
                  maxLength={15}
                  value={cPassword}
                  onChangeText={setCPassword}
                  onEndEditing={e => matchPassword(e)}
                  secureTextEntry={secureTextEntry2}
                  ref={refCPassword}
                />
                <RenderIcon2 />
              </View>
            </View>

            <Btnreset style={styles.cupertinoButtonLight} handleSubmit={handleSubmit} />
            
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(80,227,194,1)"
  },
  containerKey: {
    flex: 1
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around",
  },
  spinnerTextStyle: {
    color: '#FFF'
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
    padding: '5%',
    paddingTop: '20%'
  },
  inputStack: {
    height: 66,
    marginTop: '2%'
  },
  inputShape: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  inputShapeError: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "#FFA07C",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  inputText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    fontSize: 20,
    marginLeft: '2%',
    marginRight: '1%'
  },
  icon2: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginRight: '5%'
  },
  cupertinoButtonLight: {
    height: 65,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    marginTop: '4%'
  }
});

export default Gantipass;
