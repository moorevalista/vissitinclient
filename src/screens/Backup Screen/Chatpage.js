import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, BackHandler,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Headerpesan from "../components/Headerpesan";
import Sendbtn from "../components/Sendbtn";
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
import useChat from '../features/useChat';
import ChatRoom from '../features/ChatRoom/ChatRoomUser';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function Chatpage(props) {
  const formValidation = useContext(form_validation);

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
              <Headerpesan style={styles.header} props={props} />
              <View style={styles.headerpesanColumn}>
                <View style={styles.topheadchat}>
                  <View style={styles.rect}>
                    <Text style={styles.namanakes}>{detailChat.first_name + ' ' + detailChat.middle_name + ' ' + detailChat.last_name}</Text>
                    <Text style={styles.layanan}>{detailChat.profesi}</Text>
                    <Text style={styles.waktu}>{detailChat.online == 1 ? 'Online' : 'Offline'}</Text>
                  </View>
                </View>
              </View>
              
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
              
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    flex: 1
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white",
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
    left: 0
  },
  scrollArea_contentContainerStyle: {
    height: '100%',
    borderWidth: 2,
    borderColor: 'red'
  },
  topheadchat: {
    height: 78
  },
  rect: {
    flex: 1,
    backgroundColor: "rgba(74,74,74,1)",
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 26
  },
  namanakes: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    marginTop: '4%'
  },
  layanan: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center"
  },
  waktu: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center"
  },
  headerpesanColumn: {},
  bubleChat: {
    alignSelf: 'flex-start',
    marginTop: '4%',
    width: 'auto',
    maxWidth: '70%'
  },
  rectChat: {
    paddingLeft: '2%',
    paddingRight: '2%',
    backgroundColor: 'rgba(74,74,74,1)',
    borderRadius: 10,
    borderColor: "#000000",
    alignItems: 'flex-end',
  },
  contentChat: {
    width: '100%',
    fontFamily: "roboto-regular",
    color: "#fff",
    fontSize: 14,
    padding: '2%'
  },
  timeChat: {
    fontFamily: "roboto-regular",
    color: "#fff",
    fontSize: 10,
    paddingTop: '1%',
    paddingRight: '5%',
    paddingBottom: '1%',
    paddingLeft: '1%',
  },
  chatform: {
  },
  rect2Filler: {
    flex: 1
  },
  rect2: {
    minHeight: 80,
    maxHeight: 150,
    height: 'auto',
    backgroundColor: "rgba(80,227,194,1)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: '4%'
  },
  group2: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around"
  },
  group: {
    flex: 1
  },
  rect3: {
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000000"
  },
  textInput: {
    height: 'auto',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  sendbtn: {
    flex: 0.15,
    alignSelf: 'center',
    marginLeft: '1%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)"
  }
});

export default Chatpage;
