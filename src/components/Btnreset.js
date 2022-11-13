import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnreset(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.handleSubmit}>
      <Text style={styles.pulihkan}>{props.label !== undefined ? props.label : 'SIMPAN'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  pulihkan: {
    color: "#000",
    fontSize: 17
  }
});

export default Btnreset;
