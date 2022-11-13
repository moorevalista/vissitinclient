import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import Checkboxkerabat from "./Checkboxkerabat";
import Icon from "react-native-vector-icons/SimpleLineIcons";

function Reservasikerabat(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect4}>
        <Text style={styles.reservasikanKerabat}>Reservasikan Kerabat</Text>
        <View style={styles.pilihkerabat}>
          <View style={props.stylePilihKerabat ? styles.rect5Error : styles.rect5}>
            <props.RenderKerabat style={styles.textInput} />
          </View>
        </View>
        <Checkboxkerabat
          style={styles.materialCheckboxWithLabel}
          func={props}
        />
        <TouchableOpacity style={styles.button} onPress={() => props.handleTambahKerabat(true)}>
          <Text style={styles.tambahkerabat}>Tambah Daftar Kerabat</Text>
          <Icon name="plus" style={styles.icon1}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect4: {
    flex: 1,
    padding: '4%',
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 20
  },
  reservasikanKerabat: {
    fontSize: 18,
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  pilihkerabat: {
    flex: 1,
    marginTop: '1%'
  },
  rect5: {
    flex: 1,
    backgroundColor: "#E6E6E6",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000"
  },
  rect5Error: {
    flex: 1,
    backgroundColor: "#FFA07C",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000000"
  },
  textInput: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    padding: '4%'
  },
  materialCheckboxWithLabel: {
    flex: 1,
    padding: '2%'
  },
  button: {
    flex: 1,
    flexDirection: "row",
    marginTop: '1%',
    padding: '2%'
  },
  tambahkerabat: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    alignSelf: "center",
  },
  icon1: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: '1%'
  }
});

export default Reservasikerabat;
