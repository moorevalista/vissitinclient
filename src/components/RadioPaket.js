import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioPaket(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => props.onSelectPaket(props.value)}>
      <Icon
        name={props.jenisPaket === props.value ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.jenisPaket === props.value ? "#007AFF" : "#ccc"
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
    fontSize: 23
  }
});

export default RadioPaket;
