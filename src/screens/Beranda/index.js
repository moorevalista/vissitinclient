import React, { Component, useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Linking, KeyboardAvoidingView, BackHandler, ActivityIndicator
} from 'react-native';
import {FlatListSlider} from 'react-native-flatlist-slider';
import {
  IconHomeTutor,
  IconInformasiBerita,
  IconLayananAssesment,
  IconLayananDarurat,
  IconLayananKonsultasi,
  IconLayananTerapi,
} from '../../assets';

import {Header} from '../../components';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import AwesomeAlert from 'react-native-awesome-alerts';
import { CommonActions } from '@react-navigation/native';
import axios from "axios";
import FooterListener from '../../FooterListener';

export default function Beranda(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [dataIklan, setDataIklan] = useState('');
  const [itemAds, setItemAds] = useState([]);

  //untuk data reservasi
  const [dataReservasi, setDataReservasi] = useState('');
  const [id_jadwal_detail, setId_jadwal_detail] = useState('');

  const [bookingPage, setBookingPage] = useState(0);
  const [shouldFetchBooking, setShouldFetchBooking] = useState(false);
  const [fetchReservasi, setFetchReservasi] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await checkFcmToken();

    if(success) {
      // if(bookingPage > 0) {
        setLoadingFetch(true);
        refetchData();
      // }
      setRefreshing(false);
    }else {
      setRefreshing(true);
    }
    //wait(2000).then(() => setRefreshing(false));
  },[]);

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
      setCurrentDataPasien();
    }

    return () => {
      setLoading(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(fetchReservasi) {
      getReservation();
    }

    return () => {
      setFetchReservasi(false);
    }
  }, [fetchReservasi]);

  async function refetchData(e){
    setBookingPage(0);
    setDataReservasi('');
    setFetchReservasi(true);
  }

  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      if(props.route.params.onRefresh !== undefined) {
        props.route.params.onRefresh();
      }
    });

    return () => {
      unsubscribe;
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.navigation]);

  const getAds = async () => {
    let params = [];
    params.push({ base_url: formValidation.base_url, token: dataLogin.token });

    success = await formValidation.getAds(params);
    
    if(success.status === true) {
      try {
        await setDataIklan(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  const checkFcmToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if(token !== null) {
      let params = [];
      params.push({
        base_url: formValidation.base_url,
        token: token
      });

      success = await formValidation.checkToken(params);
      // console.log(success);

      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          await AsyncStorage.clear();
          try {
            const value = await AsyncStorage.getItem('loginStatePasien')
            if(!value) {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'loginScreen',
                      params: { base_url: formValidation.base_url },
                    }
                  ],
                })
              )
              return true;
            }else {
              return false;
            }
          } catch(e) {
            alert(e);
          }
        }else {
          return true;
        }
      }else {
        return false;
      }
    }
  }

  const setCurrentDataPasien = async () => {
    //setLoadingFetch(true);
    await getReservation();
    await getAds();
    setLoading(false);
  }

  const getReservation = async () => {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token
    });

    success = await formValidation.getReservation(params, bookingPage, 5);

    if(success.status === true) {
      //setDataReservasi(success.res);
      try {
        setShouldFetchBooking(false);
        if(success.res !== undefined) {
          setDataReservasi(oldData => [...oldData, ...success.res]);

          setBookingPage(bookingPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    setLoadingFetch(false);
  }

  async function handleExpand(e) {
    await setId_jadwal_detail(e);

    const dataRes = dataReservasi.filter(
      item => item.id_jadwal === e
    );

    props.navigation.navigate('notifReservasi', {
      base_url: formValidation.base_url,
      dataReservasi: dataRes,
      onRefresh: onRefresh
      //onGoBack: (
        //setActiveTab('notif')
        //onRefresh()
      //)
    });
  }

  async function handleExpandPaket(e) {
    await setId_jadwal_detail(e);

    const dataRes = dataReservasi.filter(
      item => item.id_jadwal === e
    );

    props.navigation.navigate('notifReservasi', {
      base_url: formValidation.base_url,
      dataReservasi: dataRes,
      onRefresh: onRefresh
    })
  }

  function RenderReservation() {
    const reservasi = dataReservasi;

    if(reservasi) {
      const newItems = dataReservasi.filter(
        item => (item.order_state !== 'CLOSE' && item.order_state !== 'CANCEL' && item.order_state !== 'ONGOING')
      );
      return newItems.map((item) => {
        switch(item.order_state) {
          case 'OPEN':
            status = 'Konfirmasi Nakes';
            break;
          case 'CONFIRM':
          if(item.payment_state === 'OPEN') {
            status = 'Belum dibayar';
          }else if(item.payment_state === 'DONE') {
            status = 'Aktif';
          }
            break;
          case 'REQCHECKIN':
            status = 'Nakes Check In.';
            break;
          case 'ONSITE':
            status = 'Nakes On Site';
            break;
          case 'CHECKOUT':
            status = 'Nakes Check Out';
            break;
          default:
            break;
        }
        return (
          <View key={item.id_jadwal} style={styles.Label_layanan_akhir}>
            <View style={[styles.Lbl_layanan, {width: '25%'}]}>
              <Text style={styles.Txt833_isi}>{item.order_type}</Text>
            </View>
            <View style={[styles.Lbl_layanan, {width: '35%'}]}>
            {item.id_paket === '1' ?
              <Text style={styles.Txt833_isi}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format("DD/MM/YYYY") + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
              :
              <Text style={styles.Txt833_isi}>Buka pesanan untuk melihat detail jadwal</Text>
            }
            </View>
            <View style={[styles.Lbl_layanan, {width: '40%'}]}>
              <TouchableOpacity style={styles.button(item.order_state, item.payment_state)} onPress={item.id_paket === '1' ? () => handleExpand(item.id_jadwal) : () => handleExpandPaket(item.id_jadwal) }>
                <Text style={styles.txtButton}>
                  {status}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  const openMainServices = async() => {
    setLoading(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_pasien: dataLogin.id_pasien,
      token: dataLogin.token,
    });

    success = await formValidation.getDataPasien(params);

    if(success.status === true) {
      setLoading(false);
      if(success.res.lat === '' || success.res.lon === '') {
        await formValidation.showError('Anda harus melengkapi informasi pribadi sebelum bisa melakukan reservasi.')
        props.navigation.navigate('profileScreen', { base_url: formValidation.base_url, updateData: true } );
      }else {
        props.navigation.navigate('mainServices', { base_url: formValidation.base_url } );
      }
    }else {
      setLoading(false);
      formValidation.showError('Terjadi kesalahan...');
    }
  }

  const getFaskesById = async (id) => {
    // setLoading(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_faskes: id,
      token: dataLogin.token
    });

    success = await formValidation.getFaskesById(params);
    //console.log(success);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {

      }else {
        try {
          if(success.res !== undefined) {
            // setFaskesData(success.res.data);
            props.navigation.navigate('profilFaskes', { base_url: formValidation.base_url, id_faskes: id, dataFaskes: success.res.data });
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      //console.log(success.res);
    }
    // setLoading(false);
  }

  function openUrl(link) {
    Linking.openURL(link);
  }

  const openAssessment = async() => {
    formValidation.showError('Layanan belum tersedia...');
  }

  const openPayment = async() => {
    props.navigation.navigate('payment', { url: formValidation.flipPaymentUrl + '$vissit1/#testingcreatebillonno' });
  }

  const [layoutWidth, setLayoutWidth] = useState(0);

  const [numColumns, setNumColumns] = useState(3);
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  /* start untuk tampilan layanan */
const dataLayanan1 = [
  {
    key: '1',
    title: 'Layanan Terapi',
    gambar: IconLayananTerapi,
    onPress: openMainServices,
  },
  {
    key: '2',
    title: 'Layanan Assessment',
    gambar: IconLayananAssesment,
    onPress: openAssessment,
  },
  {
    key: '3',
    title: 'Layanan Konsultasi',
    gambar: IconLayananKonsultasi,
    onPress: openAssessment,
  },
];

const dataLayanan2 = [
  {
    key: '1',
    title: 'Home Tutor',
    gambar: IconHomeTutor,
    onPress: openAssessment,
  },
  {
    key: '2',
    title: 'Informasi & Berita',
    gambar: IconInformasiBerita,
    onPress: openAssessment,
  },
  {
    key: '3',
    title: 'Layanan Darurat',
    gambar: IconLayananDarurat,
    onPress: openPayment,
  },
];

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
        <View key={index} style={[styles.item]}>
          <item.gambar width={110} height={120} />
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

  /* end untuk tampilan layanan */

  // data untuk iklan
  const images = [
    {
      // image: require('../../assets/images/ads/vissitin_ads_01.png'),
      image: 'https://apiuat.vissit.in/data_assets/ads/ads_01.png'
      //desc: 'Silent Waters in the mountains in midst of Himilayas',
    },
    {
      // image: require('../../assets/images/ads/vissitin_ads_02.png'),
      image: 'https://apiuat.vissit.in/data_assets/ads/ads_02.png'
      //desc: 'Red fort in India New Delhi is a magnificient masterpeiece of humans',
    },
  ];

  const listAds = async () => {
    await setLoading(true);
    const newItems = dataIklan;

    let options = [];
    if(newItems.length > 0) {
      options = newItems.map((item) => {
        let url = formValidation.base_url + 'data_assets/ads/' + item.file_name;
        return (
          {image: url}
        )
      });
    }
    setItemAds(options);
    await setLoading(false);
  }

  const openAds = async (e) => {
    const newItems = dataIklan;

    let data = [];
    if(newItems.length > 0) {
      data = newItems.map((item, index) => {
        return (
          {index: index, file_name: item.file_name, link: item.link, screen_name: item.screen_name, id_faskes: item.id_faskes}
        )
      });
    }

    const id = data.filter(
      item => item.index === e
    );
    //console.log(id[0].value);

    if(id[0].id_faskes !== '') {
      getFaskesById(id[0].id_faskes);
    }else if(id[0].link !== '') {
      openUrl(id[0].link);
    }
  }

  useEffect(() => {
    if(dataIklan.length > 0) {
      listAds();
    }
  }, [dataIklan]);

  return (
    !loading ?
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
      >
      <SafeAreaView style={styles.container}>
        <View
          style={styles.Beranda}
          onLayout={event => {setLayout(event.nativeEvent.layout); setLayoutWidth(event.nativeEvent.layout.width)}}>

          <Spinner
            size="small"
            animation="fade"
            visible={loadingFetch}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
            color="#D13395"
            overlayColor="rgba(255, 255, 255, 0.5)"
          />

          <Header dataLogin={dataLogin} props={props} base_url={formValidation.base_url} updateData={false}/>

          <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
            // onScrollEndDrag={refetchData}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >

          <FlatListSlider
            data={itemAds}
            imageKeys={'image'}
            // local
            height={160}
            width={layoutWidth - (layoutWidth * 0.02)}
            timer={5000}
            onPress={item => openAds(item)}
            contentContainerStyle={{alignItems: 'center'}}
            indicatorContainerStyle={{position:'absolute', bottom: 10}}
            indicatorActiveColor={'#8e44ad'}
            indicatorInActiveColor={'#ffffff'}
            indicatorActiveWidth={30}
            animation
            //contentContainerStyle={{borderRadius: 20, borderWidth: 2, flex: 1, flexDirection: 'row', overflow: 'hidden'}}
          />
            <View style={{marginTop: '5%'}}>
              <View
                style={{
                  paddingVertical: 20, alignItems: 'center'
                }}>
                <Text style={styles.Txt616}>Pilihan Layanan</Text>

                  <FlatList
                    data={formatRow(dataLayanan1, numColumns)}
                    style={{marginHorizontal: 0}}
                    ListEmptyComponent={null}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    // numColumns={numColumns}
                    horizontal={true}
                  />

                  <FlatList
                    data={formatRow(dataLayanan2, numColumns)}
                    style={{marginTop: '2%'}}
                    ListEmptyComponent={null}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    // numColumns={numColumns}
                    horizontal={true}
                  />
              </View>
              <View
                style={{
                  paddingVertical: 20, alignItems: 'center'
                }}>
                <Text style={styles.Txt616}>Jadwal Layanan Aktif</Text>
                <View style={styles.Jadwal_menunggu(layout)}>
                  <View style={styles.Label_layanan_top}>
                    <View style={[styles.Lbl_layanan, {width: '25%'}]}>
                      <Text style={styles.Txt833}>Layanan</Text>
                    </View>
                    <View style={[styles.Lbl_layanan, {width: '35%'}]}>
                      <Text style={styles.Txt833}>Jadwal</Text>
                    </View>
                    <View style={[styles.Lbl_layanan, {width: '40%'}]}>
                      <Text style={styles.Txt833}>Status</Text>
                    </View>
                  </View>
                  
                  <ScrollView
                    nestedScrollEnabled={true}
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={getReservation}
                    showsVerticalScrollIndicator={false}
                  >
                    <>
                      <RenderReservation />
                      {shouldFetchBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                    </>
                  </ScrollView>

                </View>
              </View>
            </View>

            <Text style={styles.textLabel}>Diketahui :</Text>
            <View style={styles.boxPartner}>
              <Image
                style={styles.logoImage}
                source={{uri: formValidation.base_url + 'data_assets/partner/logo_ifi.jpeg'}}
                resizeMode="contain"
              />
              <Image
                style={styles.logoImage}
                source={{uri: formValidation.base_url + 'data_assets/partner/logo_ikatwi.jpeg'}}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
        </View>
        <FooterListener props={props} />
      </SafeAreaView>
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
  Beranda: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: '2%',
    width: '100%',
    //borderWidth: 3
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    //marginTop: '15%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },

  button: (status, payment) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4%',
    borderRadius: 5,
    backgroundColor: status === 'OPEN' ? 'rgba(0,163,255,1)' : payment === 'OPEN' ? 'rgba(237,28,36,1)' : 'rgba(36,195,142,1)'
  }),

  txtButton: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)'
  },

  boxPartner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: '2%',
    justifyContent: 'center'
  },
  textLabel: {
    textAlign: 'center',
    marginTop: '5%'
  },
  logoImage: {
    marginHorizontal: '2%',
    height: 60,
    width: 60,
    justifyContent: 'center',
  },

  Jadwal_menunggu: layout => ({
    // paddingTop: 10,
    paddingVertical: '2%',
    minHeight: 60,
    maxHeight: 200,
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: 'rgba(237,235,236,1)',
    width: layout.width - (layout.width * 0.07),
  }),

  Lbl_layanan: {
    paddingHorizontal: '2%'
  },

  Txt833: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  Txt833_isi: {
    fontSize: 11,
    // fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'left',
    justifyContent: 'flex-start',
  },

  Label_layanan_top: {
    display: 'flex',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(36,195,142,1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
    paddingVertical: '3%',
    marginBottom: '2%',
    marginTop: '-2%'
  },

  Label_layanan_akhir: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: '2%',
    marginBottom: '2%',
  },

  Txt616: {
    fontSize: 16,
    marginBottom: '5%',
    // paddingLeft: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 2,
    borderRadius: 5
  },
});
