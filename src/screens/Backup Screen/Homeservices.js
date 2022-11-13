import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { RefreshControl, StyleSheet, View, Text, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity } from "react-native";
import Header from "../components/Header";
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

function Homeservices(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  //const [loadingFetch, setLoadingFetch] = useState(true);

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
    //setLoadingFetch(true);
    //await getJadwal();
    setLoading(false);
  }

  const openFisioterapi = async() => {
    props.navigation.navigate('rootService', { base_url: props.route.params.base_url, id_profesi: 1, jenisLayanan: 'FISIOTERAPI' } );
  }

  const openOkupasiterapi = async() => {
    props.navigation.navigate('rootService', { base_url: props.route.params.base_url, id_profesi: 2, jenisLayanan: 'OKUPASI TERAPI' } );
  }

  const openTerapiwicara = async() => {
    props.navigation.navigate('rootService', { base_url: props.route.params.base_url, id_profesi: 3, jenisLayanan: 'TERAPI WICARA' } );
  }

  const openService = async() => {
    formValidation.showError('Layanan belum tersedia...');
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      <Header style={styles.header} props={props} title={"Layanan"} />
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
          <Text style={styles.layanan}>PILIH{"\n"}LAYANAN</Text>
          <View style={styles.scrollAreaStack}>
            <View style={[styles.scrollArea, styles.inner]}>
              <View style={styles.btnrow1Column}>
                <View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openFisioterapi}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>FISIOTERAPI</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openOkupasiterapi}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>OKUPASI{"\n"}TERAPI</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openTerapiwicara}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>TERAPI{"\n"}WICARA</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openService}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>PSIKOLOG</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {/*<View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openService}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>PERAWAT</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openService}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <Text style={styles.assesment}>CARE GIVER</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>*/}

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
    flex: 0.5,
    padding: '2%'
  },
  rect: {
    height: 80,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  group2: {
    flex: 1,
    alignItem: 'center',
    flexDirection: 'row'
  },
  assesment: {
    flex: 1,
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    padding: '5%'
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

export default Homeservices;
