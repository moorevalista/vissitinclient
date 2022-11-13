import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

function HeaderPasien(props) {
  return (
    <View style={styles.container}>
        <View style={styles.welcome}>
          <View style={styles.iconRow}>
            <Icon name="universal-access" style={styles.icon}></Icon>
            <View style={styles.box}>
              <Text style={styles.label}>Selamat Datang</Text>
              <Text style={styles.text}>{props.dataLogin.nama_pasien}</Text>
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(74,74,74,1)",
    borderBottomRightRadius: 100
  },
  welcome: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: '5%'
  },
  iconRow: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'flex-end',
    padding: '4%'
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 40
  },
  box: {
    marginLeft: '2%'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12
  },
  text: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18
  }
});

export default HeaderPasien;
