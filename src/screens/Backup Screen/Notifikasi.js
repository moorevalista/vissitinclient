import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Headnotifikasi from "../components/Headnotifikasi";
import Tabnotif from "../components/Tabnotif";
import Icon from "react-native-vector-icons/FontAwesome";
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

function Notifikasi(props) {
  const formValidation = useContext(form_validation);

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
  },[dataLogin, refreshing]);

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
            <View style={styles.group1}>
              <View style={styles.rect1}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, {color: 'red', fontWeight: 'bold'}]}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={[styles.label2, {fontSize: 10}]}>{item.messages.length > 0 ? moment(newItems[i].messages[0].timestamp, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY') : moment(item.date_created, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY')}</Text>
                  <View style={styles.labelFiller}></View>
                  {/*<Icon name="bookmark" style={styles.icon}></Icon>*/}
                </View>
                <View style={[styles.labelRow, {marginTop: '2%'}]}>
                  <Text style={styles.label}>{item.messages.length > 0 ? newItems[i].messages[0].message : 'Anda sudah terhubung dengan Nakes...'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.group1}>
          <View style={styles.rect1}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>Tidak ada pesan</Text>
            </View>
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
            <View style={styles.group1}>
              <View style={styles.rect1}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{item.nakes}</Text>
                  <View style={styles.labelFiller}></View>
                  <Icon name="bookmark" style={styles.icon}></Icon>
                </View>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, {color: 'red', fontWeight: 'bold'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                </View>
                <View style={styles.labelRow}>
                  {item.id_paket === '1' ?
                    <Text style={styles.label}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format("DD/MM/YYYY") + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                    :
                    <Text style={styles.label2}>Buka pesanan untuk melihat detail jadwal</Text>
                  }
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.group1}>
          <View style={styles.rect1}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, {fontWeight: 'bold'}]}>Tidak ada data</Text>
            </View>
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
              <Headnotifikasi style={styles.header} props={props} />
              <View style={styles.headnotifikasiColumn}>
                <Tabnotif
                  style={styles.tabnotif}
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
                    {activeTab === 'pesan' ?
                      <>
                        <RenderPesan />
                        {shouldFetchChat ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                      </>
                      :
                      <>
                        <RenderNotif />
                        {shouldFetchBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                      </>
                    }
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
  tabnotif: {
    height: 56
  },
  headnotifikasiColumn: {
  },
  group1: {
    marginBottom: '2%'
  },
  rect1: {
    padding: '4%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  labelRow: {
    flexDirection: "row"
  },
  label: {
    fontFamily: "roboto-regular",
    alignSelf: 'center',
    color: "#121212"
  },
  label2: {
    fontStyle: 'italic',
    alignSelf: 'center',
    color: "#121212"
  },
  labelFiller: {
    flex: 1,
    flexDirection: "row"
  },
  icon: {
    color: "rgba(255,12,4,1)",
    fontSize: 30,
    height: 30,
    width: 21
  },
  footer: {
    height: '10%'
  }
});

export default Notifikasi;
