import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";

function Splash(props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logospash.gif")}
        resizeMode="contain"
        style={styles.image1}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image1: {
    height: 272,
    marginTop: 228
  }
});

export default Splash;
