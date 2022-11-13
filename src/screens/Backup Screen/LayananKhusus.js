import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
import RadioJamLayanan from "../components/RadioJamLayanan";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Btnlanjut from "../components/Btnlanjut";
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
import { LocaleConfig, Calendar, CalendarList, Agenda } from 'react-native-calendars';

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan.','Peb','Mar','Apr','Mei','Jun','Jul.','Agt','Sep.','Okt.','Nop.','Des.'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min.','Sen.','Sel.','Rab.','Kam.','Jum.','Sab'],
  today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id';

function LayananKhusus(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //parameter dari prev page
  const [jenisPaket, setJenisPaket] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [id_profesi, setId_profesi] = useState('');
  const [jenisLayanan, setJenisLayanan] = useState('');
  const [refCode, setRefCode] = useState('');
  const [serviceUser, setServiceUser] = useState('');
  const [dataKerabat, setDataKerabat] = useState('');

  //untuk menampung dataset dari database
  const [jadwalNakes, setJadwalNakes] = useState([]);
  const [dataPaket, setDataPaket] = useState([]);

  const [jadwalTerpilih, setJadwalTerpilih] = useState([]);
  const [waktuBooking, setWaktuBooking] = useState('');
  const [jmlJadwalTerpilih, setJmlJadwalTerpilih] = useState(0);
  const [buttonAddJadwal, setButtonAddJadwal] = useState(false);

  const today = (moment(new Date()).format('YYYY-MM-DD')).toString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(today);

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
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);

  useEffect(() => {
    if(dataNakes) {
      getPaket();
    }
  },[dataNakes]);

  useEffect(() => {
    if(dataPaket) {
      setPaket();
    }
  },[dataPaket]);

  const resetData = async () => {
    await setJadwalTerpilih([]);
    await setJmlJadwalTerpilih(0);
    await setButtonAddJadwal(false);

    await setDataPaket([]);
    await setJadwalNakes([]);
    await setSelectedDate(today);
    await setStartDate(today);

    await setDataNakes('');
  }

  const setDataSource = async () => {
    await resetData();
    await setJenisPaket(props.route.params.jenisPaket);
    await setDataNakes(props.route.params.dataNakes);
    await setId_profesi(props.route.params.id_profesi);
    await setJenisLayanan(props.route.params.jenisLayanan);
    await setRefCode(props.route.params.refCode);
    await setServiceUser(props.route.params.serviceUser);
    await setDataKerabat(props.route.params.dataKerabat);

    //await getPaket();
    //await setPaket();

    await setLoading(false);
  }

  const setPaket = async () => {
    let jml = dataPaket.duration;

    let jadwal = [];
    let i = 0;
    for(i=0; i<jml; i++) {
      jadwal['tgl'] = '';
      jadwal['waktu'] = '';
      jadwalTerpilih.push(jadwal);
    }
  }

  const dateChange = async (day) => {
    setLoadingSave(true);
    await setSelectedDate(day.dateString);
    await setWaktuBooking('');
    await getJadwalKhusus(day.dateString);
    await checkJadwal(moment(day.dateString).format('YYYY-MM-DD'));
    setLoadingSave(false);
  }

  const checkJadwal = async (e) => {
    const index = jadwalTerpilih.findIndex((item) => item.tgl === e);
    let pilih = jadwalTerpilih.slice();

    if(pilih[index] !== undefined) {
      await setWaktuBooking(pilih[index].waktu);
    }
    //console.log(waktuBooking);
  }

  const getPaket = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      token: dataLogin.token,
      id_nakes: dataNakes.id_nakes,
      jenisPaket: jenisPaket
    });

    success = await formValidation.getPaket(params);
    
    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError(success.res.messages);
        setDataPaket([]);
      }else {
        setDataPaket(success.res.data);
      }
    }
  }

  const getJadwalKhusus = async (e) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      token: dataLogin.token,
      id_nakes: dataNakes.id_nakes,
      selectDate: e
    });

    success = await formValidation.getJadwalKhusus(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        formValidation.showError(success.res.messages);
        setJadwalNakes([]);
      }else {
        setJadwalNakes(success.res);
      }
    }
  }

  const onSelectTime = async (e) => {
    await setWaktuBooking(e);
  }

  const onConfirm = async () => {
    const selectDate = moment(selectedDate).format('YYYY-MM-DD');

    let jadwalExist = handleCheckJadwal({tgl: selectDate});
    let waktuExist = handleCheckWaktu({tgl: waktuBooking});

    let jml = dataPaket.duration;

    if(jmlJadwalTerpilih < jml) {
      if(waktuBooking !== '') {
        if(jadwalExist === false && waktuExist ===  false) {
          const index = jadwalTerpilih.findIndex((item) => item.tgl === '');
          let pilih = jadwalTerpilih.slice();
          pilih[index] = {tgl: selectDate, waktu: waktuBooking};
          await setJadwalTerpilih(pilih);

          let jml = jmlJadwalTerpilih;
          jml++;
          await setJmlJadwalTerpilih(jml);
          await setButton(jml);
        }else if(jadwalExist ===  true && waktuExist === false) {
          const index = jadwalTerpilih.findIndex((item) => item.tgl === selectDate);
          let pilih = jadwalTerpilih.slice();
          pilih[index] = {tgl: selectDate, waktu: waktuBooking};
          await setJadwalTerpilih(pilih);
        }
      }else {
        formValidation.showError('Anda belum memilih jadwal...');
      }
    }else {
      formValidation.showError('Anda sudah memilih ' + jml + ' jadwal...');
    }
  }

  const onRemove = async (e) => {
    let index = e;

    let pilih = jadwalTerpilih.slice();
    pilih[index] = {tgl: '', waktu: ''};
    await setJadwalTerpilih(pilih);

    let jml = jmlJadwalTerpilih;
    jml--;
    await setJmlJadwalTerpilih(jml);
    await setButton(jml);
  }

  async function setButton(e) {
    let jml = dataPaket.duration;

    if(e >= jml) {
      await setButtonAddJadwal(true);
    }else {
      await setButtonAddJadwal(false);
    }
  }

  function handleCheckJadwal(e) {
    return jadwalTerpilih.some(item => e.tgl === item.tgl);
  }

  function handleCheckWaktu(e) {
    return jadwalTerpilih.some(item => e.waktu === item.waktu);
  }

  const handleNext = async () => {
    let jml = dataPaket.duration;

    if(jmlJadwalTerpilih === 0 || jmlJadwalTerpilih < jml) {
      formValidation.showError('Anda belum memilih seluruh jadwal paket...');
    }else {
      let params = [];
      params.push({
        id_pasien: dataLogin.id_pasien,
        id_profesi: id_profesi,
        jenisLayanan: jenisLayanan,
        refCode: refCode,
        serviceUser: serviceUser,
        dataKerabat: dataKerabat,
        dataPaket: dataPaket,
        dataNakes: dataNakes,
        jadwalTerpilih: jadwalTerpilih
      });

      props.navigation.navigate('konfirmasiLayananKhusus', { base_url: props.route.params.base_url, params: params, id_profesi: id_profesi, jenisLayanan: jenisLayanan });
    }
  }

  function RenderJadwal() {
    const newItems = jadwalNakes.result;

    if(newItems) {
      return newItems.map((item, index) => {
        let rowTime = [];

        const jadwal = item.jadwal;
        jadwal.map((key, i) => {
          let jam = jadwal[i].jam_praktek;
          jam.sort();

          jam.map(jadwal => {
            rowTime.push(
              <View key={jadwal} style={styles.group4}>
                <RadioJamLayanan
                  name="jadwalTersedia"
                  value={jadwal}
                  style={styles.radio}
                  onSelectTime={onSelectTime}
                  waktuBooking={waktuBooking}
                />
                <Text style={styles.jam}>{jadwal + ' wib'}</Text>
                {jadwal === waktuBooking ?
                  <TouchableOpacity style={!buttonAddJadwal ? styles.btnSelect : styles.btnSelectDisabled} disabled={buttonAddJadwal} onPress={() => onConfirm()}><Text style={styles.labelBtn}>+</Text></TouchableOpacity>
                  :<></>}
              </View>
            )
          })
        })

        if(rowTime.length > 0) {
          return (
            Platform.OS === "ios" ?
              <ScrollView
                key={item.id_nakes}
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
                <Text style={styles.jadwalTersedia}>Jadwal Tersedia :</Text>
                {rowTime}
              </ScrollView>
              :
              <View
                key={item.id_nakes}
              >
                <Text style={styles.jadwalTersedia}>Jadwal Tersedia :</Text>
                {rowTime}
              </View>
          )
        }else {
          return (
            <View key={item.id_nakes}>
              <Text style={{fontStyle: 'italic'}}>Jadwal Tidak Tersedia...</Text>
            </View>
          )
        }
      })
    }else {
      return (
        <>
          <Text style={{fontStyle: 'italic'}}>Jadwal Tidak Tersedia...</Text>
        </>
      )
    }
  }

  //render jadwal yang dipilih
  function RenderJadwalTerpilih() {
    const newItems = jadwalTerpilih;

    if(newItems) {
      return newItems.map((item, index) => {
        let rowTerpilih = [];

        rowTerpilih.push(
            <View key={item.tgl + '_' + item.waktu} style={styles.group6}>
              <Text style={styles.jadwalKe1}>Jadwal Ke-{index + 1}</Text>
              <View style={styles.rect4}>
                <View style={styles.group9}>
                  <Text
                    placeholder="Tanggal & Waktu"
                    placeholderTextColor="rgba(0,0,0,1)"
                    style={styles.textInput}
                  >{(item.tgl !== '' ? moment(item.tgl).format('dddd') + ', ' + moment(item.tgl).format('DD-MM-YYYY') + ' | ' : '') + (item.waktu !== '' ? 'Pukul ' +  item.waktu + ' wib':'')}</Text>
                  {item.tgl !== '' ? 
                    <TouchableOpacity
                      onPress={() => onRemove(index)}
                    >
                      <SimpleLineIconsIcon
                        name="close"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    :<></>}
                </View>
              </View>
            </View>
        )

        return (
          rowTerpilih
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function RenderNakesDetail() {
    const nakes = dataNakes;
    if(nakes) {
      return (
        <View>
          <View style={styles.group2}>
            <View style={styles.rect2}>
              <Text style={styles.namanakes1}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
            </View>
          </View>

          <View style={styles.kalendar}>
            <Calendar
              minDate={startDate}
              markedDates={{
                [selectedDate]: {selected: true, marked: true, selectedColor: '#26AFFF'},
              }}
              style={styles.calendar}
              onDayPress={(day) => {dateChange(day)}}
            />
          </View>

          <View style={Platform.OS === "ios" ? [styles.rect1, {height: 150}] : styles.rect1}>
            <RenderJadwal />
          </View>
                 
          <View style={styles.rect1}>       
            <Text style={styles.jadwalTerpilih}>Jadwal Terpilih :</Text>
            <RenderJadwalTerpilih />
          </View>

          <View style={styles.btnlanjutStack}>
            <Btnlanjut
              style={styles.btnlanjut}
              page="LayananKhusus"
              handleNext={handleNext}
            />
          </View>
        </View>
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
              <Header style={styles.header} props={props} />
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
                      <Text style={styles.pilihanJadwal}>PILIHAN{"\n"}JADWAL</Text>
                      <RenderNakesDetail />
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
    justifyContent: "space-around",
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
  pilihanJadwal: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center"
  },
  group2: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '4%'
  },
  rect2: {
    flex: 0.8,
    padding: '2%',
    alignSelf: 'center',
    backgroundColor: "rgba(80,227,194,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 100
  },
  namanakes1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    textAlign: "center"
  },
  kalendar: {
    backgroundColor: "rgba(189,16,224,1)",
    marginTop: '5%',
  },
  calendar: {
    width: '100%',
    height: 'auto',
  },
  rect1: {
    flex: 1,
    marginTop: '2%',
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 10
  },
  jadwalTersedia: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  group4: {
    flex: 1,
    flexDirection: 'row',
  },
  radio: {
    flex: 0.1
  },
  jam: {
    flex: 0.3,
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: 'center'
  },
  btnSelect: {
    flex: 0.1,
    alignItems: 'center',
    backgroundColor: "#41ABFC",
    borderRadius: 10
  },
  btnSelectDisabled: {
    flex: 0.1,
    alignItems: 'center',
    backgroundColor: "#999",
    borderRadius: 10
  },
  labelBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  jadwalTerpilih: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  group6: {
    justifyContent: "space-between",
    marginTop: '2%'
  },
  jadwalKe1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12
  },
  rect4: {
    backgroundColor: "#E6E6E6",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 100,
    alignSelf: "stretch"
  },
  group9: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textInput: {
    flex: 0.9,
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 15,
    padding: '2%',
    marginLeft: '2%'
  },
  icon: {
    flex: 0.1,
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    padding: '1%'
  },
  btnlanjutStack: {
  },
  btnlanjut: {
    flex: 1,
    padding: '2%',
    marginTop: '5%',
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,1)"
  },
  footer: {
    height: '10%'
  }
});

export default LayananKhusus;
