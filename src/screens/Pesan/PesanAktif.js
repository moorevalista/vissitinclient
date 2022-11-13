import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  BackHandler, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';

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
import useChat from '../../features/useChat';
import ChatRoom from '../../features/ChatRoom/ChatRoomUser';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function PesanAktif(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //params dari page sebelumnya
  const [id_chat, setId_chat] = useState('');

  const [detailChat, setDetailChat] = useState([]);
  const [terkirim, setTerkirim] = useState(false);
  const [prevChat, setPrevChat] = useState([]);

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
    return () => {
      setLoading(false);
    }
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);

  useEffect(() => {
    if(detailChat.messages) {
      renderMessages();
    }
  },[detailChat]);

  useEffect(() => {
    if(prevChat.length > 0) {
      readChat();
    }
  }, [prevChat]);

  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      if(props.route.params.onRefresh !== undefined) {
        props.route.params.onRefresh()
      }
    });

    return () => {
      unsubscribe;
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.navigation]);

  const setDataSource = async () => {
    await setId_chat(props.route.params.id_chat);
    await getDetailChat(props.route.params.id_chat);
    await setLoading(false);
  }

  const getDetailChat = async (id) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      id_chat: id,
      token: dataLogin.token
    });

    success = await formValidation.getDetailChat(params);

    if(success.status === true) {
      setDetailChat(success.res);
    }
  }

  const sendChat = async (msg) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_chat: id_chat,
      id_sender: dataLogin.id_pasien,
      messages: msg,
      token: dataLogin.token,
      id_nakes: detailChat.id_nakes,
      notif_type: 'notif_chat'
    });

    success = await formValidation.sendChat(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return null;
      }else {
        //send notif
        await formValidation.sendNotif(params);

        return success.res.id_msg;
      }
    }
  }

  const saveMsgRef = async (id_msg, ref) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_chat: id_chat,
      id_msg: id_msg,
      id_sender: dataLogin.id_pasien,
      ref: ref,
      token: dataLogin.token
    });

    success = await formValidation.saveMsgRef(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return false;
      }else {
        return true;
      }
    }
  }

  const readChat = async (id_msg) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      prevChat: prevChat,
      id_sender: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.readChat(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return false;
      }else {
        return true;
      }
    }
  }

  async function renderMessages() {
    let chat = [];
      detailChat.messages.map((item, i) => {
      chat[i] = item;
    })
    await setPrevChat(chat);
  }

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
            fontWeight: 'bold',
          }}
          name={name}
        />
      );
    }
  };

  function goBack() {
    if(props.route.params.onRefresh !== undefined) {
      props.route.params.onRefresh('pesan');
    }
    props.navigation.goBack();
  }

  return (
    !loading ?
    <>
      <SafeAreaView style={styles.container}>
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

              <View style={styles.User}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    // alignContent: 'center',
                    alignItems: 'center',
                    // alignSelf: 'center',
                  }}>
                  {/*<Image
                    style={styles.Useravatar}
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/1s5kcf6e8ux-89%3A7926?alt=media&token=484b7143-12d7-497c-86dc-f4a54eb3aff0',
                    }}
                  />*/}
                  <View style={styles.Text}>
                    <Text style={[styles.Txt664, { fontWeight: 'bold'}]}>{detailChat.first_name + ' ' + detailChat.middle_name + ' ' + detailChat.last_name}</Text>
                    <Text style={[styles.Txt664, { fontWeight: 'bold'}]}>{detailChat.profesi}</Text>
                    <Text style={[styles.Txt664, {fontSize: 12, fontStyle: 'italic'}]}>{detailChat.online == 1 ? 'Online' : 'Offline'}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => goBack()}>
                  <View style={styles.Tbl_iconPanah}>
                    <Icons
                      label="Panah"
                      name="close"
                      color="rgba(255, 255, 255, 1)"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            
              <View style={styles.PesanAktif}>
                {/*<ScrollView
                  nestedScrollEnabled={true}
                  refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => null} />
                  }>*/}
                  <View style={styles.container}>
                    <View style={styles.scrollArea}>
                      <ChatRoom
                        params={props.route.params}
                        id_nakes={detailChat.id_nakes}
                        prevChat={prevChat}
                        sendChat={sendChat}
                        saveMsgRef={saveMsgRef}
                      />
                    </View>
                  </View>
                {/*</ScrollView>*/}

              </View>
            </>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    backgroundColor: 'rgba(36,195,142,1)',
    //backgroundColor: 'rgba(217,217,217,1)',
    // backgroundColor: 'rgba(0,0,0,0.8)',
  },
  containerKey: {
    flex: 1,
    backgroundColor: "rgba(36,195,142,1)",
    //paddingBottom: Platform.OS === 'ios' ? 0 : '5%',
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0
  },

  PesanAktif: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  Block_chat_pengirim: item => ({
    alignSelf: item.pengirim ? 'flex-end' : 'flex-start',
    padding: 16,
    margin: 10,
    borderTopLeftRadius: item.pengirim ? 20 : 0,
    borderTopRightRadius: item.pengirim ? 0 : 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: item.pengirim ? 'rgba(36,195,142,1)' : 'rgba(0,32,51,1)',
  }),
  Txt683: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    textAlign: 'justify',
    color: 'rgba(250,250,250,1)',
  },
  Txt758: item => ({
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    color: 'rgba(250,250,250,1)',
    textAlign: item.pengirim ? 'right' : 'left',
    paddingTop: 10,
    justifyContent: item.pengirim ? 'flex-end' : 'flex-start',
  }),

  User: {
    paddingVertical: '4%',
    paddingHorizontal: '4%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //backgroundColor: 'rgba(217,217,217,1)',
    backgroundColor: 'rgba(36,195,142,1)',
    borderBottomLeftRadius: Platform.OS === 'ios' ? 10 : 20,
    borderBottomRightRadius: Platform.OS === 'ios' ? 10 : 20
  },
  Useravatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
  },
  Txt664: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(255,255,255,1)',
    marginBottom: 4,
  },
  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(54,54,54,1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
});
