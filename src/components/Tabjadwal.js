import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

function Tabjadwal(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.textWrapper}>
        <TouchableOpacity style={[props.activeTab === 'aktif' ? styles.segmentTextWrapperActive : styles.segmentTextWrapper, {borderBottomLeftRadius: 5, borderTopLeftRadius: 5}]} onPress={() => props.changeTab('aktif')} >
          <Text style={props.activeTab === 'aktif' ? styles.labelActive : styles.label}>Jadwal Aktif</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[props.activeTab === 'selesai' ? styles.segmentTextWrapperActive : styles.segmentTextWrapper, {borderBottomRightRadius: 5, borderTopRightRadius: 5}]} onPress={() => props.changeTab('selesai')} >
          <Text style={props.activeTab === 'selesai' ? styles.labelActive : styles.label}>Selesai</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  textWrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row"
  },
  segmentTextWrapperActive: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,1)",
    padding: 6,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,1)",
  },
  segmentTextWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,1)",
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0
  },
  labelActive: {
    fontSize: 13,
    color: "rgba(255,255,255,1)"
  },
  label: {
    fontSize: 13,
    color: "rgba(0,0,0,1)"
  }
});

export default Tabjadwal;
