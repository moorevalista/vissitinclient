import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";

function Notifheader({props, style}) {
  const backToHome = () => {
    props.props.navigation.goBack();
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity style={styles.leftIconButton} onPress={() => backToHome()}>
          <IoniconsIcon
            name="ios-arrow-back"
            style={styles.leftIcon}
          ></IoniconsIcon>
          <Text style={styles.kembali}>Kembali</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.notifikasi}>
          Notifikasi
        </Text>
      </View>
      <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.button}>
          <SimpleLineIconsIcon
            name="settings"
            style={styles.rightIcon}
          ></SimpleLineIconsIcon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(74,74,74,1)",
    paddingRight: 8,
    paddingLeft: 8
  },
  leftWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  leftIconButton: {
    flexDirection: "row"
  },
  leftIcon: {
    color: "rgba(255,255,255,1)",
    fontSize: 32
  },
  kembali: {
    alignSelf: "center",
    fontSize: 17,
    paddingLeft: 5,
    color: "rgba(255,255,255,1)"
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  notifikasi: {
    fontSize: 17,
    lineHeight: 17,
    color: "rgba(255,255,255,1)"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  button: {},
  rightIcon: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 25
  }
});

export default Notifheader;
