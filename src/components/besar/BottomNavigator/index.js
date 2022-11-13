import React from 'react';
import {View, StyleSheet} from 'react-native';
import TabItem from '../TabItem';

const BottomNavigator = ({state, descriptors, navigation, props}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  //console.log(props);

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/*<View style={styles.Wrepper}>
        <View>
          <View style={styles.WrepperIconKiriPutih} />
          <View style={styles.WrepperIconKiriHitam} />
        </View>
        <View>
          <View style={styles.WrepperIconKananPutih} />
          <View style={styles.WrepperIconKananHitam} />
        </View>
      </View>*/}
      <View style={styles.Navbar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View style={{paddingHorizontal: 0, flex: 1, alignItems: 'center',}} key={index}>
              <TabItem
                key={index}
                label={label}
                isFocused={isFocused}
                onLongPress={onLongPress}
                onPress={onPress}
                props={props}
              />
            </View>
          );
        })}
      </View>
      {/* <View style={styles.Background}></View> */}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    backgroundColor: 'rgba(54,54,54,1)',
    width: '100%',
    height: '10%',
    paddingVertical: '4%',
  },
  Wrepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -50,
  },
  WrepperIconKiriPutih: {
    width: 20,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 50,
    zIndex: 1, //For iOS
    elevation: 1,
  },
  WrepperIconKiriHitam: {
    width: 20,
    height: 40,
    marginTop: -20,
    backgroundColor: 'rgba(54,54,54,1)',
    borderBottomLeftRadius: 50,
  },

  WrepperIconKananPutih: {
    width: 20,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomRightRadius: 50,
    zIndex: 1, //For iOS
    elevation: 1,
  },
  WrepperIconKananHitam: {
    width: 20,
    height: 40,
    marginTop: -20,
    backgroundColor: 'rgba(54,54,54,1)',
    borderBottomRightRadius: 50,
  },
  Navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(54,54,54,1)',
    width: '100%'
  },
  Background: {
    position: 'absolute',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: '100%',
    height: '30%',
  },
});
