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
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';

export default function Pesan(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [activeTab, setActiveTab] = useState('pesan');

  //untuk menampung dataset notif/reservasi
  const [dataReservasi, setDataReservasi] = useState('');
  const [id_jadwal_detail, setId_jadwal_detail] = useState('');
  const [dataChat, setDataChat] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [chatPage, setChatPage] = useState(0);
  const [shouldFetchChat, setShouldFetchChat] = useState(false);
  const [bookingPage, setBookingPage] = useState(0);
  const [shouldFetchBooking, setShouldFetchBooking] = useState(false);
  //params for pagination

  const [pesan, setPesan] = useState(true);
  const [reservasi, setReservasi] = useState(false);

  const [fetchPesan, setFetchPesan] = useState(false);
  const [fetchReservasi, setFetchReservasi] = useState(false);

  const onRefresh = useCallback((e) => {
    setRefreshing(true);
    if(e !== '' && e !== undefined) {
      refetchData(e);
    }else {
      if(dataLogin) {
        setDataSource();
      }
    }
    wait(2000).then(() => setRefreshing(false));
  });

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
  },[]);

  useEffect(() => {
    //setLoading(true);
    if(dataLogin) {
      setDataSource();
    }
    return () => {
      setLoading(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(fetchPesan) {
      getAllChat();
    }

    return () => {
      setFetchPesan(false);
    }
  }, [fetchPesan]);

  useEffect(() => {
    if(fetchReservasi) {
      getReservation();
    }

    return () => {
      setFetchReservasi(false);
    }
  }, [fetchReservasi]);

  const setDataSource = async () => {
    await setLoading(true);
    //if(props.route.params.msg) {
      //await formValidation.showError(props.route.params.msg);
    //}
    await getAllChat();
    await getReservation();

    await setLoading(false);
  }

  async function changeTab(e) {
    setActiveTab(e);
    refetchData(e);
  }

  async function refetchData(e){
    if (e === 'pesan') {
      setChatPage(0);
      setDataChat('');
      setPesan(true);
      setReservasi(false);
      setFetchPesan(true);
    }else if(e === 'notif') {
      setBookingPage(0);
      setDataReservasi('');
      setPesan(false);
      setReservasi(true);
      setFetchReservasi(true);
    }
  }

  const getAllChat = async () => {
    setShouldFetchChat(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getAllChat(params, chatPage, 10);
    
    if(success.status === true) {
      //setDataChat(success.res);
      try {
        setShouldFetchChat(false);
        if(success.res !== undefined) {
          setDataChat(oldData => [...oldData, ...success.res]);

          setChatPage(chatPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  const getReservation = async () => {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getReservation(params, bookingPage, 10);

    if(success.status === true) {
      //setDataReservasi(success.res);
      try {
        setShouldFetchBooking(false);
        if(success.res !== undefined) {
          setDataReservasi(oldData => [...oldData, ...success.res]);

          setBookingPage(bookingPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  async function handleExpand(e) {
    await setId_jadwal_detail(e);

    const dataRes = dataReservasi.filter(
      item => item.id_jadwal === e
    );

    props.navigation.navigate('notifReservasi', {
      base_url: formValidation.base_url,
      dataReservasi: dataRes,
      onRefresh: onRefresh
      //onGoBack: (
        //setActiveTab('notif')
        //onRefresh()
      //)
    });
  }

  async function handleExpandPaket(e) {
    await setId_jadwal_detail(e);

    const dataRes = dataReservasi.filter(
      item => item.id_jadwal === e
    );

    props.navigation.navigate('notifReservasi', {
      base_url: formValidation.base_url,
      dataReservasi: dataRes,
      onRefresh: onRefresh
    })
  }

  async function openChat(id_chat) {
    props.navigation.navigate('chatPage', { base_url: formValidation.base_url, id_chat: id_chat, onRefresh: onRefresh });
  }

  function RenderPesan() {
    const newItems = dataChat;

    if(newItems) {
      return newItems.map((item, i) => {
        return (
          <TouchableOpacity key={item.id_chat} onPress={() => openChat(item.id_chat)}>
            <View style={styles.Chat_label}>
              {/*<Image
                style={styles.Rectangle2}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                }}
              />*/}
              <View style={styles.Blockpesan}>
                <Text style={styles.Txt011}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                <Text style={styles.Txt137}>{item.messages.length > 0 ? moment(newItems[i].messages[0].timestamp, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY') : moment(item.date_created, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY')}</Text>
                <Text style={styles.Txt137}>{item.messages.length > 0 ? newItems[i].messages[0].message : 'Anda sudah terhubung dengan Nakes...'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.Chat_label}>
          <View style={styles.Blockpesan}>
            <Text style={[styles.Txt137, {fontWeight: 'bold'}]}>Tidak ada pesan</Text>
          </View>
        </View>
      )
    }
  }

  function RenderNotif() {
    const newItems = dataReservasi;

    if(newItems) {
      return newItems.map((item) => {
        return (
          <TouchableOpacity key={item.id_jadwal} onPress={item.id_paket === '1' ? () => handleExpand(item.id_jadwal) : () => handleExpandPaket(item.id_jadwal) }>
            <View style={styles.Chat_label}>
              {/*<Image
                style={styles.Rectangle2}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                }}
              />*/}
              <View style={styles.Blockpesan}>
                <Text style={styles.Txt011}>{item.nakes}</Text>
                <Text style={styles.Txt137}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.Txt137}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format("DD/MM/YYYY") + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
                  :
                  <Text style={styles.Txt137}>Buka pesanan untuk melihat detail jadwal</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.Chat_label}>
          <View style={styles.Blockpesan}>
            <Text style={[styles.Txt137, {fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function FetchData() {
    if(activeTab) {
      switch(activeTab) {
        case 'pesan':
          getAllChat();
          break;
        case 'notif':
          getReservation();
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
        <View style={styles.Layanan_reservasi_pesan}>
          <View style={styles.Tab_pesan}>
            <TouchableOpacity onPress={() => changeTab('pesan')}>
              <View style={styles.Group316(pesan)}>
                <Text style={styles.Txt6110(pesan)}>Pesan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeTab('notif')}>
              <View style={styles.Group316(reservasi)}>
                <Text style={styles.Txt6110(reservasi)}>Reservasi</Text>
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
            {activeTab === 'pesan' ?
              // isi untuk bagian pesan
              <>
                <RenderPesan />
                {shouldFetchChat ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
              </>
             : 
              // </View>
              // isi untuk bagian reservasi
              <>
                <RenderNotif />
                {shouldFetchBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
              </>
            }
          </ScrollView>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Layanan_reservasi_pesan: {
    flex: 1,
    paddingVertical: '2%',
    flexDirection: 'column',
    paddingHorizontal: '2%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },

  Tab_pesan: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    paddingVertical: '2%',
    marginBottom: '2%',
    borderRadius: 10,
    backgroundColor: 'rgba(218,218,218,1)',
  },
  Group316: item => ({
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    borderRadius: 10,
    backgroundColor: item ? 'rgba(36,195,142,1)' : 'rgba(217,217,217,1)',
  }),
  Txt6110: item => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: item ? 'rgba(255, 255, 255, 1)' : 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  }),

  Chat_label: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '2%',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(36,195,142,1)',
  },
  Rectangle2: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 100,
  },
  Blockpesan: {
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
