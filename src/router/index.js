import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IconPanah from 'react-native-vector-icons/Ionicons';

import {
  AlertReservasi,
  AlertPendaftaran,
  AlertEmail,
  Beranda,
  DataReservasi,
  DataReservasiDiterima,
  EditDataPribadi,
  GantiSandi,
  HasilPencarian,
  InfoRekening,
  Jadwal,
  JadwalMasukAktif,
  KonfirmasiReservasi,
  KonfirmasiReservasiKhusus,
  KonfirmasiPembayaran,
  KonfirmasiPembayaranKhusus,
  Laporan,
  LaporanDetail,
  LayananTerapi,
  LayananFaskes,
  LayananFaskesProfile,
  LayananReservasiPribadi,
  LayananReservasiKategori,
  LayananHomeCare,
  LayananReguler,
  //LayananReservasiKategoriHomeCare,
  LayananReservasiWaktu,
  Login,
  //LoginOtp,
  LupaSandi,
  //LiveCamera,
  Payment,
  Pesan,
  PesanAktif,
  Pendaftaran,
  ProfileNakes,
  ProfileNakesKhusus,
  PilihReservasiKhusus,
  ResetSandi,
  Setting,
  //StatusChackIn,
  //StatusChackOut,
  //StatusOnSite,
  //StatusOnSiteSelesai,
  //Splash,
  Webview
} from '../screens';

import {BottomNavigator} from '../components';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const Icons = ({label, name}) => {
  if (label === 'Panah') {
    return <IconPanah style={styles.IconPanah} name={name} />;
  }
};

const MainApp = (props) => {
  //console.log(props);
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigator {...props} props={props} />}
      initialRouteName="Beranda">
      <Tab.Screen
        name="Pesan"
        component={Pesan}
        options={HeaderNoNavigation('Pesan')}
      />
      <Tab.Screen
        name="Jadwal"
        component={Jadwal}
        options={HeaderNoNavigation('Jadwal')}
      />
      <Tab.Screen
        name="Beranda"
        component={Beranda}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Laporan"
        component={Laporan}
        options={HeaderNoNavigation('Laporan')}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const HeaderNavigation = title => {
  return ({navigation}) => ({
    title: title,
    headerTitleAlign: 'center',
    headerTitleStyle: {fontSize: 14, color: 'rgba(0, 0, 0, 1)'},
    headerStyle: {
      backgroundColor: 'rgba(217,217,217,1)',
    },
    headerTintColor: 'rgba(255, 255, 255, 1)',

    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Beranda');
        }}>
        <View style={styles.IconHeader}>
          <Icons label="Panah" name="grid" />
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <View style={styles.IconHeader}>
          <Icons label="Panah" name="chevron-back-sharp" />
        </View>
      </TouchableOpacity>
    ),
  });
};

const HeaderNoNavigation = title => {
  return ({navigation}) => ({
    title: title,
    headerTitleAlign: 'center',
    headerTitleStyle: {fontSize: 14, color: 'rgba(255, 255, 255, 1)'},
    headerStyle: {
      backgroundColor: 'rgba(54,54,54,1)',
    },
    headerTintColor: 'rgba(255, 255, 255, 1)',

  });
};

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="loginScreen">
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      
      <Stack.Screen
        name="notifReservasi"
        component={DataReservasi}
        options={HeaderNavigation('Data Reservasi')}
      />
      <Stack.Screen
        name="chatPage"
        component={PesanAktif}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditDataPribadi"
        component={EditDataPribadi}
        options={HeaderNavigation('Profil Data')}
      />
      <Stack.Screen
        name="GantiSandi"
        component={GantiSandi}
        options={HeaderNavigation('Ganti Sandi')}
      />
      <Stack.Screen
        name="jadwalDetail"
        component={JadwalMasukAktif}
        options={HeaderNavigation('Jadwal Reservasi')}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="laporanDetail"
        component={LaporanDetail}
        options={HeaderNavigation('Laporan')}
      />
      <Stack.Screen
        name="InfoRekening"
        component={InfoRekening}
        options={HeaderNavigation('Pembayaran')}
      />
      <Stack.Screen
        name="loginScreen"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="homeScreen"
        component={Beranda}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="registrasiScreen"
        component={Pendaftaran}
        options={HeaderNoNavigation('Pendaftaran')}
      />
      <Stack.Screen
        name="lupaPass"
        component={LupaSandi}
        options={HeaderNoNavigation('Pulihkan Sandi')}
      />
      <Stack.Screen
        name="setNewPass"
        component={ResetSandi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="settingScreen"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="mainServices"
        component={LayananTerapi}
        options={HeaderNavigation('Layanan Terapi')}
      />
      <Stack.Screen
        name="layananFaskes"
        component={LayananFaskes}
        options={HeaderNavigation('Layanan Faskes')}
      />
      <Stack.Screen
        name="profilFaskes"
        component={LayananFaskesProfile}
        options={HeaderNavigation('Layanan Faskes')}
      />
      <Stack.Screen
        name="rootService"
        component={LayananReservasiPribadi}
        options={HeaderNavigation('Layanan Faskes')}
      />
      <Stack.Screen
        name="layananFirst"
        component={LayananReservasiKategori}
        options={HeaderNavigation('Kategori Layanan')}
      />
      <Stack.Screen
        name="layananSecond"
        component={LayananReservasiWaktu}
        options={HeaderNavigation('Waktu Layanan')}
      />
      <Stack.Screen
        name="hasilPencarian"
        component={HasilPencarian}
        options={HeaderNavigation('Hasil Pencarian')}
      />
      <Stack.Screen
        name="profilNakes"
        component={ProfileNakes}
        options={HeaderNavigation('Profil Data')}
      />
      <Stack.Screen
        name="konfirmasiLayanan"
        component={KonfirmasiReservasi}
        options={HeaderNavigation('Rincian Reservasi')}
      />
      <Stack.Screen
        name="pembayaranScreen"
        component={KonfirmasiPembayaran}
        options={HeaderNavigation('Konfirmasi Pembayaran')}
      />
      <Stack.Screen
        name="alertReservasi"
        component={AlertReservasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="alertEmail"
        component={AlertEmail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="homeServices"
        component={LayananHomeCare}
        options={HeaderNavigation('Layanan Home Care')}
      />
      <Stack.Screen
        name="rootServiceHomeCare"
        component={LayananReguler}
        options={HeaderNavigation('Layanan Home Care')}
      />
      <Stack.Screen
        name="profilNakesKhusus"
        component={ProfileNakesKhusus}
        options={HeaderNavigation('Pilihan Paket')}
      />
      <Stack.Screen
        name="layananKhusus"
        component={PilihReservasiKhusus}
        options={HeaderNavigation('Jadwal Reservasi')}
      />
      <Stack.Screen
        name="konfirmasiLayananKhusus"
        component={KonfirmasiReservasiKhusus}
        options={HeaderNavigation('Rincian Reservasi')}
      />
      <Stack.Screen
        name="pembayaranKhususScreen"
        component={KonfirmasiPembayaranKhusus}
        options={HeaderNavigation('Konfirmasi Pembayaran')}
      />

      <Stack.Screen
        name="payment"
        component={Payment}
        options={HeaderNoNavigation('Pembayaran')}
      />
      <Stack.Screen
        name="webview"
        component={Webview}
        options={HeaderNoNavigation('Info')}
      />
    </Stack.Navigator>
  );
};

export default Router;

const styles = StyleSheet.create({
  IconHeader: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  IconPanah: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    opacity: 0.8,
  },
});
