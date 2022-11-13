import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";
import { CommonActions } from '@react-navigation/native';

import Event from '../Event';
import RemotePushController from '../RemotePushController';

function Footermenu({ props, paramsCheck = null }) {
  //alert(JSON.stringify(paramsCheck));
  const [currentScreen, setCurrentScreen] = useState(props.route.name);
  //alert(props.route.name);

  const openNotif = async () => {
    //props.navigation.navigate('notifikasiScreen', { base_url: props.route.params.base_url });
    if(currentScreen !== 'notifikasiScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'homeScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'notifikasiScreen',
              params: { base_url: props.route.params.base_url },
            }
          ],
        })
      )
    }
  }

  const openJadwal = async () => {
    //props.navigation.navigate('jadwalScreen', { base_url: props.route.params.base_url });
    if(currentScreen !== 'jadwalScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'homeScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'jadwalScreen',
              params: { base_url: props.route.params.base_url },
            }
          ],
        })
      )
    }
  }

  const openHome = async() => {
    if(currentScreen !== 'homeScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'homeScreen',
              params: { base_url: props.route.params.base_url },
            }
          ],
        })
      )
    }
  }

  const openReport = async() => {
    //props.navigation.navigate('laporanScreen', { base_url: props.route.params.base_url });
    if(currentScreen !== 'laporanScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'homeScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'laporanScreen',
              params: { base_url: props.route.params.base_url },
            }
          ],
        })
      )
    }
  }

  const openSetting = async() => {
    //alert(currentScreen);
    //props.navigation.navigate('settingScreen', { base_url: props.route.params.base_url } );
    if(currentScreen !== 'settingScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'homeScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'settingScreen',
              params: { base_url: props.route.params.base_url },
            }
          ],
        })
      )
    }
  }

  return (
    <View style={styles.container}>
      <View></View>
      <TouchableOpacity style={styles.btnWrapper1} onPress={openNotif}>
        <View style={styles.box}>
          <SimpleLineIconsIcon
            name="bubble"
            style={[
              styles.icon,
              {
                color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
              }
            ]}
          ></SimpleLineIconsIcon>
          <Svg viewBox="0 0 6.76 7.1" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={3}
              cy={4}
              rx={3}
              ry={4}
            ></Ellipse>
          </Svg>
        </View>
        <Text
          style={[
            styles.pesan,
            {
              color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
            }
          ]}
        >
          Pesan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnWrapper1} onPress={openJadwal}>
        <View style={styles.box}>
          <SimpleLineIconsIcon
            name="calendar"
            style={[
              styles.icon,
              {
                color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
              }
            ]}
          ></SimpleLineIconsIcon>
          {/*<Svg viewBox="0 0 6.76 7.1" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={3}
              cy={4}
              rx={3}
              ry={4}
            ></Ellipse>
          </Svg>*/}
        </View>
        <Text
          style={[
            styles.pesan,
            {
              color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
            }
          ]}
        >
          Jadwal
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnWrapper1} onPress={openHome}>
        <View style={styles.box}>
          <SimpleLineIconsIcon
            name="location-pin"
            style={[
              styles.icon,
              {
                color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
              }
            ]}
          ></SimpleLineIconsIcon>
          {/*<Svg viewBox="0 0 6.76 7.1" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={3}
              cy={4}
              rx={3}
              ry={4}
            ></Ellipse>
          </Svg>*/}
        </View>
        <Text
          style={[
            styles.pesan,
            {
              color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
            }
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnWrapper1} onPress={openReport}>
        <View style={styles.box}>
          <SimpleLineIconsIcon
            name="doc"
            style={[
              styles.icon,
              {
                color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
              }
            ]}
          ></SimpleLineIconsIcon>
          {/*<Svg viewBox="0 0 6.76 7.1" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={3}
              cy={4}
              rx={3}
              ry={4}
            ></Ellipse>
          </Svg>*/}
        </View>
        <Text
          style={[
            styles.pesan,
            {
              color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
            }
          ]}
        >
          Laporan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnWrapper1} onPress={openSetting}>
        <View style={styles.box}>
          <SimpleLineIconsIcon
            name="wrench"
            style={[
              styles.icon,
              {
                color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
              }
            ]}
          ></SimpleLineIconsIcon>
          {/*<Svg viewBox="0 0 6.76 7.1" style={styles.ellipse}>
            <Ellipse
              strokeWidth={0}
              fill="rgba(255,0,31,1)"
              cx={3}
              cy={4}
              rx={3}
              ry={4}
            ></Ellipse>
          </Svg>*/}
        </View>
        <Text
          style={[
            styles.pesan,
            {
              color: props.active ? "#007AFF" : "rgba(0,0,0,1)"
            }
          ]}
        >
          Setting
        </Text>
      </TouchableOpacity>
      <Event props={props} paramsCheck={paramsCheck} />
      <RemotePushController props={props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(80,227,194,1)",
    justifyContent: "space-between",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  btnWrapper1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {},
  icon: {
    backgroundColor: "transparent",
    opacity: 0.8,
    fontSize: 25
  },
  ellipse: {
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    position: 'absolute'
  },
  pesan: {
    backgroundColor: "transparent",
    paddingTop: 4,
    fontSize: 12,
    lineHeight: 12
  }
});

export default Footermenu;
