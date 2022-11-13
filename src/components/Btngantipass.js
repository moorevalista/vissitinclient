import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btngantipass(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.openChangePass}>
      <Text style={styles.gantiPassword}>Ganti Password</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  gantiPassword: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btngantipass;
