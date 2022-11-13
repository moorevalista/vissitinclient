import React, { Component, useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Btnreset from "../components/Btnreset";

import { form_validation } from "../form_validation";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

function Lupapass1(props) {
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
        <Icon {...props} type="font-awesome-5" style={styles.icon} name={secureTextEntry ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //render icon show/hide confirm password
  const RenderIcon1 = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry1}>
        <Icon {...props} type="font-awesome-5" style={styles.icon} name={secureTextEntry1 ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    if(e.password !== '') {
      setstyleBoxPassword(styles.shapepass);
    }else {
      setstyleBoxPassword(styles.shapepass);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(styles.shapepass);
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
          setErrorMsg(errorMsg);
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

  return (
    <View style={styles.container}>
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
      <View style={styles.inputBox}>
        <View style={styles.pass}>
          <View style={styleBoxPassword}>
            <TextInput
              placeholder="Password Baru"
              secureTextEntry={true}
              style={styles.passnew}
              numberOfLines={1}
              minLength={8}
              maxLength={15}
              value={password}
              onChangeText={setPassword}
              onEndEditing={e => handleValidSubmit(e, 'password')}
              secureTextEntry={secureTextEntry}
              ref={refPassword}
            ></TextInput>
            <View style={styles.passIcon}><RenderIcon /></View>
          </View>
        </View>
      
        <View style={styles.pass}>
          <View style={styleBoxCpassword}>
            <TextInput
              placeholder="Ulangi Password Baru"
              secureTextEntry={true}
              style={styles.passnew}
              numberOfLines={1}
              minLength={8}
              maxLength={15}
              value={cpassword}
              onChangeText={setCpassword}
              onEndEditing={e => handleValidSubmit(e, 'cpassword')}
              secureTextEntry={secureTextEntry1}
              ref={refCpassword}
            ></TextInput>
            <View style={styles.passIcon}><RenderIcon1 /></View>
          </View>
        </View>

        <Btnreset style={styles.btnkirim} handleSubmit={handleSubmit} label="RESET" />
      </View>
    </View>
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
    padding: '5%',
    marginTop: '20%'
  },
  pass: {
    height: 66,
    marginTop: '2%'
  },
  shapepass: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  shapepassError: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "red"
  },
  passnew: {
    flex: 0.85,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 21
  },
  btnkirim: {
    height: 65,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    marginTop: '4%'
  },
  passIcon: {
    flex: 0.15,
    alignSelf: 'center'
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    padding: '5%'
  },
});

export default Lupapass1;
