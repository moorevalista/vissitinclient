import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import Pesan from 'react-native-vector-icons/Ionicons';
import Jadwal from 'react-native-vector-icons/AntDesign';
import Laporan from 'react-native-vector-icons/MaterialCommunityIcons';
import Event from '../../../Event';
import RemotePushController from '../../../RemotePushController';

const TabItem = ({isFocused, onLongPress, onPress, label, props, paramsCheck = null}) => {
  //console.log(props);
  const Icon = () => {
    if (label === 'Pesan') {
      return <Pesan style={styles.icon(isFocused)} name="chatbox" />;
    }

    if (label === 'Jadwal') {
      return <Jadwal style={styles.icon(isFocused)} name="calendar" />;
    }

    if (label === 'Beranda') {
      return <Pesan style={styles.icon(isFocused)} name="grid-outline" />;
    }

    if (label === 'Laporan') {
      return (
        <Laporan style={styles.icon(isFocused)} name="clipboard-text-outline" />
      );
    }

    if (label === 'Setting') {
      return <Icons style={styles.icon(isFocused)} name="settings" />;
    }
  };

  return (
    <>
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
      <Icon />
      <Text allowFontScaling={false} style={styles.text(isFocused)}>
        {label}
      </Text>
    </TouchableOpacity>
      <Event props={props} paramsCheck={paramsCheck} />
      <RemotePushController props={props} />
    </>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: isFocused => ({
    color: isFocused ? 'white' : '#C4C4C4',
    fontSize: 12,
    marginTop: 4,
  }),
  icon: isFocused => ({
    backgroundColor: 'transparent',
    color: isFocused ? 'white' : '#C4C4C4',
    fontSize: 14,
    opacity: 0.8,
  }),
});
