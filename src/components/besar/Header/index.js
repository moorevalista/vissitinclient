import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({dataLogin, props, base_url, updateData}) => {

  const Icons = ({label, name}) => {
    return <Icon style={styles.Iconarrow} name={name} />;
  };

  const IconImage = ({label, name}) => {
    return <Icon style={{color: 'rgba(106,120,132,1)', fontSize: 48,}} name={name} />;
  };
  
  const openProfile = async() => {
    props.navigation.navigate('EditDataPribadi', { base_url: base_url, updateData: updateData } );
  }

  return (
    <View style={styles.User}>
      {/*<Image
        style={styles.Useravatar}
        /*source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/d85civcx39-108%3A7729?alt=media&token=9516c316-ae1b-4b31-b208-4c30fe773c85',
        }}
      />*/}
      <IconImage label="Edit" name="person-circle-outline" />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={styles.Text}>
          <Text style={styles.Txt241}>{dataLogin.nama_pasien}</Text>
          <Text style={styles.Txt576}>{dataLogin.hp}</Text>
        </View>
        {updateData ?
          <TouchableOpacity
            onPress={openProfile}>
            <Icons label="Edit" name="create-sharp" />
          </TouchableOpacity>
          :
          <></>
        }
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  User: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    //paddingBottom: '10%',
    paddingVertical: '2%',
  },
  Useravatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 100
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
  },
  Txt241: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
    marginBottom: 4,
  },
  Txt576: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
  },
  Iconarrow: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 24,
    opacity: 0.8,
  },
});
