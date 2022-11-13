import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";

function Tambahbtn(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <View style={styles.group}>
        <Icon name="plus" style={styles.icon}></Icon>
        <Text style={styles.tambahData}>TAMBAH DATA</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8E8E93",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  group: {
    width: 145,
    height: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center"
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 21
  },
  tambahData: {
    color: "rgba(0,0,0,1)",
    fontSize: 17
  }
});

export default Tambahbtn;
