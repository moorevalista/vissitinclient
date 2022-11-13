import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function DataReservasiDiterima() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingTop: 10,
      }}>
      <View style={styles.wrapperCardAtas}>
        <View style={styles.Group378}>
          <View style={styles.Jenis_layanan_kiri}>
            <Text style={styles.Txt319}>Kategori Layanan</Text>
            <Text style={styles.Txt656}>FISIOTERAPI</Text>
          </View>
          <View style={styles.Jenis_layanan_kanan}>
            <Text style={styles.Txt319}>Jenis Layanan</Text>
            <Text style={styles.Txt656}>REGULER</Text>
          </View>
        </View>
        <View style={styles.Group378}>
          <View style={styles.Jenis_layanan_kiri}>
            <Text style={styles.Txt319}>Tarif Layanan</Text>
            <Text style={styles.Txt656}>Rp.400.000</Text>
          </View>
          <View style={styles.Jenis_layanan_kanan}>
            <Text style={styles.Txt319}>Metode Pembayaran</Text>
            <Text style={styles.Txt656}>TUNAI</Text>
          </View>
        </View>
        <View style={styles.Jadwal1}>
          <Text style={styles.Txt091}>Jadwal Reservasi</Text>
          <Text style={styles.Txt710}>Sabtu, 26/07/2022 - 10.00 WIB</Text>
        </View>
        <View style={styles.Jadwal1}>
          <Text style={styles.Txt091}>No. Kode Bayar / VA</Text>
          <Text style={styles.Txt710}>-</Text>
        </View>
        <View style={styles.Status_reservasi}>
          <Text style={styles.Txt191}>Status Reservasi</Text>
          <Text style={styles.Txt680}>
            Jadwal Sudah Dikonfirmasi Oleh Nakes
          </Text>
        </View>
      </View>
      <View style={styles.wrapperLingkaran}>
        <View style={styles.wrapperLingkaranKiriKanan} />
        <View style={styles.wrapperLingkaranKiriKanan} />
      </View>
      <View style={styles.wrapperCardBawah}>
        <View style={styles.Group378}>
          <View style={styles.Jenis_layanan_kiri}>
            <Text style={styles.Txt319}>Nama Pasien</Text>
            <Text style={styles.Txt656}>
              Annisa Putri Qoryatullistya, SST.FT, FTr
            </Text>
          </View>
          <View style={styles.Jenis_layanan_kanan}>
            <Text style={styles.Txt319}>Nama Nakes</Text>
            <Text style={styles.Txt656}>Qoryatullistya, SST.FT, FTr</Text>
          </View>
        </View>

        <View style={styles.Jadwal1}>
          <Text style={styles.Txt091}>Gejala / Keluhan</Text>
          <Text style={styles.Txt680}>
            Kurang keseimbangan, dan sering terjatuh saat berjalan.
          </Text>
        </View>
      </View>
      <View style={styles.Btn_lanjut}>
        <Text style={styles.Txt060}>CHAT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Txt656: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
  },
  Txt319: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
  },

  Jenis_layanan_kiri: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
    maxWidth: '50%',
  },
  Jenis_layanan_kanan: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
    maxWidth: '50%',
  },

  Jadwal1: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  Txt710: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt091: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Status_reservasi: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 9,
  },
  Txt469: {
    position: 'absolute',
    top: 40,
    left: 5012020,
    fontSize: 16,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    width: 121,
    height: 21,
  },
  Txt290: {
    position: 'absolute',
    top: 20,
    left: 5028020,
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(239,70,62,1)',
    textAlign: 'center',
    justifyContent: 'center',
    width: 281,
    height: 21,
  },
  Txt191: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(54,54,54,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Txt680: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(239,70,62,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  Group378: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  wrapperCardAtas: {
    marginBottom: -15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  wrapperCardBawah: {
    marginTop: -14,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  wrapperLingkaran: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 1, //For iOS
    elevation: 1,
  },
  wrapperLingkaranKiriKanan: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Btn_lanjut: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
  },
  Txt060: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
});
