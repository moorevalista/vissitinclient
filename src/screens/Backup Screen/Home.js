import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { RefreshControl, StyleSheet, View, Text, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity } from "react-native";
import HeaderPasien from "../components/HeaderPasien";
import Barcari from "../components/Barcari";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Footermenu from "../components/Footermenu";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import { CommonActions } from '@react-navigation/native';
import axios from "axios";

function Home(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  //const [loadingFetch, setLoadingFetch] = useState(true);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await checkFcmToken();

    if(success) {
      setRefreshing(false);
    }else {
      setRefreshing(true);
    }
    //wait(2000).then(() => setRefreshing(false));
  },[]);

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
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataPasien();
    }

    return () => {
      setLoading(false);
    }
  },[dataLogin]);

  const checkFcmToken = async () => {
    const token = await AsyncStorage.getItem('token');
        if(token !== null) {
          let params = [];
          params.push({
            base_url: props.route.params.base_url,
            token: token
          });

          success = await formValidation.checkToken(params);
          console.log(success);

          if(success.status === true) {
            if(success.res.responseCode !== '000') {
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
                          params: { base_url: props.route.params.base_url },
                        }
                      ],
                    })
                  )
                  return true;
                }else {
                  return false;
                }
              } catch(e) {
                alert(e);
              }
            }else {
              return true;
            }
          }else {
            return false;
          }
        }
  }

  const setCurrentDataPasien = async () => {
    //setLoadingFetch(true);
    //await getJadwal();
    setLoading(false);
  }

  const openMainServices = async() => {
    setLoading(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
    });

    success = await formValidation.getDataPasien(params);

    if(success.status === true) {
      setLoading(false);
      if(success.res.lat === '' || success.res.lon === '') {
        await formValidation.showError('Anda harus melengkapi informasi pribadi sebelum bisa melakukan reservasi.')
        props.navigation.navigate('profileScreen', { base_url: props.route.params.base_url, updateData: true } );
      }else {
        props.navigation.navigate('mainServices', { base_url: props.route.params.base_url } );
      }
    }else {
      setLoading(false);
      formValidation.showError('Terjadi kesalahan...');
    }
  }

  const openAssessment = async() => {
    formValidation.showError('Layanan belum tersedia...');
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
          {/*<Barcari style={styles.barcari} />*/}
          <View style={styles.scrollAreaStack}>
            <View style={[styles.scrollArea, styles.inner]}>
              <View style={styles.btnrow1Column}>
                <View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openAssessment}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <SimpleLineIconsIcon
                          name="puzzle"
                          style={styles.icon}
                        />
                        <Text style={styles.assesment}>ASSESMENT</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openMainServices}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <SimpleLineIconsIcon
                          name="support"
                          style={styles.icon}
                        />
                        <Text style={styles.assesment}>TERAPI</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openAssessment}>
                      <View style={styles.rect}>
                        <View style={styles.group2}>
                          <SimpleLineIconsIcon
                            name="book-open"
                            style={styles.icon}
                          />
                          <Text style={styles.assesment}>SPECIAL TUTOR</Text>
                        </View>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openAssessment}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <SimpleLineIconsIcon
                          name="people"
                          style={styles.icon}
                        />
                        <Text style={styles.assesment}>KONSULTASI</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.group}>
                  <TouchableOpacity style={styles.btnassesment} onPress={openAssessment}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <SimpleLineIconsIcon
                          name="globe"
                          style={styles.icon}
                        ></SimpleLineIconsIcon>
                        <Text style={styles.assesment}>BERITA</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnassesment} onPress={openAssessment}>
                    <View style={styles.rect}>
                      <View style={styles.group2}>
                        <SimpleLineIconsIcon
                          name="info"
                          style={styles.icon}
                        />
                        <Text style={styles.assesment}>DARURAT</Text>
                      </View>
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
  layanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '5%'
  },
  barcari: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: '4%',
    marginBottom: '4%',
    paddingLeft: '4%',
    paddingRight: '4%'
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
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  group2: {
    height: 'auto'
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 40,
    alignSelf: "center"
  },
  assesment: {
    fontFamily: "roboto-regular",
    color: "#121212",
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
  }
});

export default Home;
