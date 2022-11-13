import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { form_validation } from "../form_validation";

function Btnkonfirmasihadir(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.confirmCheckIn}>
      <Text style={styles.konfirmasiKehadiran}>Konfirmasi Kehadiran</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(80,227,194,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  konfirmasiKehadiran: {
    color: "rgba(0,0,0,1)",
    fontSize: 17
  }
});

export default Btnkonfirmasihadir;
