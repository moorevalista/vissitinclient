import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';

import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';

export default function Jadwal(props) {
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

  const [fetchAktif, setFetchAktif] = useState(false);
  const [fetchSelesai, setFetchSelesai] = useState(false);

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

  useEffect(() => {
    if(fetchAktif) {
      getJadwalMenunggu();
    }

    return () => {
      setFetchAktif(false);
    }
  }, [fetchAktif]);

  useEffect(() => {
    if(fetchSelesai) {
      getJadwalSelesai();
    }

    return () => {
      setFetchSelesai(false);
    }
  }, [fetchSelesai]);

  const setDataSource = async () => {
    success = await getJadwalMenunggu();
    success = await getJadwalSelesai();

    //alert(success);

    if(success) {alert
      await setLoading(false);
      await setLoadingFetch(false);
    }
    return(true);
  }

  const getJadwalMenunggu = async () => {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
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
      base_url: formValidation.base_url,
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
    refetchData(e);
  }

  async function refetchData(e){
    if (e === 'aktif') {
      setBookingPage(0);
      setDataJadwal('');
      setFetchAktif(true);
    }else if(e === 'selesai') {
      setClosePage(0);
      setDataJadwalSelesai('');
      setFetchSelesai(true);
    }
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
      base_url: formValidation.base_url,
      dataJadwal: dataRes,
      onRefresh: onRefresh,
      refetchData: (e) => refetchData(e),
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
      base_url: formValidation.base_url,
      dataJadwal: dataRes,
      //onRefresh: onRefresh
    })
  }

  function RenderJadwalAktif() {
    const newItems = dataJadwal;
    if(newItems) {
      return newItems.map((item, i) => {
        return (
          <TouchableOpacity key={item.id_jadwal} onPress={item.id_paket === '1' ? () => handleExpand('aktif', item.id_jadwal) : () => handleExpandPaket('aktif', item.id_jadwal)}>
            <View style={styles.Chat_label_aktif}>
              {/*<Image
                style={styles.Rectangle2}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                }}
              />*/}
              <View style={styles.BlockjadwalAktif}>
                <Text style={styles.Txt011}>{item.nakes}</Text>
                <Text style={styles.Txt137}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={styles.Txt137}>
                  {item.id_paket === '1' ?
                    <Text style={styles.label}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                    :
                    <Text style={styles.label2}>Buka pesanan untuk melihat detail jadwal</Text>
                  }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.Chat_label_aktif}>
          <View style={styles.BlockjadwalAktif}>
            <Text style={[styles.Txt137, {fontWeight: 'bold'}]}>Tidak ada jadwal</Text>
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
          <TouchableOpacity key={item.id_jadwal} onPress={item.id_paket === '1' ? () => handleExpand('selesai', item.id_jadwal) : () => handleExpandPaket('selesai', item.id_jadwal)}>
            <View style={styles.Chat_label_selesai}>
              {/*<Image
                style={styles.Rectangle2}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                }}
              />*/}
              <View style={styles.BlockjadwalAktif}>
                <Text style={styles.Txt011}>{item.nakes}</Text>
                <Text style={styles.Txt137}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.Txt137}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                  :
                  <Text style={styles.Txt137}>Klik untuk lihat jadwal lebih detail...</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.Chat_label_selesai}>
          <View style={styles.BlockjadwalAktif}>
            <Text style={[styles.Txt137, {fontWeight: 'bold'}]}>Tidak ada jadwal</Text>
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
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Spinner
              visible={loadingSave}
              textContent={''}
              textStyle={styles.spinnerTextStyle}
              color="#236CFF"
              overlayColor="rgba(255, 255, 255, 0.5)"
            />
            <View style={styles.Layanan_jadwalSelesai_jadwalAktif}>
              <View style={styles.Tab_jadwalAktif}>
                <TouchableOpacity onPress={() => changeTab('aktif')}>
                  <View style={activeTab === 'aktif' ? styles.GroupAktif : styles.GroupInaktif}>
                    <Text style={activeTab === 'aktif' ? styles.TxtAktif : styles.TxtInaktif}>Jadwal Aktif</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeTab('selesai')}>
                  <View style={activeTab === 'selesai' ? styles.GroupAktif : styles.GroupInaktif}>
                    <Text style={activeTab === 'selesai' ? styles.TxtAktif : styles.TxtInaktif}>Jadwal Selesai</Text>
                  </View>
                </TouchableOpacity>
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
                {activeTab === 'aktif' ?
                  // isi untuk bagian jadwalAktif
                  <>
                    <RenderJadwalAktif />
                    {shouldFetchBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                  </>
                  : 
                  // isi untuk bagian jadwalSelesai
                  <>
                    <RenderJadwalSelesai />
                    {shouldFetchClose ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                  </>
                }
              </ScrollView>
            </View>
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
  },

  Layanan_jadwalSelesai_jadwalAktif: {
    flex: 1,
    paddingVertical: '2%',
    flexDirection: 'column',
    paddingHorizontal: '2%'
  },
  Tab_jadwalAktif: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    paddingVertical: '2%',
    marginBottom: '2%',
    borderRadius: 10,
    backgroundColor: 'rgba(218,218,218,1)',
  },
  GroupAktif: {
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(36,195,142,1)',
  },
  TxtAktif: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  GroupInaktif: {
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  TxtInaktif: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Chat_label_aktif: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '2%',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(36,195,142,1)',
  },
  Chat_label_selesai: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '2%',
    borderRadius: 10,
    marginBottom: 10,
    // backgroundColor: 'rgba(79,92,99,1)',
    backgroundColor: 'rgba(36,195,142,1)',
  },
  Rectangle2: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 100,
  },
  BlockjadwalAktif: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 260,
  },
  Txt011: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(250,250,250,1)',
    marginBottom: 4,
  },
  Txt137: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(250,250,250,1)',
    textAlign: 'justify',
    marginBottom: 4,
  },
});
