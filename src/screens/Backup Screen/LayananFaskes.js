import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { RefreshControl, Image, StyleSheet, View, Text, ScrollView, SafeAreaView, useColorScheme, TouchableOpacity, ActivityIndicator } from "react-native";
//import HeaderPasien from "../components/HeaderPasien";
import Header from "../components/Header";
import Footermenu from "../components/Footermenu";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

function LayananFaskes(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);

  //dataset dari database
  const [pasienData, setPasienData] = useState([]);
  const [faskesData, setFaskesData] = useState([]);

  //untuk open faskes detail
  const [id_faskes, setId_faskes] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
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
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(loadingFetch === true) {
      getDataFaskes();
      setLoadingFetch(false);
    }

    return () => {
      setLoadingFetch(false);
    }
  },[loadingFetch]);

  const setDataSource = async () => {
    await getDataPasien();
    await setLoadingFetch(true);
  }

  const getDataPasien = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getDataPasien(params);

    if(success.status === true) {
      await setPasienData(success.res);
    }
  }

  const getDataFaskes = async () => {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      lat: pasienData.lat,
      lon: pasienData.lon,
      token: dataLogin.token
    });

    success = await formValidation.getDataFaskes(params, page, 10);
    //console.log(success);

    if(success.status === true) {
      //await setFaskesData(success.res);
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {

      }else {
        try {
          if(success.res !== undefined) {
            setFaskesData(oldData => [...oldData, ...success.res.data]);

            setPage(page + 1);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      //console.log(success.res);
    }
    setLoading(false);
  }

  const openProfileFaskes = async (e) => {
    await setId_faskes(e);
    const dataFaskes = faskesData.filter(
      item => item.id_faskes === e
    );
    props.navigation.navigate('profilFaskes', { base_url: props.route.params.base_url, id_faskes: e, dataFaskes: dataFaskes });
  }

  function RenderFaskes() {
    const newItems = faskesData;

    if(newItems) {
      return newItems.map((item) => {
        let thumbLogo = props.route.params.base_url + 'data_assets/logoFaskes/' + item.logo_faskes;
        return (
          <TouchableOpacity key={item.id_faskes} style={styles.group} onPress={() => openProfileFaskes(item.id_faskes)}>
            <View style={styles.rect}>
              <View style={styles.imageRow}>
                <Image
                  source={{uri: thumbLogo}}
                  resizeMode="cover"
                  style={styles.image}
                />
                <View style={styles.faskesColumn}>
                  <Text style={[styles.faskesName, {fontWeight: 'bold'}]}>{item.faskes_name}</Text>
                  <Text style={styles.label}>{item.nama_kota}</Text>
                  <Text style={styles.label}>No. Telp : {item.phone_number}</Text>
                  <Text style={styles.label}>Jarak : {parseFloat(item.distance).toFixed(2)} Km</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={{marginTop: '4%'}}><Text style={{fontStyle: 'italic'}}>Mohon maaf, kami tidak dapat menemukan Faskes yang tersedia di sekitar anda...</Text></View>
      )
    }
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      {/*<View style={styles.headerPasien}>
        <HeaderPasien dataLogin={dataLogin} />
      </View>*/}
      <Header style={styles.header} props={props} title={'Faskes'} />
        <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              onScrollEndDrag={getDataFaskes}
              /*refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }*/
            >
          <View style={styles.container}>
            <Text style={styles.fasilitasKesehatan}>
              FASILITAS{"\n"}KESEHATAN
            </Text>
            <View style={styles.scrollAreaStack}>
              <View style={[styles.scrollArea, styles.inner]}>
                <RenderFaskes />
                {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
              </View>
            </View>
          </View>
        </ScrollView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
      <FlashMessage position="top" />
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
  headerPasien: {
    height: '20%'
  },
  scrollArea: {
    flex: 1,
    height: 'auto',
    padding: 10
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  fasilitasKesehatan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginTop: '4%'
  },
  group: {
    height: 'auto',
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: '2%'
  },
  rect: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%'
  },
  imageRow: {
    flexDirection: "row"
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000000"
  },
  faskesName: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  faskesColumn: {
    flex: 1,
    marginLeft: '2%',
    padding: '2%'
  },
  footer: {
    height: '10%'
  },
  scrollAreaStack: {
    width: '100%',
    height: 'auto',
    flex: 1,
    padding: '2%'
  },
});

export default LayananFaskes;
