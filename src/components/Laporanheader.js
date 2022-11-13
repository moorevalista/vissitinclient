import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Laporanhead from "./Laporanhead";

function Laporanheader({props, style}) {
  return (
    <View style={[styles.container, style]}>
      <Laporanhead style={styles.cupertinoHeaderWithAddButton1} props={props} />
      <View style={styles.rect}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cupertinoHeaderWithAddButton1: {
    height: 44,
    marginTop: 31
  },
  rect: {
    height: 31,
    backgroundColor: "rgba(74,74,74,1)",
    marginTop: -75
  }
});

export default Laporanheader;
