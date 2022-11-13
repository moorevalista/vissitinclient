import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnpilih(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onSelectJadwal}>
      <Text style={styles.pilih}>PILIH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,1)"
  },
  pilih: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnpilih;
