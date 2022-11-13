import React, { Component, useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { RNCamera } from 'react-native-camera';

function Scanner(props) {
  const cameraRef = useRef();
  const scanner = useState(props.scanner);

  //for android preview
  const {height, width} = Dimensions.get('window');
  const newWidth = height*(2/6);
  const widthOffset = -((newWidth-width)/2);

  //console.log(widthOffset);

  /*const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };*/

  const handleReading = async (barcodes) => {
    if(barcodes.length > 0) {
      await props.setScanner(false);
      await props.setCodeUrl(barcodes[0].url);
    }
  }

  return (
    <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={Platform.OS === 'android' ? [styles.previewAndroid, {left: widthOffset, right:widthOffset}] : styles.previewIOS}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            (scanner) ? handleReading(barcodes) : null;
            //console.log(barcodes);
          }}
        />
        {/*<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>*/}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewIOS: {
    flex: 1
  },
  previewAndroid: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

});

export default Scanner;
