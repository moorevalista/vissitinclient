import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Btnrequest(props) {
  const [styleButton, setStyleButton] = useState(props.otpRequested);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.otpRequested]);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.otpVerified]);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.nohp]);

  return (
    <TouchableOpacity disabled={(props.otpVerified || !props.otpRequested || props.nohp === '') ? true : false} style={[styleButton, props.style]} onPress={props.requestOTP}>
      <Text style={styles.reqOtp}>{props.seconds > 0 ? '(' + props.seconds + ' detik)': 'REQ OTP'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  containerDisabled: {
    backgroundColor: "rgba(0,0,0,0.50)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  reqOtp: {
    color: "rgba(255,255,255,1)",
    fontSize: 17
  }
});

export default Btnrequest;
