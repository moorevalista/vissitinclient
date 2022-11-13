import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { RefreshControl, StyleSheet, View, Text, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity } from "react-native";
import HeaderPasien from "../components/HeaderPasien";
import Footermenu from "../components/Footermenu";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorages from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

function Mainservices(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);

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
      setCurrentDataPasien();
    }
  },[dataLogin]);

  const setCurrentDataPasien = async () => {
    setLoading(false);
  }

  const openFaskesServices = async() => {
    props.navigation.navigate('layananFaskes', { base_url: props.route.params.base_url } );
  }

  const openHomeServices = async() => {
    props.navigation.navigate('homeServices', { base_url: props.route.params.base_url } );
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      <View style={styles.headerPasien}>
        <HeaderPasien dataLogin={dataLogin} />
      </View>
      <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
        <View style={styles.container}>
          <Text style={styles.layanan}>LAYANAN</Text>
          <View style={styles.scrollAreaStack}>
            <View style={[styles.scrollArea, styles.inner]}>
              <View style={styles.btnrow1Column}>
                <View style={styles.group}>
                  <TouchableOpacity
                    onPress={openFaskesServices}
                    style={styles.btnassesment}
                  >
                    <View style={styles.rect}>
                      <Text style={styles.assesment}>LAYANAN{"\n"}KLINIK/FASKES</Text>
                      <Text style={styles.text}>
                        Melayani kebutuhan reservasi jadwal layanan kesehatan di
                        Faskes/Klinik/Griya terdekat.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.group}>
                  <TouchableOpacity
                    onPress={openHomeServices}
                    style={styles.btnassesment}
                  >
                    <View style={styles.rect}>
                      <Text style={styles.assesment}>LAYANAN{"\n"}VISIT KE RUMAH</Text>
                      <Text style={styles.text}>
                        Pilih dan tentukan sendiri Tenaga Kesehatan{"\n"}dan Jenis
                        Layanan yang dibutuhkan.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
      <FlashMessage position="top" />
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
  btnrow1Column: {
    flex: 1,
    height: 'auto'
  },
  group: {
    height: 'auto',
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: '2%'
  },
  btnassesment: {
    height: 'auto',
    flex: 1,
    padding: '2%'
  },
  rect: {
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  assesment: {
    fontFamily: "roboto-regular",
    fontSize: 17,
    color: "#121212",
    fontWeight: "bold",
    textAlign: "center",
    padding: '2%'
  },
  text: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 14,
    textAlign: "center",
    padding: '2%'
  },
  footer: {
    height: '10%'
  },
  scrollAreaStack: {
    width: '100%',
    height: 'auto',
    flex: 1,
    padding: '2%'
  },
  layanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '4%'
  },
});

export default Mainservices;
