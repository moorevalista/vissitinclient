import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnback(props) {

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={() => {
        props.pilihLayanan('reguler')
        props.setServiceUser('')
    }}>
      <Text style={styles.batal}>KEMBALI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  batal: {
    color: "#000",
    fontSize: 16
  }
});

export default Btnback;
