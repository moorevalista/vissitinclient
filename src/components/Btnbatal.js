import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnbatal(props) {
  //const updateData = props.updateData;
  //const setUpdateData = props.setUpdateData;

  const setUpdate = () => {
      //setUpdateData(!updateData);
      props.onCancel();
  }

  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={setUpdate}>
      <Text style={styles.batal}>BATAL</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(180,0,22,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  batal: {
    color: "#fff",
    fontSize: 20
  }
});

export default Btnbatal;
