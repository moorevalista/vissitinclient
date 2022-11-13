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
  Linking, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
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
import moment from 'moment-timezone';
import 'moment/locale/id';

export default function DataFaskesProfile(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);

  //parameter dari prev page
  const [id_faskes, setId_faskes] = useState('');
  const [dataFaskes, setDataFaskes] = useState('');
  const [profesiFaskes, setProfesiFaskes] = useState('');

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

  const setDataSource = async () => {
    await setId_faskes(props.route.params.id_faskes);
    await setDataFaskes(props.route.params.dataFaskes);
    await getProfesiFaskes(props.route.params.id_faskes);

    await setLoading(false);
  }

  const getProfesiFaskes = async (e) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_faskes: e,
      token: dataLogin.token
    });

    success = await formValidation.getProfesiFaskes(params);

    if(success.status === true) {
      await setProfesiFaskes(success.res);
      //console.log(success.res);
    }
    //setLoading(false);
  }

  function RenderFaskesDetail() {
    const faskes = dataFaskes[0];

    if(faskes) {
      let thumbLogo = props.route.params.base_url + 'data_assets/logoFaskes/' + faskes.logo_faskes;
      let thumbFoto = props.route.params.base_url + 'data_assets/fotoFaskes/' + faskes.foto_faskes;
      return (
        <View style={styles.Box_faskes_profile}>
          <View style={styles.Group314}>
            <Image
              style={styles.Logo_partner}
              source={{uri: thumbLogo}}
              resizeMode="cover"
            />
            <Text style={styles.Txt084}>{faskes.faskes_name}</Text>
            <Text style={styles.Txt497}>{faskes.about_faskes}</Text>
            <View style={styles.Group633}>
              {/*<View style={styles.Tbl_informasi}>
                <Icons label="Panah" name="ios-call" />
              </View>*/}

              <TouchableOpacity style={styles.Tbl_informasi} onPress={() => openMaps(faskes.lat, faskes.lon)}>
                <Icons label="Panah" name="location" />
              </TouchableOpacity>
            </View>
            <Image
              style={styles.Clinic2}
              source={{uri: thumbFoto}}
              resizeMode="cover"
            />
          </View>
        </View>
      )
    }
  }

  function RenderProfesiFaskes() {
    const profesi = profesiFaskes.data;

    if(profesi) {
      return profesi.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_profesi} onPress={() => openLayanan(item.id_profesi, item.profesi.toUpperCase())}>
            <View style={styles.Btn_layanan1}>
              <Text style={styles.Txt386}>{item.profesi.toUpperCase()}</Text>
              <View style={styles.Tbl_iconPanah}>
                <Icons label="Panah" name="ios-chevron-forward" />
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={{marginTop: '4%'}}><Text style={{fontStyle: 'italic'}}>Mohon maaf, belum ada layanan yang tersedia di Faskes ini...</Text></View>
      )
    }
  }

  const openLayanan = async(id, layanan) => {
    props.navigation.navigate('rootService', { base_url: props.route.params.base_url, id_profesi: id, jenisLayanan: layanan, id_faskes: id_faskes, dataFaskes: dataFaskes });
  }

  function openMaps(lat, lng) {
    // const lat = '-5.3924295';
    // const lng = '105.3129731';
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
  }

  /* start untuk data layanan faskes */
  const dataLayanan = [
    {
      key: '1',
      namaLayanan: 'FISIOTERAPI',
      onPress: 'LayananReservasiPribadi',
    },
    {
      key: '2',
      namaLayanan: 'OKUPASI TERAPI',
      onPress: null,
    },
    {
      key: '3',
      namaLayanan: 'TERAPI WICARA',
      onPress: null,
    },
  ];
  /* end untuk data layanan faskes */
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
      >
        <View style={styles.Layanan_faskes_profile}>
          <RenderFaskesDetail />
          <RenderProfesiFaskes />
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
  Layanan_faskes_profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 25,
  },
  Group314: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  Box_faskes_profile: {
    marginBottom: 25,
    borderRadius: 10,
    width: 300,
    backgroundColor: 'rgba(145,225,199,1)',
  },

  Logo_partner: {
    width: 60,
    height: 60,
    marginVertical: 10,
    borderRadius: 100,
  },
  Txt497: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 9,
    maxWidth: '80%',
  },
  Group633: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'space-between',
    marginBottom: 16,
  },
  Tbl_informasi: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    width: 30,
    height: 30,
    // marginHorizontal: 5,
  },

  Clinic2: {
    width: 300,
    height: 150,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  Txt084: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    paddingBottom: 10,
  },

  Btn_layanan1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(217,217,217,1)',
    width: 300,
  },
  Txt386: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    width: 195,
    marginRight: 50,
  },
  Tbl_arrow: {
    width: 32,
    height: 32,
  },

  Txt386: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    width: 195,
    marginRight: 50,
  },
  Tbl_arrow: {
    width: 32,
    height: 32,
  },

  Txt386: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    width: 195,
    marginRight: 50,
  },
  Tbl_arrow: {
    width: 32,
    height: 32,
  },
});
