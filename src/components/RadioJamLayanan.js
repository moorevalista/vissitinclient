import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioJamLayanan(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => props.onSelectTime(props.value)}>
      <Icon
        name={props.waktuBooking === props.value ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.waktuBooking === props.value ? "#007AFF" : "#ccc"
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

export default RadioJamLayanan;
