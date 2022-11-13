import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/router';
import FlashMessage from 'react-native-flash-message';

const linking = {
  prefixes: [
    'pasien.vissit.in://'
  ],
  config: {
    screens: {
      loginScreen: {
        path: 'login',
      },
      lupaPass: {
        path: 'lupaPass',
      },
      setNewPass: {
        path: 'resetPassword/:id/:token',
        parse: {
          id: (id) => `${id}`,
          token: (token) => `${token}`,
        },
      },
    },
  },
};

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

class App extends Component {
  render() {
    return (
      <NavigationContainer linking={linking} fallback={<></>}>
        <Router />
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  }
}

export default App;
