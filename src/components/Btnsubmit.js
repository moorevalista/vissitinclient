import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnsubmit(props) {
  const [styleButton, setStyleButton] = useState('');

  useEffect(() => {
    props.buttonDaftar ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.buttonDaftar]);

  return (
    <TouchableOpacity disabled={props.buttonDaftar} style={[styleButton, props.style]} onPress={props.handleSubmit}>
      <Text style={styles.daftar}>DAFTAR</Text>
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
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  containerDisabled: {
    backgroundColor: "rgba(0,0,0,0.50)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  daftar: {
    color: "rgba(255,255,255,1)",
    fontSize: 17
  }
});

export default Btnsubmit;
