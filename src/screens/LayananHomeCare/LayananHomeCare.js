import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import {
  IconCaregiver,
  IconFisioterapi,
  IconOkupasiTerapi,
  IconPerawat,
  IconPsikolog,
  IconTerapiWicara,
} from '../../assets';
import RBSheet from 'react-native-raw-bottom-sheet';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

export default function LayananHomeCare(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  //const [loadingFetch, setLoadingFetch] = useState(true);

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
    //setLoadingFetch(true);
    //await getJadwal();
    setLoading(false);
  }

  const openFisioterapi = async() => {
    props.navigation.navigate('rootServiceHomeCare', { base_url: props.route.params.base_url, id_profesi: 1, jenisLayanan: 'FISIOTERAPI' } );
  }

  const openOkupasiterapi = async() => {
    props.navigation.navigate('rootServiceHomeCare', { base_url: props.route.params.base_url, id_profesi: 2, jenisLayanan: 'OKUPASI TERAPI' } );
  }

  const openTerapiwicara = async() => {
    props.navigation.navigate('rootServiceHomeCare', { base_url: props.route.params.base_url, id_profesi: 3, jenisLayanan: 'TERAPI WICARA' } );
  }

  const openService = async() => {
    formValidation.showError('Layanan belum tersedia...');
  }

  /* start untuk tampilan layanan */
  const data = [
    {
      key: '1',
      title: 'FISIOTERAPI',
      gambar: IconFisioterapi,
      onPress: openFisioterapi,
    },
    {
      key: '2',
      title: 'OKUPASI TERAPI',
      gambar: IconOkupasiTerapi,
      onPress: openOkupasiterapi,
    },
    {
      key: '3',
      title: 'TERAPI WICARA',
      gambar: IconTerapiWicara,
      onPress: openTerapiwicara,
    },
    {
      key: '4',
      title: 'PERAWAT',
      gambar: IconPerawat,
      onPress: openService,
    },
    {
      key: '5',
      title: 'PSIKOLOG',
      gambar: IconPsikolog,
      onPress: openService,
    },
    {
      key: '6',
      title: 'CAREGIVER',
      gambar: IconCaregiver,
      onPress: openService,
    },
  ];

  const [numColumns, setNumColumns] = useState(3);
  const refRBSheet = useRef();

  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <item.gambar />;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          item.onPress == null
            ? alert('belum ada layanan')
            : item.onPress()
        }>
        <View style={styles.Ico_fisio}>
          <View style={styles.Group837}>
            <item.gambar width={60} height={64} />
          </View>
          <View style={styles.Group573}>
            <Text style={styles.Txt660}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return data;
  };
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
      <View style={styles.Layanan_terapi}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <FlatList
            data={formatRow(data, numColumns)}
            ListEmptyComponent={null}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            numColumns={numColumns}
          />
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
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    paddingHorizontal: '4%',
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

  Ico_fisio: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  Group837: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(239,238,237,1)',
    width: 100,
  },

  Group573: {
    paddingHorizontal: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(85,80,87,1)',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 100,
    height: 80,
  },
  Txt660: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
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
