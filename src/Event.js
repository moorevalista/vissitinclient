import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";
import { CommonActions } from '@react-navigation/native';

import { form_validation } from "./form_validation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Listener from './listener';

function Event({ props, paramsCheck = null }) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);

  //for checkin
  const [reqCheckIn, setReqCheckIn] = useState(false);
  const [allowCheckIn, setAllowCheckIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('');
  //const [reqParams, setReqParams] = useState('');
  //for checkin

  //for checkout
  const [paymentState, setPaymentState] = useState(false);

  //for send notif to nakes when reservation
  /*const [id_jadwal, setId_jadwal] = useState('');
  const [jadwalNakes, setJadwalNakes] = useState([]);
  const [sendNotif, setSendNotif] = useState(false);*/

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
    setLoading(true);
    if(loading) {
      getLoginData();
    }

    return () => {
      setLoading(false);
    }
  },[]);

  /*useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);*/

  useEffect(() => {
    if(paramsCheck !== null) {
      setDataSource();
    }
  },[paramsCheck]);

  /*useEffect(() => {
    if(id_jadwal !== '') {
      //alert(JSON.stringify(jadwalNakes));
      //alert(id_jadwal);
      //alert(sendNotif);
    }
  },[id_jadwal]);*/

  const setDataSource = async () => {
    if(paramsCheck !== null) {
      await setAllowCheckIn(paramsCheck[0].allowCheckIn);
      await setCurrentScreen(paramsCheck[0].currentScreen);
      await setPaymentState(paramsCheck[0].paymentState);

      /*await setId_jadwal(paramsCheck[0].id_jadwal);
      await setJadwalNakes(paramsCheck[0].jadwalNakes);
      await setSendNotif(paramsCheck[0].sendNotif);*/
    }
  }

  const sendNotification = async (type, value, value2, value3) => {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      id_jadwal: value,
      token: dataLogin.token
    });

    success = await formValidation.getJadwalForCheckIn(params);
    
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError(success.res.messages);
      }else {
        let reqParams = [];
        reqParams.push({
          type: type,
          value: value,
          value2: value2,
          value3: value3
        });
        //await setReqParams(reqParams);
        await AsyncStorage.setItem('reqParams', JSON.stringify(reqParams));
        if(currentScreen === 'jadwalDetail') {
          paramsCheck[0].getCurrentJadwal();
        }else {
          props.navigation.navigate('jadwalDetail', { base_url: formValidation.base_url, dataJadwal: success.res.data });
        }
      }
    }
  }

  const afterCheckIn = async () => {
    //onRefresh();
    if(paramsCheck !== null) {
      paramsCheck[0].getCurrentJadwal();
    }
  }

  const afterCheckOut = async (type, value, value2, value3) => {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      id_jadwal: value,
      id_paket: value2,
      id_detail: value3,
      token: dataLogin.token
    });

    success = await formValidation.getJadwalForCheckOut(params);
    console.log(success);
    
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        let reqParams = [];
        reqParams.push({
          type: type,
          value: value,
          value2: value2,
          value3: value3
        });
        //await setReqParams(reqParams);
        await AsyncStorage.removeItem('reqParams');
        await AsyncStorage.setItem('reqParams', JSON.stringify(reqParams));
        if(currentScreen === 'jadwalDetail') {
          if(paramsCheck !== null) {
            //paramsCheck[0].onRefresh();
            // paramsCheck[0].checkForCheckOut();
            paramsCheck[0].afterPayment(); //untuk bypass check out
          }
        }else {
          props.navigation.navigate('jadwalDetail', { base_url: formValidation.base_url, dataJadwal: success.res.data });
        }
      }
    }
  }

  return (
    <View>
      <Listener
        base_url={formValidation.base_url}
        id_listener={dataLogin.id_pasien}
        reqCheckIn={reqCheckIn}
        allowCheckIn={allowCheckIn}
        sendNotification={sendNotification}
        //reqParams={reqParams}
        afterCheckIn={afterCheckIn}
        afterCheckOut={afterCheckOut}
        paymentState={paymentState}

        /*id_jadwal={id_jadwal}
        jadwalNakes={jadwalNakes}
        sendNotif={sendNotif}*/
      />
    </View>
  );
}

export default Event;
