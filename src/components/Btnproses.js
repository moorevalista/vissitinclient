import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnproses(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => props.onProses()}>
      <Text style={styles.proses}>PROSES</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  proses: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnproses;
