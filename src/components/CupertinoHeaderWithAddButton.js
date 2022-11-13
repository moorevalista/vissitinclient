import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";

function CupertinoHeaderWithAddButton(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity style={styles.leftIconButton}>
          <IoniconsIcon
            name="ios-arrow-back"
            style={styles.leftIcon}
          ></IoniconsIcon>
          <Text style={styles.leftText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.title}>
          Title
        </Text>
      </View>
      <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.button}>
          <IoniconsIcon name="ios-add" style={styles.rightIcon}></IoniconsIcon>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button1}>
        <SimpleLineIconsIcon
          name="bell"
          style={styles.rightIcon1}
        ></SimpleLineIconsIcon>
        <Svg viewBox="0 0 7.34 7.34" style={styles.ellipse1}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
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
    color: "#007AFF",
    fontSize: 32
  },
  leftText: {
    alignSelf: "center",
    fontSize: 17,
    paddingLeft: 5,
    color: "#007AFF"
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 17,
    lineHeight: 17,
    color: "#000"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  button: {},
  rightIcon: {
    backgroundColor: "transparent",
    color: "#007AFF",
    fontSize: 32
  },
  button1: {
    width: 28,
    alignSelf: "center"
  },
  rightIcon1: {
    backgroundColor: "transparent",
    color: "rgba(0,0,0,1)",
    fontSize: 23
  },
  ellipse1: {
    top: 1,
    left: 13,
    width: 7,
    height: 7,
    position: "absolute"
  }
});

export default CupertinoHeaderWithAddButton;
