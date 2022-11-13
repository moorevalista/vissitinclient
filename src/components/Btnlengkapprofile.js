import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnlengkapprofile(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.openProfile}>
      <Text style={styles.lengkapiProfile}>Informasi Pribadi</Text>
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
  lengkapiProfile: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnlengkapprofile;
