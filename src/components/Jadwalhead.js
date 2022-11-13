import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";

function Jadwalhead({props, style}) {

  function goBack() {
    props.navigation.goBack();
  }
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity style={styles.leftIconButton} onPress={() => goBack()}>
          <IoniconsIcon
            name="ios-arrow-back"
            style={styles.leftIcon}
          ></IoniconsIcon>
          <Text style={styles.kembali}>Kembali</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.jadwal}>
          Jadwal
        </Text>
      </View>
      <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.button}>
          <SimpleLineIconsIcon
            name="bell"
            style={styles.rightIcon}
          ></SimpleLineIconsIcon>
          <Svg viewBox="0 0 7.34 7.34" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={4}
              cy={4}
              rx={4}
              ry={4}
            ></Ellipse>
          </Svg>
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
  jadwal: {
    fontSize: 17,
    lineHeight: 17,
    color: "rgba(255,255,255,1)"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  button: {
    width: 28
  },
  rightIcon: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 23
  },
  ellipse: {
    top: 1,
    left: 13,
    width: 7,
    height: 7,
    position: "absolute"
  }
});

export default Jadwalhead;
