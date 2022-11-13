import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Headerjadwal from "../components/Headerjadwal";
import Tabjadwal from "../components/Tabjadwal";
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

function Jadwal(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [activeTab, setActiveTab] = useState('aktif');

  const [dataJadwal, setDataJadwal] = useState('');
  const [dataJadwalSelesai, setDataJadwalSelesai] = useState('');
  const [dataJadwalDetail, setDataJadwalDetail] = useState([]);
  const [id_jadwal_detail, setId_jadwal_detail] = useState('');


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [bookingPage, setBookingPage] = useState(0);
  const [shouldFetchBooking, setShouldFetchBooking] = useState(false);
  const [closePage, setClosePage] = useState(0);
  const [shouldFetchClose, setShouldFetchClose] = useState(false);
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
  });

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
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  /*useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getLoginData();
    });
    return unsubscribe;
  }, [props.navigation]);*/

  const setDataSource = async () => {
    success = await getJadwalMenunggu();
    success = await getJadwalSelesai();

    //alert(success);

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
    }
    return(true);
  }

  const getJadwalMenunggu = async () => {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
      method: 'getReservation'
    });

    success = await formValidation.getDataJadwal(params, bookingPage, 10);
    
    if(success.status === true) {
      setShouldFetchBooking(false);
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        //await setDataJadwal(success.res.data);
        try {
          if(success.res.data !== undefined) {
            setDataJadwal(oldData => [...oldData, ...success.res.data]);

            setBookingPage(bookingPage + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  const getJadwalSelesai = async () => {
    setShouldFetchClose(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
      method: 'getReservationHistory'
    });

    success = await formValidation.getDataJadwal(params, closePage, 10);
    
    if(success.status === true) {
      setShouldFetchClose(false);
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        //await setDataJadwalSelesai(success.res.data);
        try {
          if(success.res.data != undefined) {
            setDataJadwalSelesai(oldData => [...oldData, ...success.res.data]);

            setClosePage(closePage + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  async function changeTab(e) {
    setActiveTab(e);
  }

  async function handleExpand(status, e) {
    await setId_jadwal_detail(e);
    let dataRes = '';

    if(status === 'aktif') {
      dataRes = dataJadwal.filter(
        item => item.id_jadwal === e
      );
    }else if(status === 'selesai') {
      dataRes = dataJadwalSelesai.filter(
        item => item.id_jadwal === e
      );
    }

    props.navigation.navigate('jadwalDetail', {
      base_url: props.route.params.base_url,
      dataJadwal: dataRes,
      //onRefresh: onRefresh
      //onGoBack: (
        //setActiveTab('notif')
        //onRefresh()
      //)
    });
  }

  async function handleExpandPaket(status, e) {
    await setId_jadwal_detail(e);
    let dataRes = '';

    if(status === 'aktif') {
      dataRes = dataJadwal.filter(
        item => item.id_jadwal === e
      );
    }else if(status === 'selesai') {
      dataRes = dataJadwalSelesai.filter(
        item => item.id_jadwal === e
      );
    }

    props.navigation.navigate('jadwalDetail', {
      base_url: props.route.params.base_url,
      dataJadwal: dataRes,
      //onRefresh: onRefresh
    })
  }

  function RenderJadwalAktif() {
    const newItems = dataJadwal;
    if(newItems) {
      return newItems.map((item, i) => {
        return (
          <TouchableOpacity key={item.id_jadwal} style={styles.group} onPress={item.id_paket === '1' ? () => handleExpand('aktif', item.id_jadwal) : () => handleExpandPaket('aktif', item.id_jadwal)}>
            <View style={styles.rect}>
              <Text style={styles.label}>{item.nakes}</Text>
              <Text style={[styles.label, {fontWeight: 'bold', color: 'red', marginTop: '2%'}]}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
              {item.id_paket === '1' ?
                <Text style={styles.label}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                :
                <Text style={styles.label2}>Buka pesanan untuk melihat detail jadwal</Text>
              }
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.group}>
          <View style={styles.rect}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>Tidak ada jadwal</Text>
            </View>
          </View>
        </View>
      )
    }
  }

  function RenderJadwalSelesai() {
    const newItems = dataJadwalSelesai;
    if(newItems) {
      return newItems.map((item, i) => {
        return (
          <TouchableOpacity key={item.id_jadwal} style={styles.group} onPress={item.id_paket === '1' ? () => handleExpand('selesai', item.id_jadwal) : () => handleExpandPaket('selesai', item.id_jadwal)}>
            <View style={styles.rect}>
              <Text style={styles.label}>{item.nakes}</Text>
              <Text style={[styles.label, {fontWeight: 'bold', color: 'red', marginTop: '2%'}]}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
              {item.id_paket === '1' ?
                <Text style={styles.label}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                :
                <Text style={styles.label2}>Buka pesanan untuk melihat detail jadwal</Text>
              }
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.group}>
          <View style={styles.rect}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>Tidak ada jadwal</Text>
            </View>
          </View>
        </View>
      )
    }
  }

  function FetchData() {
    if(activeTab) {
      switch(activeTab) {
        case 'aktif':
          getJadwalMenunggu();
          break;
        case 'selesai':
          getJadwalSelesai();
          break;
      }
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
              <Headerjadwal style={styles.header} props={props} />
              <View style={styles.headerjadwalColumn}>
                <Tabjadwal
                  style={styles.tabjadwal}
                  activeTab={activeTab}
                  changeTab={changeTab}
                />
              </View>

              <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={FetchData}
                    /*refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }*/
                  >
                <View style={styles.container}>
                  <View style={styles.scrollArea}>
                    {activeTab === 'aktif' ?
                      <>
                        <RenderJadwalAktif />
                        {shouldFetchBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                      </>
                      :
                      <>
                        <RenderJadwalSelesai />
                        {shouldFetchClose ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                      </>
                    }
                  </View>
                </View>
              </ScrollView>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Footermenu props={props} />
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
  tabjadwal: {
    height: 56
  },
  headerjadwalColumn: {},
  scrollArea1: {
    flex: 1,
    marginLeft: 14,
    marginRight: 14
  },
  group: {
    marginBottom: '2%'
  },
  rect: {
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
  label2: {
    fontStyle: 'italic',
    color: "#121212"
  },
  footer: {
    height: '10%'
  }
});

export default Jadwal;
