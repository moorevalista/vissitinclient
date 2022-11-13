import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnscanbarcode(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.openScanner}>
      <Text style={styles.scanQrCode}>Scan QR-Code</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8E8E93",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  scanQrCode: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnscanbarcode;
