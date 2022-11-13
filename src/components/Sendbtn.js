import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";

function Sendbtn(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} disabled={props.disabled} onPress={props.handleSendChat}>
      <Icon name="paper-plane" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    padding: '1%'
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    alignSelf: "center"
  }
});

export default Sendbtn;
