import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnchatnakes(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.openChat}>
      <Text style={styles.chatNakes}>Chat Nakes</Text>
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
    paddingLeft: 16,
    paddingRight: 16
  },
  chatNakes: {
    color: "#fff",
    fontSize: 17
  }
});

export default Btnchatnakes;
