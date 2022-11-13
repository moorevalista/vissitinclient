import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';

import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
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
import { LocaleConfig, Calendar, CalendarList, Agenda } from 'react-native-calendars';

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan.','Peb','Mar','Apr','Mei','Jun','Jul.','Agt','Sep.','Okt.','Nop.','Des.'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min.','Sen.','Sel.','Rab.','Kam.','Jum.','Sab'],
  today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id';

export default function PilihReservasiKhusus(props) {
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

  const refRBSheet = useRef();

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await setDefaultJadwal();
    
    !success ? setRefreshing(false):'';
    //setLoadingSave(success);

    return () => {
      setRefreshing(false);
    }

    //wait(2000).then(() => setRefreshing(false));
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
  },[]);

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

  useEffect(() => {
    if(dataNakes && selectedDate === today) {
      setDefaultJadwal();
    }
  },[dataNakes, selectedDate]);

  const setDefaultJadwal = async () => {
    //setLoadingSave(true);
    //await setSelectedDate(today);
    await setWaktuBooking('');
    await getJadwalKhusus(today);
    await checkJadwal(moment(today).format('YYYY-MM-DD'));
    //setLoadingSave(false);
    return(false);
  }

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
              <View key={jadwal} style={styles._0800(layout)}>
                <TouchableOpacity style={styles.Box1} onPress={() => onSelectTime(jadwal)}>
                  <Text style={{flex: 0.8, paddingVertical: 2}}>{jadwal + ' WIB'}</Text>

                  {jadwal === waktuBooking ?
                  <TouchableOpacity
                    style={!buttonAddJadwal ? styles.btnSelect : styles.btnSelectDisabled}
                    disabled={buttonAddJadwal}
                    onPress={() => {
                      onConfirm();
                      refRBSheet.current.close();
                    }}>
                    <Text style={styles.labelBtn}>+</Text>
                  </TouchableOpacity>
                  :<></>}

                </TouchableOpacity>
              </View>
            )
          })
        })

        if(rowTime.length > 0) {
          return (
            Platform.OS === "ios" ?
              <View key={item.id_nakes} style={{marginVertical: 20}}>
                <Text style={styles.jadwalTersedia}>Jadwal Tersedia :</Text>
                {rowTime}
              </View>
              :
              <View key={item.id_nakes} style={{marginVertical: 20}}>
                <Text style={styles.jadwalTersedia}>Jadwal Tersedia :</Text>
                {rowTime}
              </View>
          )
        }else {
          return (
            <View key={item.id_nakes} style={{marginVertical: 20}}>
              <Text style={[styles.jadwalTersedia, {fontStyle: 'italic'}]}>Jadwal Tidak Tersedia...</Text>
            </View>
          )
        }
      })
    }else {
      return (
        <View style={{marginVertical: 20}}>
          <Text style={[styles.jadwalTersedia, {fontStyle: 'italic'}]}>Jadwal Tidak Tersedia...</Text>
        </View>
      )
    }
  }

  //render jadwal yang dipilih
  function RenderJadwalTerpilih() {
    const newItems = jadwalTerpilih;

    if(newItems) {
      return newItems.map((item, index) => {
        let rowTerpilih = [];
        let newIndex = index + 1;
        let periode = "Jadwal Ke - " + newIndex;

        rowTerpilih.push(
          <View key={item.tgl + '_' + item.waktu} style={styles._0800(layout)}>
            <View style={styles.Box}>
              <TextInput editable={false} placeholder={periode} style={{flex: 1}}>{(item.tgl !== '' ? moment(item.tgl).format('dddd') + ', ' + moment(item.tgl).format('DD-MM-YYYY') + ' | ' : '') + (item.waktu !== '' ? 'Pukul ' +  item.waktu + ' WIB':'')}</TextInput>

              {item.tgl !== '' ? 
                <TouchableOpacity
                  onPress={() => onRemove(index)}
                >
                  <SimpleLineIconsIcon
                    name="close"
                    style={styles.icon}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  <View style={styles.Tbl_subBantuan}>
                    <Icons label="Panah" name="ios-calendar" />
                  </View>
                </TouchableOpacity>
              }

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
          <View style={styles.Group554}>
            <View>
              <View style={styles.Group4010(layout)}>
                <Text style={styles.Txt647}>{nakes.first_name + ' ' + nakes.middle_name + ' ' + nakes.last_name}</Text>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>{jenisLayanan}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Pendidikan : </Text>
                  <Text style={styles.Txt1610}>{nakes.pendidikan}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Sertifikasi : </Text>
                  <Text style={styles.Txt1610}>{nakes.sertifikasi}</Text>
                </View>
                <View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Tempat Praktik : </Text>
                  <Text style={styles.Txt1610}>{nakes.company}</Text>
                </View>
                {/*<View style={styles.card(layout)}>
                  <Text style={styles.Txt1610}>Jarak : </Text>
                  <Text style={styles.Txt1610}>{dataNakes.jarak}</Text>
                </View>*/}
              </View>
            </View>
          </View>
      )
    }else {
      return (
        <></>
      )
    }
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

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
          }}
          name={name}
        />
      );
    }
  };

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
            <SafeAreaView style={styles.container}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View
                  style={styles.Profil_nakes}
                  onLayout={event => setLayout(event.nativeEvent.layout)}>
                  

                  <View
                    style={{
                      //alignItems: 'center',
                      //borderWidth: 1
                    }}>
                    <RenderNakesDetail />
                    <Text style={styles.Txt885}>PILIH JADWAL</Text>

                    <RBSheet
                      ref={refRBSheet}
                      closeOnDragDown={false}
                      closeOnPressMask={false}
                      animationType="fade"
                      customStyles={{
                        wrapper: {
                          backgroundColor: 'transparent',
                        },
                        container: {
                          //backgroundColor: 'rgba(36,195,142,1)',
                          backgroundColor: "rgba(255,255,255,1)",
                          //backgroundColor: 'rgba(52,65,70,1)',
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          height: '80%',
                          borderWidth: 0.5,
                          borderColor: 'rgba(36,195,142,1)'
                        },
                        draggableIcon: {
                          backgroundColor: 'transparent',
                        },
                      }}>

                      <Spinner
                        visible={loadingSave}
                        textContent={''}
                        textStyle={styles.spinnerTextStyle}
                        color="#236CFF"
                        overlayColor="rgba(255, 255, 255, 0.5)"
                      />
                      <ScrollView
                        horizontal={false}
                        contentContainerStyle={styles.scrollArea_contentContainerStyle}
                      >
                        <View style={styles.Email_bantuan}>
                          <View style={styles.wrapperJangan}>
                            <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                              <View style={styles.Tbl_iconPanah}>
                                <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                              </View>
                            </TouchableOpacity>
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

                          <RenderJadwal />
                        </View>
                      </ScrollView>
                    </RBSheet>

                    <View>
                      {/*<Text style={styles.jadwalTersedia}>Jadwal Terpilih :</Text>*/}
                      <RenderJadwalTerpilih />
                    </View>
                    

                    <View style={{marginTop: 20}}>
                      <View style={styles.warning}>
                        <Icons label="Panah" name="warning" />
                        <Text style={styles.Txt2878(layout)}>
                          Tentukan tanggal dan waktu masing-masing jadwal layanan sesuai
                          kebutuhan anda mengikuti ketersediaan jadwal tenaga professional
                          kami.
                        </Text>
                      </View>
                      <View style={styles.Group1039}>
                        {/*<TouchableOpacity
                          style={styles.Btn_lanjut(layout)}
                          onPress={() => alert('Batal')}>
                          <Text style={styles.Txt721}>BATAL</Text>
                        </TouchableOpacity>*/}
                        <TouchableOpacity
                          style={styles.Btn_lanjut1(layout)}
                          onPress={handleNext}>
                          <Text style={styles.Txt721}>LANJUT</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
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
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  btnSelect: {
    flex: 0.2,
    alignItems: 'center',
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 2
  },
  btnSelectDisabled: {
    flex: 0.2,
    alignItems: 'center',
    backgroundColor: "#999",
    borderRadius: 5,
    paddingVertical: 2
  },
  labelBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  kalendar: {
    backgroundColor: "rgba(189,16,224,1)",
    marginTop: '5%',
  },
  calendar: {
    width: '100%',
    height: 'auto',
  },
  jadwalTersedia: {
    alignSelf: 'center',
    color: "#121212",
    paddingVertical: 10
  },
  icon: {
    flex: 0.1,
    color: "rgba(0,0,0,1)",
    //backgroundColor: "#41ABFC",
    fontSize: 16,
    //padding: '1%'
  },
  Email_bantuan: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  wrapperJangan: {
    flexDirection: 'row',
    //paddingTop: 20,
    //paddingBottom: 20,
    alignSelf: 'flex-end',
  },
  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    //backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    //marginBottom: 10,
    marginTop: 10,
    width: 30,
    height: 30,
  },
  Group554: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Profil_nakes: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    //backgroundColor: 'rgba(0,0,0,1)',
    backgroundColor: 'rgba(52,65,70,1)',
    width: layout.width - 70,
  }),

  card: layout => ({
    flexDirection: 'row',
    maxWidth: layout.width - 150,
  }),
  Txt1610: {
    fontSize: 12,
    paddingBottom: 3,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
  },
  Txt287: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  Txt2878: layout => ({
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    paddingLeft: 10,
    maxWidth: layout.width - 100,
  }),
  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },

  Txt885: {
    paddingTop: 25,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  _0800: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 20,
    //width: layout.width - 120,
  }),

  Group1039: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: 10,
  },
  Btn_lanjut: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 19,
    paddingRight: 19,
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    width: layout.width - 250,
  }),
  Txt721: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Box1: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    //alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 60,
    //backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,66,105,0.28)',
  },
  Box: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    //backgroundColor: 'rgba(36,195,142,0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,66,105,0.28)',
  },
  warning: {flexDirection: 'row', paddingBottom: 20},

  Btn_lanjut1: layout => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    width: layout.width - 180,
  }),
});
