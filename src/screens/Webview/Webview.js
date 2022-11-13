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
import { WebView } from 'react-native-webview';

export default function Webview(props) {
  return (
    <View style={styles.OtpLogin}>
      <View style={styles.Group089}>
        <WebView source={{ uri: props.route.params.url }} />
      </View>
    </View>
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
