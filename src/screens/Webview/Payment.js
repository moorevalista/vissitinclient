import React, { useState, useEffect, useContext } from 'react';
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
} from 'react-native';
import { WebView } from 'react-native-webview';
import { form_validation } from "../../form_validation";

export default function Payment(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [url, setUrl] = useState('');
  const [trxId, setTrxId] = useState('');

  useEffect(() => {
    setUrl(props.route.params.url);
    setDataLogin(props.route.params.dataLogin);
  }, []);

  useEffect(() => {
    if(trxId !== '' && props.route.params.newPayment === true) {
      saveTrxId();
    }
  }, [trxId]);

  const saveTrxId = async () => {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_jadwal: props.route.params.id_jadwal,
      trxId: trxId,
      token: dataLogin.token
    });

    // console.log(params);

    success = await formValidation.saveTrxIdFlip(params);
    // console.log(success);

    if(success.status ===  true) {
      if(success.res.responseCode !== '000') {
        await formValidation.showError('Terjadi kesalahan bro...');
      }else {
        
      }
    }
  }

  const onNavigationStateChange = (webViewState) => {
    var regexp = /[?&]([^=#]+)=([^&#]*)/g,params = {},check;
    while (check = regexp.exec(webViewState.url)) {
      params[check[1]] = check[2];
    }
    // console.log("params",params.id);
    if(params.id !== undefined) {
      setTrxId(params.id);
    }

    setUrl(webViewState.url); //production

    // if(webViewState.url.substring(0, 16) === 'https://flip.id/') { //sandbox endpoint
    //   setUrl(webViewState.url.replace('https://flip.id/', formValidation.flipPaymentUrl));
    // }
  }

  return (
    <View style={styles.OtpLogin}>
      <View style={styles.Group089}>
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  OtpLogin: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Group089: {
    flex: 1,
    justifyContent: 'space-between',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  multiple1: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    paddingBottom: 10,
    marginHorizontal: 40,
    paddingTop: 60,
  },
  daftarAkun: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    fontWeight: 'bold',
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

  Txt4105: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Icon: {
    height: 200,
  },
});
