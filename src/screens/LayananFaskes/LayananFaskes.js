import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

export default function LayananFaskes(props) {
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

    if(newItems.length > 0) {
      return newItems.map((item) => {
        let thumbLogo = props.route.params.base_url + 'data_assets/logoFaskes/' + item.logo_faskes;
        return (
          <TouchableOpacity key={item.id_faskes} onPress={() => openProfileFaskes(item.id_faskes)}>
            <View style={styles.By_faskes}>
              <View style={styles.Group3310}>
                <View style={styles.Group4010(layout)}>
                  <View style={{justifyContent: 'flex-end'}}>
                    <Image
                      source={{uri: thumbLogo}}
                      resizeMode="cover"
                      style={styles.Useravatar}
                    />
                  </View>
                  <View
                    style={{
                      maxWidth: '80%',
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.Txt647}>{item.faskes_name}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Icons label="Panah" name="location" />
                      <Text style={styles.Txt1610}>{item.nama_kota}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Icons label="Panah" name="ios-call" />
                      <Text style={styles.Txt1610}>{item.phone_number}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Icons label="Panah" name="ios-map-outline" />
                      <Text style={styles.Txt1610}>{parseFloat(item.distance).toFixed(2)} Km</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.Group354}>
                  <Icons
                    label="Panah"
                    name="chevron-forward"
                    color="rgba(255, 255, 255, 1)"
                  />
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

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 14,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };

  return (
    !loading ?
    <SafeAreaView style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
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
        <View
          style={styles.Layanan_terapi}
          onLayout={event => setLayout(event.nativeEvent.layout)}>
          <RenderFaskes />
          {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
        </View>
      </ScrollView>
    </SafeAreaView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_terapi: {
    top: 25,
    flexDirection: 'column',
    paddingHorizontal: 20,
    width: '100%',
  },

  By_faskes: {
    paddingBottom: 25,
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(36,195,142,0.5)',
    width: layout.width - 50,
  }),
  Txt647: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    marginBottom: 2,
  },

  Group3310: {
    display: 'flex',
    flexDirection: 'row',
  },

  Txt1610: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    paddingLeft: 5,
  },

  Group354: {
    justifyContent: 'center',
    paddingLeft: 1,
    paddingRight: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(54,54,54,1)',
  },

  Useravatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
});
