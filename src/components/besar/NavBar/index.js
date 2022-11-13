import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = ({props, label}) => {
  //console.log(props);
  const Icons = ({label, name}) => {
  if (label === 'Panah') {
    return <Icon style={styles.IconPanah} name={name} />;
  }
};

  return (
    <View style={styles.Nav_header}>
      <TouchableOpacity>
        {/*<Image
          style={styles.Tbl_home}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k0aoqpgvbfq-192%3A4672?alt=media&token=cce2696d-a113-46ab-982d-298c9a56d2ed",
          }}
        />*/}
        <View style={styles.Tbl_home}>
          <Icons label="Panah" name="grid" />
        </View>
      </TouchableOpacity>
      <Text style={styles.Txt827}>{label}</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
          (props.route.params.refetchData !== undefined) ? props.route.params.refetchData('aktif') : '';
        }}>
        {/*<Image
          style={styles.Tbl_home}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/k0aoqpgvbfq-192%3A4674?alt=media&token=2a8224a6-6e63-44bc-bfe1-de8219bd12f3",
          }}
        />*/}
        <View style={styles.Tbl_home}>
          <Icons label="Panah" name="chevron-back-sharp" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  Nav_header: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingLeft: 19,
    paddingRight: 19,
    backgroundColor: "rgba(217,217,217,1)",
  },
  Tbl_home: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  IconPanah: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    opacity: 0.8,
  },
  Txt827: {
    fontSize: 18,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    justifyContent: "center",
  },
});
