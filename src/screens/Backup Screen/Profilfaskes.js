import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, Image, Linking,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Header from "../components/Header";
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

function Profilfaskes(props) {
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
        <View style={styles.scrollArea}>
          <View style={styles.boxImage}>
            <Image
              source={{uri: thumbLogo}}
              resizeMode="cover"
              style={styles.imageLogo}
            />
          </View>
          <View style={styles.groupFaskes}>
            <Text style={styles.labelFaskes}>{faskes.faskes_name}</Text>
            <Text style={styles.labelDescription}>{faskes.about_faskes}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={openMaps}>
            <View style={styles.rectButton}>
              <Text style={styles.labelButton}>Lihat Map</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.boxImage}>
            <Image
              source={{uri: thumbFoto}}
              resizeMode="cover"
              style={styles.imageFoto}
            />
          </View>
          <View style={styles.groupLayanan}>
            <RenderProfesiFaskes />
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
          <TouchableOpacity key={item.id_profesi} style={styles.rect} onPress={() => openLayanan(item.id_profesi, item.profesi.toUpperCase())}>
            <Text style={styles.labelLayanan}>{item.profesi.toUpperCase()}</Text>
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

  function openMaps() {
    const lat = '-5.3924295';
    const lng = '105.3129731';
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
  }

  return (
    !loading ?
    <>
        <Header style={styles.header} props={props} title={"Layanan Faskes"} />
        <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
            >
          <View style={styles.container}>
            <RenderFaskesDetail />
          </View>
        </ScrollView>
      <View style={styles.footer}>
        <Footermenu props={props} dataLogin={dataLogin} />
      </View>
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
    paddingBottom: '25%',
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
  header: {
    height: 75
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
    padding: '2%',
    paddingTop: '5%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  boxImage: {
    flex: 1,
    alignItems: 'center',
    marginBottom: '2%'
  },
  imageLogo: {
    width: 85,
    height: 85,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000000",
  },
  imageFoto: {
    flex: 1,
    width: 322,
    height: 218,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000000",
  },
  groupFaskes: {
    padding: '2%',
    marginBottom: '2%'
  },
  labelFaskes: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: '2%'
  },
  labelDescription: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    letterSpacing: 2,
    textAlign: "center"
  },
  button: {
    flex: 0.6,
    alignItems: 'center',
    padding: '2%'
  },
  rectButton: {
    alignItems: "center",
    padding: '2%',
    paddingLeft: '4%',
    paddingRight: '4%',
    backgroundColor: "rgba(0,0,0,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 10
  },
  labelButton: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  groupLayanan: {
    padding: '4%',
    justifyContent: "space-around"
  },
  rect: {
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20,
    padding: '2%',
    marginBottom: '2%'
  },
  labelLayanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 17,
    letterSpacing: 2,
    alignSelf: "center"
  },
  footer: {
    height: '10%'
  }
});

export default Profilfaskes;
