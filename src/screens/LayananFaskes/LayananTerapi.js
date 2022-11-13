import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {IconFrame, IconHospital} from '../../assets';
import IconPanah from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorages from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

export default function LayananTerapi(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);

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
      setCurrentDataPasien();
    }
  },[dataLogin]);

  const setCurrentDataPasien = async () => {
    setLoading(false);
  }

  const openFaskesServices = async() => {
    props.navigation.navigate('layananFaskes', { base_url: props.route.params.base_url } );
  }

  const openHomeServices = async() => {
    props.navigation.navigate('homeServices', { base_url: props.route.params.base_url } );
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  const refRBSheet = useRef();

  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(255, 255, 255, 1)',
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
      <View
        style={styles.Layanan_terapi}
        onLayout={event => setLayout(event.nativeEvent.layout)}>
        <View>
          <TouchableOpacity
            onPress={openFaskesServices}>
            <View style={styles.By_faskes}>
              <View style={styles.Group3310}>
                <View style={styles.Group4010(layout)}>
                  <View style={{justifyContent: 'flex-end', marginBottom: -11}}>
                    <IconHospital />
                  </View>
                  <View
                    style={{
                      maxWidth: '80%',
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.Txt647}>LAYANAN KLINIK/FASKES</Text>
                    <Text style={styles.Txt1610}>
                      Melayani kebutuhan reservasi jadwal layanan kesehatan di
                      Faskes, Klinik atau, Griya terdekat.
                    </Text>
                  </View>
                </View>
                <View style={styles.Group354}>
                  <Icons label="Panah" name="chevron-forward" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openHomeServices}>
            <View style={styles.By_faskes}>
              <View style={styles.Group3310}>
                <View style={styles.Group4010(layout)}>
                  <View style={{justifyContent: 'flex-end', marginBottom: -11}}>
                    <IconFrame />
                  </View>
                  <View
                    style={{
                      maxWidth: '80%',
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.Txt647}>LAYANAN HOME CARE / VISIT</Text>
                    <Text style={styles.Txt1610}>
                      Pilih dan tentukan sendiri Tenaga Kesehatan Professional
                      serta jenis layanan yang anda butuhkan.
                    </Text>
                  </View>
                </View>
                <View style={styles.Group354}>
                  <Icons label="Panah" name="chevron-forward" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.By_faskes}>
            <Text style={styles.Txt398}>Informasi :</Text>
            <Text style={styles.multiple12}>
              Untuk setiap layanan Home care atau Visit yang anda pilih
              merupakan layanan praktik mandiri dari setiap tenaga kesehatan
              professional yang teraffiliasi dengan fasilitas layanan kesehatan
              terdaftar serta telah melalui proses verifikasi dan kelayakan
              profesi.
            </Text>
            <Text style={styles.multiple12}>
              Untuk informasi dan ketentuan layanan lebih lengkap dapat membaca
              <Text style={{color: 'rgba(0,0,0,1)', fontWeight: 'bold'}}>
                {' '}
                Syarat dan Ketentuan
              </Text>{' '}
              Layanan yang berlaku di platform vissit.in.
            </Text>
          </View>
        </View>
        {/*<View style={styles.Tbl_bantuan}>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <View style={styles.Tbl_subBantuan}>
              <Text style={styles.Txt424}>Bantuan</Text>

              <Icons label="Panah" name="mail-sharp" />
            </View>
          </TouchableOpacity>
        </View>*/}
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
              backgroundColor: 'rgba(36,195,142,1)',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: '50%',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <View style={styles.Email_bantuan}>
            <View style={styles.wrapperJangan}>
              <View style={styles.Kirim_email}>
                <Text style={styles.multiple}>Jangan ragu!</Text>
                <Text style={styles.multiple1}>
                  Sampaikan pertanyaan anda disini, Customer Care kami akan
                  segera menghubungi anda.
                </Text>
              </View>
              <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                <View style={styles.Tbl_iconPanah}>
                  <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => null} />
              }>
              <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                <View style={styles.Box}>
                  <TextInput style={styles.Txt843} placeholder="Nama Lengkap" />
                </View>
                <View style={styles.Box}>
                  <TextInput style={styles.Txt843} placeholder="Email Aktif" />
                </View>

                <View style={styles.Box}>
                  <TextInput
                    numberOfLines={3}
                    multiline={true}
                    style={styles.Txt6108}
                    maxLength={255}
                    placeholder="Pertanyaan"
                  />
                </View>
                <View style={{alignItems: 'flex-end', marginBottom: 20}}>
                  <TouchableOpacity onPress={() => null}>
                    <View style={styles.Btn_tambah}>
                      <Text style={styles.Txt6105}>Kirim</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </RBSheet>
      </View>
      <FlashMessage position="top" />
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_terapi: {
    top: 25,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  By_faskes: {
    paddingBottom: 25,
  },

  Group4010: layout => ({
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 11,
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
  },

  Group354: {
    paddingTop: 38,
    paddingBottom: 34,
    paddingLeft: 1,
    paddingRight: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(54,54,54,1)',
  },

  Txt398: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 4,
  },
  multiple12: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    textAlign: 'justify',
    color: 'black',
    paddingBottom: 5,
  },

  Tbl_subBantuan: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 23,
    paddingRight: 19,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
  },
  Tbl_bantuan: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: '20%',
  },
  Txt424: {
    fontSize: 16,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 40,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  Kirim_email: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  multiple: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  multiple1: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
  },

  Box: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 1)',
    marginVertical: 5,
  },
  Txt843: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    //lineHeight: 22,
    color: 'rgba(0,0,0,1)',
  },

  Txt6108: {
    height: 80,
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    //lineHeight: 22,
    color: 'rgba(0,0,0,1)',
  },

  Btn_tambah: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt6105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    marginBottom: 10,
    marginTop: -10,
    width: 30,
    height: 30,
  },
});
