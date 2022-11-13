import React, { Component, useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, TextInput, Image, Text } from "react-native";
import Btnreset from "../components/Btnreset";

import { form_validation } from "../form_validation";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

function Lupapass(props) {
  const formValidation = useContext(form_validation);
  const [loading, setLoading] = useState(false);

  const [nohp, setNohp] = useState('');
  const refHp = useRef(null);

  //validasi no hp
  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  const handleSubmit = async () => {
    if(nohp === '') {
      formValidation.showError('Masukkan nomor Handphone...');
      refHp.current.focus();
    }else if(nohp.length < 10) {
      formValidation.showError('Nomor Handphone tidak valid...');
      refHp.current.focus();
    }else {
      setLoading(true);
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        hp: nohp
      });

      success = await formValidation.forgotPassword(params);
      setLoading(false);
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          formValidation.showError(success.res.data.messages);
        }else {
          await formValidation.showError('Password berhasil dipulihkan. Silahkan cek tautan yang dikirim ke nomor handphone anda');
          props.navigation.goBack();
        }
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
        <Text style={styles.resetPassword}>Reset Password</Text>
        <View style={styles.fnohp}>
          <View style={styles.shapenohp1}>
            <TextInput
              placeholder="No. Handphone"
              style={styles.nohp1}
              keyboardType="phone-pad"
              numberOfLines={1}
              value={nohp}
              onChangeText={onChangeHp}
              dataDetector="phoneNumber"
              maxLength={15}
              ref={refHp}
            />
          </View>
        </View>
        <Btnreset style={styles.cupertinoButtonLight} label="RESET" handleSubmit={handleSubmit} />
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
    padding: '5%'
  },
  resetPassword: {
    backgroundColor: "transparent",
    color: "rgba(0,0,0,1)",
    fontSize: 24,
    marginTop: '20%'
  },
  fnohp: {
    height: 66,
    marginTop: '2%'
  },
  shapenohp1: {
    flex: 1,
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  },
  nohp1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    width: '100%',
    fontSize: 20,
    marginLeft: 21
  },
  cupertinoButtonLight: {
    height: 65,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000",
    marginTop: '4%'
  },
  
});

export default Lupapass;
