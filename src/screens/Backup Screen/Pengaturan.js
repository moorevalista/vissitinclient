import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import HeaderPasien from "../components/HeaderPasien";
import Btnlengkapprofile from "../components/Btnlengkapprofile";
import Btngantipass from "../components/Btngantipass";
import Logout from "../components/Logout";
import Footermenu from "../components/Footermenu";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import { CommonActions } from '@react-navigation/native';

function Pengaturan(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);


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

  const openProfile = async() => {
    //alert(currentScreen);
    props.navigation.navigate('profileScreen', { base_url: props.route.params.base_url, updateData: false } );
  }

  const openChangePass = async() => {
    //alert(currentScreen);
    props.navigation.navigate('changepassScreen', { base_url: props.route.params.base_url } );
  }

  const logout = async() => {
    setLoadingFetch(true);
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_pasien: dataLogin.id_pasien, token: dataLogin.token });

    success = await formValidation.logout(params);
    //console.log(JSON.stringify(success));
    if(success.status === true) {
      await AsyncStorage.clear();
      try {
        const value = await AsyncStorage.getItem('loginStatePasien')
        if(!value) {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'loginScreen',
                }
              ],
            })
          )
        }
      } catch(e) {
        alert(e);
      }
    }
  }

  return (
    !loading ?
    <>
      <View style={styles.headerPasien}>
        <HeaderPasien dataLogin={dataLogin} />
      </View>
      <Spinner
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#236CFF"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
      <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
          >
        <View style={styles.container}>
          <Text style={styles.setting}>PENGATURAN</Text>
          <View style={styles.scrollArea}>
            <View style={styles.box}>
              <Btnlengkapprofile style={styles.button} openProfile={openProfile} />
            </View>
            <View style={styles.box}>
              <Btngantipass style={styles.button} openChangePass={openChangePass} />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Hubungi Customer Service</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Kontak Whatsapp</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Syarat dan Ketentuan Layanan</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Tentang Vissit.in</Text>
            </View>
            <View style={styles.box}>
              <Logout style={styles.button} logout={logout} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
    </>
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
    paddingBottom: '5%'
  },
  headerPasien: {
    height: '20%'
  },
  scrollArea: {
    flex: 1,
    height: 'auto',
    padding: 10
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  setting: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '4%'
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '4%'
  },
  button: {
    flex: 0.8,
    height: 50,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)"
  },
  label: {
    flex: 0.8,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 17,
    textAlign: "center"
  },
  footer: {
    height: '10%'
  }
});

export default Pengaturan;
