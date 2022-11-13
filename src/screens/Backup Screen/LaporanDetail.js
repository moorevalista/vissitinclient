import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, Image,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Linking
} from "react-native";
import Laporanheader from "../components/Laporanheader";
import Icon from "react-native-vector-icons/Entypo";
import Footermenu from "../components/Footermenu";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';

function LaporanDetail(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [detailLaporan, setDetailLaporan] = useState([]);
  const [thumbImage, setThumbImage] = useState('');

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

    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  useEffect(() => {
    getLoginData();

    return () => {
      setLoading(false);
    }
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  const setDataSource = async () => {
    await setDetailLaporan(props.route.params.detailLaporan);

    await setLoading(false);
  }

  function openDoc(e) {
    Linking.canOpenURL(e).then(supported => {
      if (supported) {
        Linking.openURL(e);
      } else {
        console.log("Don't know how to open URI: " + e);
      }
    });
  };

  function openFoto(e) {
    Linking.canOpenURL(e).then(supported => {
      if (supported) {
        Linking.openURL(e);
      } else {
        console.log("Don't know how to open URI: " + e);
      }
    });
  };

  function RenderDetailLaporan() {
    const item = detailLaporan[0];

    if(item) {
      let filename_dokumen = '';
      let thumbFoto = '';

      if(item.dokumen_vissit !== '' && item.dokumen_visit !== null) {
        filename_dokumen = props.route.params.base_url + 'data_assets/dokumen_visit/' + item.dokumen_visit;
      }
      if(item.foto_visit !== '' && item.foto_visit !== null) {
        thumbFoto = props.route.params.base_url + 'data_assets/foto_visit/' + item.foto_visit;
      }
      return (
        <>
          <View style={[styles.labelRow, {marginTop: '5%'}]}>
            <Text style={styles.label}>Nama Nakes</Text>
            <Text style={styles.label2}>{item.nakes}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '5%'}]}>
            <Text style={styles.label}>Nama Pasien</Text>
            <Text style={styles.label2}>{item.service_user === 'self' ? item.client : item.nama_kerabat}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={styles.label}>Tanggal Visit</Text>
            <Text style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
          </View>
          <Text style={[styles.labelRow, {marginTop: '3%', color: 'rgba(208,2,27,1)'}]}>HASIL PEMERIKSAAN</Text>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Keluhan Utama</Text>
            <Text style={styles.label2}>{item.keluhan_utama}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Pemeriksaan Umum</Text>
            <Text style={styles.label2}>{item.pemeriksaan_umum}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Pemeriksaan Khusus</Text>
            <Text style={styles.label2}>{item.pemeriksaan_khusus}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Pemeriksaan Penunjang</Text>
            <Text style={styles.label2}>{item.pemeriksaan_penunjang}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Diagnosa Tenaga Kesehatan</Text>
            <Text style={styles.label2}>{item.diagnosa_nakes}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Target dan Potensi</Text>
            <Text style={styles.label2}>{item.target_potensi}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Tindakan Intervensi</Text>
            <Text style={styles.label2}>{item.intervensi}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Home Program</Text>
            <Text style={styles.label2}>{item.home_program}</Text>
          </View>
          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Catatan Khusus</Text>
            <Text style={styles.label2}>{item.catatan_tambahan}</Text>
          </View>

          <View style={[styles.labelRow, {marginTop: '3%'}]}>
            <Text style={[styles.label, {color: 'rgba(208,2,27,1)'}]}>Dokumen Tambahan</Text>
            <Text style={[styles.image2, {marginBottom: '2%'}]}>Foto Pendukung Laporan</Text>
            {thumbFoto ?
              <TouchableOpacity style={styles.btn1} onPress={() => openFoto(thumbFoto)}>
                <Image
                  source={{uri: thumbFoto}}
                  resizeMode="contain"
                  style={styles.image}
                />
              </TouchableOpacity>
              :<><Text style={{alignSelf: "center", fontSize: 12, fontStyle: "italic"}}>Tidak ada foto</Text></>}

            <Text style={[styles.pdf, {marginBottom: '2%'}]}>Dokumen Pendukung Laporan</Text>
            {item.dokumen_visit !== '' ?
              <TouchableOpacity style={styles.btn} onPress={() => openDoc(filename_dokumen)}>
                <Text style={styles.button}>Lihat Dokumen</Text>
              </TouchableOpacity>
              :<><Text style={{alignSelf: "center", fontSize: 12, fontStyle: "italic"}}>Tidak ada dokumen</Text></>}
          </View>
        </>
      )
    }else {
      return (
        <></>
      )
    }
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
              <Laporanheader style={styles.header} props={props} />
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
                  <View style={styles.scrollArea}>
                      <View style={styles.group}>
                        <Icon name="news" style={styles.icon}></Icon>
                        <Text style={styles.laporan}>LAPORAN</Text>
                      </View>

                      <RenderDetailLaporan />

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
  group: {
    marginTop: '5%'
  },
  icon: {
    color: "rgba(74,74,74,1)",
    fontSize: 50,
    alignSelf: "center"
  },
  laporan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 17,
    alignSelf: "center"
  },
  labelRow: {
  },
  label: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)"
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 16
  },
  image2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: '5%',
    alignSelf: 'center'
  },
  image: {
    flex: 1,
    height: 200,
    marginTop: '2%',
    alignSelf: "center"
  },
  pdf: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: '5%',
    alignSelf: 'center'
  },
  btn: {
    backgroundColor: "#41D3FC",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
    padding: '2%',
    width: '50%'
  },
  btn1: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: '100%'
  },
  button: {
    color: "#fff",
    fontSize: 12
  },
  footer: {
    height: '10%'
  }
});

export default LaporanDetail;
