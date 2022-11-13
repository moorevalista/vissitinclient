import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
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

export default function Laporan(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReport, setDataReport] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
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

    return () => {
      setRefreshing(false);
    }

    //wait(2000).then(() => setRefreshing(false));
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

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  const setDataSource = async () => {
    success = await getAllReport();

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
    }
    return(true);
  }

  useEffect(() => {
    if(filterText !== '') {
      setPage(0);
      getFilterData(filterText);
    }else {
      setPage(0);
      setDataReport('');
      setFilter(false);
      getAllReport();
    }
  }, [filterText]);

  async function getFilterData(value) {
    //await console.log(page);
    await setDataReport('');
    await setFilter(true);
    await getFilterReport(value);
  }

  const refreshData = async () => {
    if(filterText === '' && filter) {
      await setPage(0);
      await setDataReport('');
      await setFilter(false);
      await setFilterText('');
      getAllReport();
    }else if(filterText === '' && !filter) {
      getAllReport();
    }else {
      getFilterReport(filterText);
    }
  }

  const getFilterReport = async (value) => {
    //console.log('Filter ', value);
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
      filter: value
    });

    success = await formValidation.getFilterReport(params, page, 10);
    
    if(success.status === true) {
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        //setDataReport(success.res.data);
        try {
          if(success.res.data !== undefined) {
            if(!filter) {
              await setDataReport(oldData => [...oldData, ...success.res.data]);
              await setPage(page + 1);
            }else {
              await setDataReport(success.res.data);
              await setPage(page + 1);
            }
            setFilter(false);
            //setDataReport(oldData => [...oldData, ...success.res.data]);

            //setPage(page + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  const getAllReport = async () => {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getAllReport(params, page, 10);
    
    if(success.status === true) {
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {
        //formValidation.showError(success.res.messages);
      }else {
        //setDataReport(success.res.data);
        try {
          if(success.res.data !== undefined) {
            setDataReport(oldData => [...oldData, ...success.res.data]);

            setPage(page + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  function RenderAllReport() {
    const newItems = dataReport;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id_referensi}
            onPress={item.id_paket === '1' ? () => openReport(item.id_jadwal) : () => openReportKhusus(item.id_detail)}>
            <View style={styles.Chat_label}>
              <View style={styles.Blockpesan}>
                <Text style={styles.Txt1032}>{item.nakes}</Text>
                <Text style={styles.Txt810}>{item.order_type.toUpperCase()} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={styles.Txt2910}>
                  {moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}
                </Text>
                <Text style={[styles.Txt2910, {fontWeight: 'bold'}]}>
                  {item.keluhan_utama}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.Chat_label}>
          <View style={styles.Blockpesan}>
            <Text style={[styles.Txt1032, {fontSize: 12}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  //get detail report
  const openReport = async (id) => {
    const laporan = dataReport.filter(
      item => item.id_jadwal === id
    )

    props.navigation.navigate('laporanDetail', { base_url: formValidation.base_url, detailLaporan: laporan });
  }

  const openReportKhusus = async (id) => {
    const laporan = dataReport.filter(
      item => item.id_detail === id
    )

    props.navigation.navigate('laporanDetail', { base_url: formValidation.base_url, detailLaporan: laporan });
  }

  return (
    !loading ?
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
            <View style={styles.GroupTab}>
              <View style={styles.Tab_laporan}>
                <View style={styles.Form_cari}>
                  <TextInput
                    style={styles.Txt657}
                    placeholder="Cari Laporan..."
                    placeholderTextColor="rgba(0,0,0,1)"
                    onEndEditing={(value) => {
                      setPage(0);
                      setFilterText(value.nativeEvent.text);
                    }}
                    defaultValue={filterText}
                  />
                </View>
                {/*<TouchableOpacity style={styles.Tbl_cari} onPress={() => null}>
                  <Text style={styles.Txt348}>Cari</Text>
                </TouchableOpacity>*/}
              </View>
            </View>

            <View style={styles.formReport}>
              <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={refreshData}
                    /*refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }*/
                  >

                <View style={styles.Laporan1}>
                  <View style={styles.Group284}>
                    <View style={styles.Group213}>
                      <RenderAllReport />
                      {shouldFetch ? <ActivityIndicator style={styles.group1} size="small" color="#0000ff" /> : <></>}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </>
      </TouchableWithoutFeedback>
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
    backgroundColor: "white",
    backgroundColor: 'rgba(54,54,54,1)',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
  },
  formReport: {
    flex: 1,
    // paddingTop: 10,
    flexDirection: 'column',
    paddingHorizontal: '2%'
  },


  Laporan1: {
    flex: 1,
    display: 'flex',
  },
  Group284: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  Group213: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  GroupTab: {
    paddingHorizontal: '2%',
    paddingVertical: '2%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Tab_laporan: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: 'rgba(218,218,218,1)',
    padding: 5
  },
  Form_cari: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Txt657: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
    paddingHorizontal: 10,
  },

  Tbl_cari: {
    flex: 0.2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    backgroundColor: 'rgba(36,195,142,1)',
    padding: 10
  },
  Txt348: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)'
  },

  Chat_label: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '2%',
    borderRadius: 10,
    backgroundColor: 'rgba(36,195,142,1)',
    marginBottom: 10
  },
  Blockpesan: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 285,
  },
  Txt1032: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '700',
    lineHeight: 19,
    color: 'rgba(250,250,250,1)',
    width: 241,
    marginBottom: 5,
  },
  Txt810: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(250,250,250,1)',
    width: 241,
    marginBottom: 5,
  },
  Txt2910: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(250,250,250,1)',
    width: 241,
    height: 14,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 20,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
