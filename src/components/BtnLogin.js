import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function BtnLogin(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.handleSubmit}>
      <Text style={styles.masuk}>MASUK</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  masuk: {
    color: "rgba(0,0,0,1)",
    fontSize: 17
  }
});

export default BtnLogin;
