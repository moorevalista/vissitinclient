import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import RadioMetodePembayaran from "../components/RadioMetodePembayaran";
import Btnproses from "../components/Btnproses";
import Btnbatal from "../components/Btnbatal";
import Footermenu from "../components/Footermenu";
import Header from "../components/Header";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

function Konfirmasilayanankhusus(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [paramsData, setParamsData] = useState('');

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [jenisLayanan, setJenisLayanan] = useState(props.route.params.jenisLayanan);

  const [paymentMethod, setPaymentMethod] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
        //await setLoading(false);
      }
    }
  }

  useEffect(() => {
    getLoginData();
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);

  const setDataSource = async () => {
    await setParamsData(props.route.params.params);

    await setLoading(false);
  }

  function RenderNakes() {
    const nakes = paramsData[0].dataNakes;
    const item = paramsData[0].dataPaket;

    let total = 0;

    if(nakes) {
        total = (item.biaya_layanan - item.biaya_potongan);
        return (
          <View key={nakes.id_nakes}>
            <View style={styles.group}>
              <View style={styles.rect1Stack}>
                <View style={styles.group2}>
                  <View style={styles.rect2}>
                    <Text style={styles.namanakes1}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
                  </View>
                </View>
                <View style={styles.rect1}>
                  <View style={styles.content}>
                    <View style={styles.group3}>
                      <Text style={styles.layanan}>{jenisLayanan}</Text>
                      {/*<Text style={styles.jarak}>Jarak : {parseFloat(nakes.distance).toFixed(2)} km</Text>*/}
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>Biaya Layanan</Text>
                      <View style={styles.labelFiller} />
                      <Text style={styles.label2}>{formValidation.currencyFormat(item.biaya_layanan)}</Text>
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>Promo</Text>
                      <View style={styles.labelFiller} />
                      <Text style={styles.label2}>{formValidation.currencyFormat(item.biaya_potongan)}</Text>
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>Biaya Lainnya</Text>
                      <View style={styles.labelFiller} />
                      <Text style={styles.label2}>Rp. 0</Text>
                    </View>
                    <View style={styles.labelGroup}>
                      <Text style={styles.label}>TOTAL BIAYA</Text>
                      <View style={styles.labelFiller} />
                      <Text style={styles.label2}>{formValidation.currencyFormat(total.toString())}</Text>
                    </View>
                    <View style={styles.rect3}></View>
                      <Text style={styles.metodePembayaran}>Metode Pembayaran</Text>
                      <View style={styles.group4}>
                      <RadioMetodePembayaran
                        name="paymentMethod"
                        style={styles.radio}
                        value="tunai"
                        onSelectPaymentMethod={onSelectPaymentMethod}
                        paymentMethod={paymentMethod}
                      />
                      <Text style={styles.metode}>Tunai/Cash</Text>
                    </View>
                    {/*<View style={styles.group4}>
                      <RadioMetodePembayaran
                        name="paymentMethod"
                        style={styles.radio}
                        value="va"
                        onSelectPaymentMethod={onSelectPaymentMethod}
                        paymentMethod={paymentMethod}
                      />
                      <Text style={styles.metode}>Transfer Virtual Account</Text>
                    </View>*/}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.group6}>
              <Btnproses style={styles.btnproses} onProses={onProses} />
            </View>
          </View>
        )
    }else {
      return (
        <></>
      )
    }
  }

  function onSelectPaymentMethod(e) {
    setPaymentMethod(e);
  }

  function onProses() {
    paymentMethod !== '' ?
      props.navigation.navigate('pembayaranKhususScreen', { base_url: props.route.params.base_url, params: paramsData, paymentMethod: paymentMethod, id_profesi: id_profesi, jenisLayanan: jenisLayanan })
      :
      formValidation.showError('Anda belum memilih metode pembayaran...');
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Spinner
                    visible={loadingSave}
                    textContent={''}
                    textStyle={styles.spinnerTextStyle}
                    color="#236CFF"
                    overlayColor="rgba(255, 255, 255, 0.5)"
                  />
              <Header style={styles.header} props={props} />
              <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                      <View>
                        <Text style={styles.konfirmasiBiaya}>KONFIRMASI{"\n"}BIAYA</Text>
                        <RenderNakes />
                      </View>
                  </View>
                </View>
              </ScrollView>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
    </View>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '25%'
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  header: {
    height: 75
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
    padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  konfirmasiBiaya: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center"
  },
  group: {
    flex: 1,
    marginTop: '4%'
  },
  rect1Stack: {
    flex: 1
  },
  group2: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  rect2: {
    flex: 0.8,
    padding: '2%',
    alignSelf: 'center',
    backgroundColor: "rgba(80,227,194,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 100
  },
  namanakes1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    textAlign: "center"
  },
  rect1: {
    zIndex: -1,
    flex: 1,
    marginTop: -15,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  content: {
    padding: '4%',
    marginTop: '5%'
  },
  group3: {
    marginBottom: '5%'
  },
  layanan: {
    fontFamily: "roboto-regular",
    fontWeight: 'bold',
    color: "#121212",
    textAlign: "center",
    fontSize: 18,
    marginTop: '1%'
  },
  jarak: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    marginTop: '2%'
  },
  labelGroup: {
    flexDirection: "row",
    paddingLeft: '5%',
    paddingRight: '5%',
    marginBottom: '1%'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  labelFiller: {
    flex: 1,
    flexDirection: "row"
  },
  rect3: {
    height: 2,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  metodePembayaran: {
    fontWeight: 'bold',
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    marginTop: '5%',
  },
  group4: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '5%'
  },
  radio: {
    flex: 0.1
  },
  metode: {
    flex: 0.9,
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: 'center'
  },
  group6: {
  },
  btnproses: {
    flex: 1,
    padding: '2%',
    marginTop: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)"
  },
  footer: {
    height: '10%'
  }
});

export default Konfirmasilayanankhusus;
