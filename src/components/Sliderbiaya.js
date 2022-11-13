import React, { Component } from "react";
import { StyleSheet, View, Slider } from "react-native";

function Sliderbiaya(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Slider value={50} style={styles.slider}></Slider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  slider: {
    height: 30,
    width: 250,
    alignSelf: "center"
  }
});

export default Sliderbiaya;
