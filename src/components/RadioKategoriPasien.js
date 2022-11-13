import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioKategoriPasien(props) {

  const selectKategori = (e) => {
    props.selectKategori(e);
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => selectKategori(props.name)}>
      <Icon
        name={props.name === props.kategoriPasien ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.kategoriPasien === props.name ? "#007AFF" : "#ccc"
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

export default RadioKategoriPasien;
