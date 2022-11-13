import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

function Btnsignout(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Icon name="power-off" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 35,
    alignSelf: "center"
  }
});

export default Btnsignout;
