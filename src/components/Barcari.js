import React, { Component } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

function Barcari(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect}>
        <View style={styles.textInputStack}>
          <TextInput
            placeholder="Cari Layanan"
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.buttoncari}>
            <View style={styles.iconStack}>
              <Icon name="magnifying-glass" style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect: {
    height: 53,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 100,
    backgroundColor: "#fff"
  },
  textInputStack: {
    flex: 1,
    flexDirection: 'row',
    padding: '1%',
    paddingLeft: '4%'
  },
  textInput: {
    flex: 0.85,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18
  },
  buttoncari: {
    flex: 0.15
  },
  iconStack: {
    flex: 1,
    alignSelf: 'center'
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 32
  }
});

export default Barcari;
