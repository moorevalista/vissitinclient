import React, { Component, useRef, useEffect } from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";

function Mapslokasi(props) {
  const lat = parseFloat(props.lat);
  const lon = parseFloat(props.lon);

  const refMap = useRef(null);

  useEffect(() => {
    refMap.current.animateToRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
  },[lat, lon]);

  function openMaps() {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lon}`;
    const label = 'Lokasi Anda';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);  
  }

  return (
    <View style={[styles.container, props.style]}>
      <MapView
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={[]}
        style={styles.MapView1}
        provider={PROVIDER_GOOGLE}
        ref={refMap}
      >
        <Marker draggable
          coordinate={{ latitude : lat, longitude : lon }}
          //onPress={openMaps}
          onDragEnd={(e) => props.onMarkerDragEnd(e.nativeEvent.coordinate)}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,1)"
  },
  MapView1: {
    flex: 1,
    backgroundColor: "rgb(230,230,230)"
  }
});

export default Mapslokasi;
