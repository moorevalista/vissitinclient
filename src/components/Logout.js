import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { form_validation } from "../form_validation";

function Logout({ logout, style }) {
  const formValidation = useContext(form_validation);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={logout}>
      <Text style={styles.text}>Log Out</Text>
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
  text: {
    color: "#fff",
    fontSize: 17
  }
});

export default Logout;
