import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function RadioServiceUser(props) {
  //const serviceUser = props.serviceUser;
  //const setServiceUser = props.setServiceUser;

  const pilihUser = (e) => {
    //setServiceUser(e);
    props.pilihUser(e);
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => pilihUser(props.name)}>
      <Icon
        name={props.serviceUser === props.name ? "ios-radio-button-on" : "ios-radio-button-off"}
        style={[
          styles.radioIcon,
          {
            color: props.serviceUser === props.name ? "#007AFF" : "#ccc"
          }
        ]}
      ></Icon>
      <Text style={styles.untukPribadi}>Untuk {props.name}</Text>
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
    flex: 0.1,
    fontSize: 23,
    alignSelf: "center"
  },
  untukPribadi: {
    flex: 0.9,
    alignSelf: 'center',
    fontFamily: "roboto-regular",
    color: "#121212"
  }
});

export default RadioServiceUser;
