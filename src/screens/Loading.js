import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

function Loading(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.mencari}>Mencari...</Text>
      <Image
        source={require("../assets/images/icon-1.1s-46px2.gif")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mencari: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 18,
    marginTop: 438,
    alignSelf: "center"
  },
  image: {
    width: 50,
    height: 50,
    marginTop: -85,
    marginLeft: 163
  }
});

export default Loading;
