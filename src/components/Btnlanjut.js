import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnlanjut(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={() => {
        if(props.page === 'rootService') {
          (props.type === 'reguler') ? props.handleNextReguler(props.name) : props.handleNextKhusus(props.name)
        }else if(props.page === 'LayananFirst' || props.page === 'LayananKhusus') {
          props.handleNext();
        }else if(props.page === 'notifReservasi') {
          props.cancelReservasi();
        }
      }}
    >
      <Text style={styles.lanjut}>LANJUT</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginVertical: 20,
    //marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    height: 40,
  },
  lanjut: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  }
});

export default Btnlanjut;
