import React, { useState, useEffect, useRef } from "react";
import useChat from "./features/useChat";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Listener = (props) => {
  const roomId = props.id_listener;
  const {messages, sendMessage} = useChat(roomId); //func kirim pesan pada useChat
  const sendNotification = props.sendNotification;

  //params from sender
  const reqCheckIn = props.reqCheckIn;
  const allowCheckIn = props.allowCheckIn;
  const afterCheckIn = props.afterCheckIn;
  const afterCheckOut = props.afterCheckOut;
  const getCurrentJadwal = props.getCurrentJadwal;
  const [reqParams, setReqParams] = useState('');
  const paymentState = props.paymentState;

  //for send notif when reservation
  /*const id_jadwal = props.id_jadwal;
  const jadwalNakes = props.jadwalNakes;
  const sendNotifReservation = props.sendNotif;*/

  const getParamsCheckIn = async () => {
     const data = await AsyncStorage.getItem('reqParams');
     await setReqParams(JSON.parse(data));
  }

  useEffect(() => {
    getParamsCheckIn();
  }, []);

  //listen for initial request
  useEffect(() => {
    //alert(JSON.stringify(messages));
    //console.log(roomId);
    //console.log(messages);
    handleListener();
  }, [messages]);

  //listen for check in request from nakes
  useEffect(() => {
    handleCheckIn();
  }, [reqCheckIn]);

  //sending check in confirm to nakes
  useEffect(() => {
    //alert(allowCheckIn);
    allowNakesCheckIn();
  }, [allowCheckIn]);

  useEffect(() => {
    //alert(paymentState);
    if(paymentState) {
      handleSendMessage('Payment|DONE');
    }
  }, [paymentState]);

  /*useEffect(() => {
    if(sendNotifReservation && id_jadwal !== '') {
      //alert(jadwalNakes[0].id_nakes);
      //alert(sendNotifReservation);
      handleSendMessage('notif|reservasi|' + id_jadwal)
    }
  },[sendNotifReservation, id_jadwal]);

  useEffect(() => {
    if(jadwalNakes[0] !== undefined && jadwalNakes[0].id_nakes !== '') {
      setRoomId(jadwalNakes[0].id_nakes);
    }
  },[jadwalNakes]);*/

  const allowNakesCheckIn = () => {
    allowCheckIn ? handleSendMessage('checkin|allow' + '|' + reqParams[0].value + '|' + reqParams[0].value2 + '|' + reqParams[0].value3) : '';
  }

  const handleSendMessage = async (key) => {
    //await alert(key);
    await sendMessage(key);
    //afterCheckIn();
  }

  const handleCheckIn = async () => {
    (reqCheckIn.type !== undefined && reqCheckIn.value !== undefined) ? await handleSendMessage(reqCheckIn.type + '|' + reqCheckIn.value) : '';
  }

  const handleListener = async () => {
    let str = '';
    //let i = 0;
    //for (i = 0; i < messages.length; i++) {
      //(messages[i] !== undefined) ? str = (messages[i].body) : '';
      (messages.length > 0) ? str = messages[messages.length -1].body : '';
      const data = str.split('|');
      const type = data[0];
      const value = data[1];
      const value2 = data[2];
      const value3 = data[3];

      if(type !== undefined && value !== undefined) {
        if(type === 'checkin' && value !== 'allow') {
          sendNotif(type, value, value2, value3);
        }else if(type === 'checkout' && value !== '') {
          //alert('iya');
          afterCheckOut ? afterCheckOut(type, value, value2, value3) : '';
        }else if(type === 'onsite') {
          afterCheckIn();
        }
      }
    //}
  }

  const sendNotif = async (type, value, value2, value3) => {
    await sendNotification(type, value, value2, value3);
  }

  return (
    <></>
  )

}

export default Listener;