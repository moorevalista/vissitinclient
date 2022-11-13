import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import Login from './screens/Login';
//import Registrasi from './screens/Registrasi';
//import Home from './screens/Home';
//import Setting from './screens/Pengaturan';
import Profile from './screens/Lengkapiprofile';
import Password from './screens/Gantipass';
import HomeServices from './screens/Homeservices';
import MainServices from './screens/Mainservices';
import RootService from './screens/Rootservice';
import LayananFaskes from './screens/LayananFaskes';
import LayananFirst from './screens/LayananFirst';
import LayananSecond from './screens/LayananSecond';
import Hasilpencarian from './screens/Hasilpencarian';
import Profilnakes from './screens/Profilnakes';
import Profilfaskes from './screens/Profilfaskes';
import Konfirmasilayanan from './screens/Konfirmasilayanan';
import Konfirmasilayanankhusus from './screens/Konfirmasilayanankhusus';
import Pembayaran from './screens/Pembayaran';
import PembayaranKhusus from './screens/PembayaranKhusus';
import Notifikasi from './screens/Notifikasi';
import Notifikasipage from './screens/Notifikasipage';
import ProfilnakesKhusus from './screens/ProfilnakesKhusus';
import LayananKhusus from './screens/LayananKhusus';
import Chatpage from './screens/Chatpage';
//import Laporan from './screens/Laporan';
import LaporanDetail from './screens/LaporanDetail';
//import Jadwal from './screens/Jadwal';
import Detailjadwal from './screens/Detailjadwal';
import Lupapass from './screens/Lupapass';
import Lupapass1 from './screens/Lupapass1';

//new screens
import {
  Beranda,
  EditDataPribadi,
  GantiSandi,
  Jadwal,
  Laporan,
  Login,
  Pendaftaran,
  Pesan,
  Setting
} from './screens';
//new screens

import {BottomNavigator} from './components';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const { Navigator, Screen } = createNativeStackNavigator();

const linking = {
  prefixes: [
    'pasien.vissit.in://'
  ],
  config: {
    screens: {
      loginScreen: {
        path: 'login',
      },
      lupaPass: {
        path: 'lupaPass',
      },
      setNewPass: {
        path: 'resetPassword/:id/:token',
        parse: {
          id: (id) => `${id}`,
          token: (token) => `${token}`,
        },
      },
    },
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  }
});

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Icons = ({label, name}) => {
  if (label === 'Panah') {
    return <IconPanah style={styles.IconPanah} name={name} />;
  }
};

const MainApp = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigator {...props} />}
      initialRouteName="Beranda">
      <Tab.Screen
        name="Pesan"
        component={Pesan}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Jadwal"
        component={Jadwal}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Beranda"
        component={Beranda}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Laporan"
        component={Laporan}
        options={{headerShown: false}}
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
    headerStyle: {
      backgroundColor: 'rgba(217,217,217,1)',
    },

    headerLeft: () => (
      <View style={styles.IconHeader}>
        <Icons label="Panah" name="grid" />
      </View>
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

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="loginScreen">
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
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
        name="EditDataPribadi"
        component={EditDataPribadi}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="GantiSandi"
        component={GantiSandi}
        options={{headerShown: false}}
      />
      
      <Stack.Screen
        name="Pendaftaran"
        component={Pendaftaran}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const HomeNavigator = (props) => (
  <Navigator
    screenOptions={{
      headerShown: false
    }}>
    <Screen name='loginScreen' component={Login} />
    <Screen name='registrasiScreen' component={Pendaftaran} />
    <Screen name='homeScreen' component={Beranda} />
    <Screen name='settingScreen' component={Setting} />
    <Screen name='profileScreen' component={Profile} />
    <Screen name='changepassScreen' component={Password} />
    <Screen name='homeServices' component={HomeServices} />
    <Screen name='mainServices' component={MainServices} />
    <Screen name='rootService' component={RootService} />
    <Screen name='layananFaskes' component={LayananFaskes} />
    <Screen name='layananFirst' component={LayananFirst} />
    <Screen name='layananSecond' component={LayananSecond} />
    <Screen name='hasilPencarian' component={Hasilpencarian} />
    <Screen name='profilNakes' component={Profilnakes} />
    <Screen name='profilFaskes' component={Profilfaskes} />
    <Screen name='profilNakesKhusus' component={ProfilnakesKhusus} />
    <Screen name='konfirmasiLayanan' component={Konfirmasilayanan} />
    <Screen name='konfirmasiLayananKhusus' component={Konfirmasilayanankhusus} />
    <Screen name='pembayaranScreen' component={Pembayaran} />
    <Screen name='pembayaranKhususScreen' component={PembayaranKhusus} />
    <Screen name='notifikasiScreen' component={Notifikasi} />
    <Screen name='notifReservasi' component={Notifikasipage} />
    <Screen name='layananKhusus' component={LayananKhusus} />
    <Screen name='chatPage' component={Chatpage}
      options={{
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
    />
    <Screen name='laporanScreen' component={Laporan} />
    <Screen name='laporanDetail' component={LaporanDetail} />
    <Screen name='jadwalScreen' component={Jadwal} />
    <Screen name='jadwalDetail' component={Detailjadwal} />
    <Screen name='lupaPass' component={Lupapass} />
    <Screen name='setNewPass' component={Lupapass1} />
  </Navigator>
);

export const AppNavigator = (props) => (
  <NavigationContainer style={styles.container} linking={linking} fallback={<></>}>
    <Router />
  </NavigationContainer>
);