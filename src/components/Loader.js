import React, { Component } from "react";
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


function Loader(props) {
  if (props.visible) {
  return (
    Platform.select({
      ios:
        <View style={styles.container}>
          <View style={styles.scrollAreaStack}>
            <View style={styles.scrollArea}>
                <Image style={styles.image} source={require('../assets/images/icon_loader.gif')} />
            </View>
          </View>
        </View>,
      android:
        <Spinner
          visible={props.visible}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
          color="#236CFF"
          overlayColor="rgba(255, 255, 255, 0.5)"
        />
    })
  );
  }else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollAreaStack: {
    flex: 1
  },
  scrollArea: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  image: {
    alignSelf: "center"
  }
});

export default Loader;
