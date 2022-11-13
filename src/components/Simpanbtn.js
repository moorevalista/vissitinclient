import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Simpanbtn(props) {
  const updateData = props.updateData;
  const setUpdateData = props.setUpdateData;

  const setUpdate = () => {
    if(updateData) {
      props.onSubmit();
    }else {
      setUpdateData(!updateData);
    }
  }

  return (
    <TouchableOpacity style={[styles.container, props.style, !updateData ? {backgroundColor: 'rgba(80,227,194,1)'}:'']} onPress={setUpdate}>
      <Text style={[styles.simpan, !updateData ? {color: 'rgba(0,0,0,1)'}:'']}>{props.updateData ? 'SIMPAN' : 'PERBARUI DATA'}</Text>
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
  simpan: {
    color: "#fff",
    fontSize: 20
  }
});

export default Simpanbtn;
