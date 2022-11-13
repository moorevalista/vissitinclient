import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btntambah(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.simpanKerabat}>
      <Text style={styles.tambah}>TAMBAH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  tambah: {
    color: "rgba(255,255,255,1)",
    fontSize: 16
  }
});

export default Btntambah;
