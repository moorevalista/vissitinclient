import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Laporanheader from "../components/Laporanheader";
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

function Laporan(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReport, setDataReport] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  //params for pagination

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await setDataSource();
    //alert(success);
    if(success) {
      setRefreshing(false)
      setLoadingFetch(false);
    }else {
      setRefreshing(true);
      setLoadingFetch(true);
    }
    //wait(2000).then(() => setRefreshing(false));
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
    success = await getAllReport();

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
    }
    return(true);
  }

  const getAllReport = async () => {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getAllReport(params, page, 10);
    
    if(success.status === true) {
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        //setDataReport(success.res.data);
        try {
          if(success.res.data !== undefined) {
            setDataReport(oldData => [...oldData, ...success.res.data]);

            setPage(page + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  function RenderAllReport() {
    const newItems = dataReport;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_referensi} style={styles.group1} onPress={item.id_paket === '1' ? () => openReport(item.id_jadwal) : () => openReportKhusus(item.id_detail)} >
            <View style={styles.rect1}>
              <Text style={[styles.label, {marginBottom: '2%'}]}>{item.nakes}</Text>
              <Text style={[styles.label, {fontWeight: 'bold', color: 'red'}]}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
              <Text style={styles.label}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>{item.keluhan_utama}</Text>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.group1}>
          <View style={styles.rect1}>
            <Text style={[styles.label, {fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  //get detail report
  const openReport = async (id) => {
    const laporan = dataReport.filter(
      item => item.id_jadwal === id
    )

    props.navigation.navigate('laporanDetail', { base_url: props.route.params.base_url, detailLaporan: laporan });
  }

  const openReportKhusus = async (id) => {
    const laporan = dataReport.filter(
      item => item.id_detail === id
    )

    props.navigation.navigate('laporanDetail', { base_url: props.route.params.base_url, detailLaporan: laporan });
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
                    onScrollEndDrag={getAllReport}
                    /*refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }*/
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                    <RenderAllReport />
                    {shouldFetch ? <ActivityIndicator style={styles.group1} size="small" color="#0000ff" /> : <></>}
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
  group1: {
    marginTop: '2%'
  },
  rect1: {
    padding: '4%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  footer: {
    height: '10%'
  }
});

export default Laporan;
