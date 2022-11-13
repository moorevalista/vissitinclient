import React, { Component, useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native';

import { form_validation } from "../../form_validation";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

export default function LupaSandi(props) {
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
          //props.navigation.goBack();
          //props.navigation.navigate('alertEmail');

          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'loginScreen',
                  params: { base_url: props.route.params.base_url },
                },
                {
                  name: 'alertEmail',
                  params: {
                    base_url: props.route.params.base_url,
                    msg: success.res.messages
                  }
                }
              ],
            })
          );
        }
      }
    }
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, styles.inner]}>
          <View style={styles.scrollArea}>
            <Spinner
              visible={loading}
              textContent={''}
              textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.OtpLogin} onLayout={event => setLayout(event.nativeEvent.layout)}>
              <View style={styles.Group459(layout)}>
                <View style={styles.Group089(layout)}>
                  {/*<View style={styles.Form_pass_lama}>*/}
                    <TextInput
                      placeholder="*Nomor WhatsApp Aktif"
                      //keyboardType="email-address"
                      style={styles.Txt851}
                      keyboardType="phone-pad"
                      numberOfLines={1}
                      value={nohp}
                      onChangeText={onChangeHp}
                      dataDetector="phoneNumber"
                      maxLength={15}
                      ref={refHp}
                    />
                  {/*</View>*/}
                </View>
                <View style={styles.wrepperLink}>
                  <Text style={styles.multiple1}>
                    <Text style={{color: 'rgba(36,195,142,1)'}}>Link Reset Sandi </Text>{' '}
                    akan dikirimkan pada WhatsApp anda, pastikan nomor yang anda masukkan
                    benar dan terdaftar.
                  </Text>
                  <TouchableOpacity
                    onPress={handleSubmit}>
                    <View style={styles.Btn_lanjut}>
                      <Text style={styles.Txt4105}>PULIHKAN SANDI</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
    paddingTop: '10%',
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    marginHorizontal: '5%',
    width: layout.width,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }),

  Form_pass_lama: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Txt851: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    width: '70%',
    height: Platform.OS === "ios" ? 40 : 40,
  },

  multiple1: {
    textAlign: 'center',
    color: 'white',
    paddingBottom: 25,
    marginHorizontal: 20,
  },
  wrepperLink: {
    flex: 0.6,
    paddingVertical: '5%',
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
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
});
