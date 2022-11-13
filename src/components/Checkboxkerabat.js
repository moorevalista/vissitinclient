import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Checkboxkerabat(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => props.func.handlePersetujuan('kerabat')}>
      <Icon
        name={props.func.checked ? "checkbox-marked" : "checkbox-blank-outline"}
        style={styles.checkIcon}
      ></Icon>
      <Text style={styles.checkLabel}>
        {props.label ||
          "Saya mengerti dan memahami bahwa saya bertindak sebagai wali dari kerabat saya dalam penggunaan layanan ini."}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 20,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  checkIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 28,
    lineHeight: 28
  },
  checkLabel: {
    marginLeft: 2,
    fontSize: 14,
    color: "rgba(0,0,0,0.87)",
    height: 66,
    flex: 1
  }
});

export default Checkboxkerabat;
