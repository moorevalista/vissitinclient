import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {AnimasiEmailTerkirim} from '../../assets';
import LottieView from 'lottie-react-native';

export default function AlertReservasi(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.OtpLogin}>
        <View style={styles.Group089}>
          <View />
          <View style={styles.Icon}>
            <LottieView source={AnimasiEmailTerkirim} autoPlay loop />
          </View>

          <View>
            <View>
              <Text style={styles.daftarAkun}>TAUTAN</Text>
              <Text style={styles.daftarAkun}>TERKIRIM</Text>
            </View>
            <Text style={styles.multiple1}>
              <Text style={{color: 'rgba(36,195,142,1)'}}>
                Link Reset Sandi
              </Text>
              telah berhasil dikirimkan ke WhatsApp anda, silahkan cek dan klik
              link yang anda terima untuk mengatur ulang kata sandi anda.
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => props.navigation.navigate('loginScreen')}>
          <View style={styles.Btn_lanjut}>
            <Text style={styles.Txt4105}>LANJUT</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  OtpLogin: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Group089: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingTop: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  multiple1: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    paddingBottom: 10,
    marginHorizontal: 40,
    paddingTop: 60,
  },
  daftarAkun: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,32,51,1)',
    fontWeight: 'bold',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 100,
    marginHorizontal: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
  },

  Txt4105: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Icon: {
    height: 200,
  },
});
