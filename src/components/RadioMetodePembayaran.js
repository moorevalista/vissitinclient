import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioMetodePembayaran(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => props.onSelectPaymentMethod(props.value)}>
      <Icon
        name={props.paymentMethod === props.value ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.paymentMethod === props.value ? "#007AFF" : "#ccc"
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

export default RadioMetodePembayaran;
