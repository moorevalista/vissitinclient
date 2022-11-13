import React, { Component, useEffect, useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image, SafeAreaView, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Icon } from 'react-native-elements';
import { showMessage, hideMessage } from 'react-native-flash-message';
import axios from "axios";

export default function GantiSandi(props) {
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

  const [styleOldPassword, setStyleOldPassword] = useState(styles.Input_pass);
  const [styleNewPassword, setStyleNewPassword] = useState(styles.Input_pass);
  const [styleCPassword, setStyleCPassword] = useState(styles.Input_pass);

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
    params.push({ base_url: formValidation.base_url, id_pasien: dataLogin.id_pasien, old_pass: e.nativeEvent.text });
    success = await formValidation.checkCurrentPassword(params);

    if(success.status === false) {
      await setValid_old_pass(false);
      await setStyleOldPassword(styles.Input_pass_error);
      await setOldPassword('');
      await formValidation.showError(success.msg);
      await refOldPassword.current.focus();
    }else {
      await setValid_old_pass(true);
      await setStyleOldPassword(styles.Input_pass);
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
      setStyleNewPassword(styles.Input_pass_error);
    }else {
      setStyleNewPassword(styles.Input_pass);
    }
    if(e.cpassword !== '') {
      setStyleCPassword(styles.Input_pass_error);
    }else {
      setStyleCPassword(styles.Input_pass);
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
      .post(formValidation.base_url + "pasien/updatePassword/" + dataLogin.id_pasien, formData)
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
                  params: { base_url: formValidation.base_url },
                }
              ],
            })
          )
  }

  const dataTips = [
    {
      nomer: 1,
      isi: 'Usahakan password memiliki minimal 8 digit kombinasi huruf, angka, & simbol (contoh : Pa$w0rDs4y@).',
    },
    {
      nomer: 2,
      isi: 'Hindari menggunakan tanggal lahir, no.telp, dan atau yang berisi identitas pribadi.',
    },
    {
      nomer: 3,
      isi: 'Ganti password secara berkala jika diperlukan.',
    },
  ];
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <SafeAreaView style={styles.Ganti_password}>
        <View style={styles.Group7109}>
          <Spinner
                    visible={loading}
                    textContent={''}
                  />

          <Text style={styles.Txt841}>Input kata sandi sebelumnya</Text>
          <View style={styleOldPassword}>
            <TextInput
              style={styles.TxtInputPass}
              placeholder="Sandi sebelumnya"
              numberOfLines={1}
              value={oldPassword}
              onChangeText={setOldPassword}
              onEndEditing={e => checkCurrentPassword(e)}
              secureTextEntry={secureTextEntry}
              ref={refOldPassword}
            />
            <RenderIcon />
          </View>

          <Text style={styles.Txt841}>Input kata sandi baru</Text>
          <View style={styleNewPassword}>
            <TextInput
              style={styles.TxtInputPass}
              placeholder="Sandi baru"
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

          <Text style={styles.Txt841}>Ulangi kata sandi baru</Text>
          <View style={styleCPassword}>
            <TextInput
              style={styles.TxtInputPass}
              placeholder="Sandi baru"
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
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.Btn_lanjut}>
              <Text style={styles.Txt365}>SIMPAN</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.Tips_pass}>
            <Text style={styles.Txt047}>Tips keamanan kata sandi / password</Text>
            {dataTips.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                  }}>
                  <Text>{item.nomer}</Text>
                  <Text style={styles.Txt452}>{item.isi}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerKey: {
    flex: 1
  },

  Ganti_password: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  Group7109: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    paddingHorizontal: 25,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Pass_lama: {
    flexDirection: 'column',
    paddingBottom: 15,
  },
  Txt841: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    paddingBottom: 5,
  },

  Form_pass_lama: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
  },

  Form_pass_error: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'red',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt365: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Tips_pass: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  Txt047: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    marginBottom: 9,
  },
  Txt452: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(79,92,99,1)',
    textAlign: 'justify',
    paddingLeft: 10,
  },

  Input_pass: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
  },
  Input_pass_error: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'red',
  },
  TxtInputPass: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: 'rgba(0,32,51,1)',
    textAlign: 'left'
  },
  icon2: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginRight: '5%'
  },
});
