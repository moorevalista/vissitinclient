import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnfavourite(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.lainnya}>LAINNYA</Text>
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
  lainnya: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnfavourite;
