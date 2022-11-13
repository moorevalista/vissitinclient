import React, { Component, useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioAlamat(props) {

  const pilihAlamat = (e) => {
    props.pilihAlamat(e);
  }
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => pilihAlamat(props.name)}>
      <Icon
        name={props.name === props.useAddress ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.useAddress === props.name ? "#007AFF" : "#ccc"
          }
        ]}
      ></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "transparent"
  },
  radioIcon: {
    flex: 0.1,
    fontSize: 23,
    alignSelf: "center"
  }
});

export default RadioAlamat;
