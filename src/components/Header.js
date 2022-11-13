import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Layananheader from "./Layananheader";

function Header({props, style, title}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.cupertinoHeaderWithAddButton1Stack}>
        <Layananheader
          style={styles.cupertinoHeaderWithAddButton1}
          props={props}
          title={title}
        ></Layananheader>
        <View style={styles.rect}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cupertinoHeaderWithAddButton1: {
    height: 44,
    position: "absolute",
    left: 0,
    top: 30,
    right: 0
  },
  rect: {
    top: 0,
    left: 0,
    height: 32,
    position: "absolute",
    backgroundColor: "rgba(74,74,74,1)",
    right: 0
  },
  cupertinoHeaderWithAddButton1Stack: {
    height: 74
  }
});

export default Header;
