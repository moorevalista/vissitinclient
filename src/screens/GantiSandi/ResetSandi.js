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
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

export default function ResetSandi(props) {
  const formValidation = useContext(form_validation);
  const base_url = formValidation.base_url;
  const [loading, setLoading] = useState(false);

  //alert(props.route.params.id);
  const id_pasien = props.route.params.id;
  const token = props.route.params.token;

  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const refPassword = useRef(null);
  const refCpassword = useRef(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);

  const [styleBoxPassword, setstyleBoxPassword] = useState(styles.shapepass);
  const [styleBoxCpassword, setstyleBoxCpassword] = useState(styles.shapepass);

  //show/hide password
  const toogleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  //show/hide confirm password
  const toogleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
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
    if(e.password !== '') {
      setstyleBoxPassword(styles.shapepassError);
    }else {
      setstyleBoxPassword(styles.shapepass);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(styles.shapepassError);
    }else {
      setstyleBoxCpassword(styles.shapepass);
    }
  }

  //handle input validation sebelum disubmit
  const handleValidSubmit = async(e, name) => {
    let fieldName = name;
    let errorMsg = {};

    switch(fieldName) {
      case 'password':
        if(password !== '') {
          let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
          if(password.length < 8) {
            errorMsg = '*Password minimal 8 digit';
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(styles.shapepassError);
          }else if(!password.match(pattern)) {
            errorMsg = '*Password harus mengandung kombinasi huruf besar, kecil dan angka';
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(styles.shapepassError);
          }else {
            errorMsg = '';
            setstyleBoxPassword(styles.shapepass);
          }
        }else {
          errorMsg = '';
          //setErrorMsg(errorMsg);
          setstyleBoxPassword(styles.shapepass);
        }
        break;
      case 'cpassword':
        if(cpassword !== '' && password !== '') {
          if(cpassword !== password) {
            errorMsg = '*Password tidak sama';
            formValidation.showError(errorMsg);
            refCpassword.current.focus();
            setstyleBoxCpassword(styles.shapepassError);
          }else {
            errorMsg = '';
            setstyleBoxCpassword(styles.shapepass);
          }
        }
        break;
    }

    //console.log(e.nativeEvent.text);
  }

  const handleSubmit = async () => {
    let params = [];
    params.push({
      base_url: base_url,
      en_id_pasien: id_pasien,
      password: password,
      cpassword: cpassword,
      token: token
    });

    val = formValidation.handlePreSubmitResetPassword(params);
    if(val.status === false) {
      setStyleError(val);
      if(val.password !== '') {
        formValidation.showError(val.password);
        refPassword.current.focus();
      }else if(val.cpassword !== '') {
        formValidation.showError(val.cpassword);
        refCpassword.current.focus();
      }
    }else if(val.status ===  true) {
      setLoading(true);
      success = await formValidation.resetPassword(params);
      setLoading(false);
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          formValidation.showError(success.res.messages);
        }else {
          formValidation.showError(success.res.messages);
          props.navigation.navigate('loginScreen', { base_url: base_url });
        }
      }else {
        formValidation.showError('Tautan sudah kadaluarsa, silahkan ajukan reset password kembali...');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'loginScreen',
                params: { base_url: base_url },
              },
              {
                name: 'lupaPass',
                params: { base_url: base_url },
              }
            ],
          })
        )
      }
    }
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

          <Text style={styles.Txt841}>Input kata sandi baru</Text>
          <View style={styleBoxPassword}>
            <TextInput
              style={styles.TxtInputPass}
              placeholder="Sandi baru"
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

          <Text style={styles.Txt841}>Ulangi kata sandi baru</Text>
          <View style={styleBoxCpassword}>
            <TextInput
              style={styles.TxtInputPass}
              placeholder="Sandi baru"
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

  shapepass: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
  },
  shapepassError: {
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
