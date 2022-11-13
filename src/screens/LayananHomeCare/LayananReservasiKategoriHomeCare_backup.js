import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {RadioButton} from 'react-native-paper';

export default function LayananReservasiKategoriHomeCare(props) {
  const [checked, setChecked] = useState('');

  // data untuk klasifikasi pasien
  const dataKlasifikasiPasien = [
    {label: 'yanto', value: 'yanto'},
    {label: 'nugroho', value: 'nugroho'},
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => null} />
        }>
        <View style={styles.Layanan_reservasi_ketegori}>
          <View style={styles.Kategori}>
            <Text style={styles.Txt372}>KATEGORI PASIEN</Text>
            <View style={styles.Radio_bayi}>
              <RadioButton
                value="bayi"
                status={checked === 'bayi' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('bayi')}
              />
              <Text style={styles.Txt145}>Bayi (0 - 1 Tahun)</Text>
            </View>
            <View style={styles.Radio_bayi}>
              <RadioButton
                value="anak"
                status={checked === 'anak' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('anak')}
              />
              <Text style={styles.Txt145}>Anak (2 - 10 Tahun)</Text>
            </View>
            <View style={styles.Radio_bayi}>
              <RadioButton
                value="remaja"
                status={checked === 'remaja' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('remaja')}
              />
              <Text style={styles.Txt145}>Remaja (11 - 19 Tahun)</Text>
            </View>
            <View style={styles.Radio_bayi}>
              <RadioButton
                value="lansia"
                status={checked === 'lansia' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('lansia')}
              />
              <Text style={styles.Txt145}>Dewasa (20 - 60 Tahun)</Text>
            </View>
            <View style={styles.Radio_bayi}>
              <RadioButton
                value="second"
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('second')}
              />
              <Text style={styles.Txt145}>Lansia (60 Tahun Lebih)</Text>
            </View>
            <View style={styles.KlasifikasiPasien}>
              <Text style={styles.Txt372}>KLASIFIKASI PASIEN</Text>
              <View style={styles.selectOption}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Pilih Klasifikasi...',
                  }}
                  items={dataKlasifikasiPasien}
                  onValueChange={value => null}
                  value={null}
                />
              </View>
            </View>
            <View style={styles.Gejala}>
              <Text style={styles.Txt372}>GEJALA / KELUHAN</Text>
              <View style={styles.Box1}>
                <TextInput
                  placeholder="Isi gejala atau keluhan yang dialami..."
                  numberOfLines={3}
                  multiline={true}
                  style={styles.Txt865}></TextInput>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('LayananReservasiWaktu')}>
            <View style={styles.Btn_lanjut}>
              <Text style={styles.Txt060}>LANJUT</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_reservasi_ketegori: {
    flex: 1,
    paddingTop: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  Kategori: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 150,
  },
  KlasifikasiPasien: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  Txt372: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 10,
  },
  Radio_bayi: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
    marginLeft: -5,
  },
  Ellipse32: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,1)',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  Txt145: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
  },

  Gejala: {
    display: 'flex',
    flexDirection: 'column',
  },

  Box1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 19,
    paddingRight: 19,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,66,105,0.28)',
  },
  Txt865: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0,32,51,1)',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt060: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  selectOption: {
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    borderWidth: 0.2,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    color: 'rgba(0,32,51,1)',
    height: 40,
    width: 300,
  },
});
