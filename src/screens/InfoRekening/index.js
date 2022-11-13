import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, SafeAreaView} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function InfoRekening(props) {
  const [vaTransfer, setVaTransfer] = useState(false);
  const [qrsTransfer, setQrsTransfer] = useState(false);
  const [tunai, setTunai] = useState(false);

  return (
    <SafeAreaView style={styles.Info_rekening}>
      <View style={styles.Group1047}>
        <View style={{paddingTop: 25}}>
          <Text style={styles.Txt732}>
            Aktifkan metode pembayaran untuk memudahkan transaksi anda.
          </Text>
          <View style={styles.Bayar_va}>
            <CheckBox
              tintColors={true}
              disabled={false}
              value={vaTransfer}
              onValueChange={newValue => setVaTransfer(newValue)}
            />
            <Text style={styles.Txt153}>Virtual Account Transfer</Text>
          </View>
          <View style={styles.Bayar_va}>
            <CheckBox
              tintColors={true}
              disabled={false}
              value={qrsTransfer}
              onValueChange={newValue => setQrsTransfer(newValue)}
            />
            <Text style={styles.Txt153}>QRIS Transfer</Text>
          </View>
          <View style={styles.Bayar_va}>
            <CheckBox
              tintColors={true}
              disabled={false}
              value={tunai}
              onValueChange={newValue => setTunai(newValue)}
            />
            <Text style={styles.Txt153}>Cash / Tunai</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => null}>
          <View style={styles.Btn_lanjut}>
            <Text style={styles.Txt776}>SIMPAN</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Info_rekening: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  Group1047: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  Txt732: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(255,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginBottom: 19,
  },
  Bayar_va: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  Txt153: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 18,
    paddingLeft: 10,
    color: 'rgba(0,32,51,1)',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
    marginBottom: 25,
  },
  Txt776: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
});
