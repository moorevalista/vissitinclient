import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnmencari(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.handleCari}>
      <Text style={styles.mencari}>MENCARI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212121",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  mencari: {
    color: "#fff",
    fontSize: 14
  }
});

export default Btnmencari;
