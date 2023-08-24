/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './ignoreWarnings';
import React, {useEffect, useState} from 'react';
import AppNavigator from './src/components/app.navigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PermissionsAndroid, AppState} from 'react-native';
import Server from './src/components/stream/Server';

// import {createServer} from 'miragejs';
//
// if (window.server) {
//   server.shutdown();
// }
//
// window.server = createServer({
//   routes() {
//     this.post('/video/key', (schema, request) => {
//       let attrs = JSON.parse(request.requestBody);
//       console.log(attrs);
//       return attrs;
//     });
//   },
// });

const server = new Server();

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);

      const hasCameraPermission =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const hasWritePermission =
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const hasReadPermission =
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (hasCameraPermission && hasWritePermission && hasReadPermission) {
        console.log('All permissions are granted');
      } else {
        console.log('Storage and/or Camera permissions are denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestPermissions();
    AppState.addEventListener('change', handleAppStateChange);
    server.startServer();

    return () => {
      server.stopServer();
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, start the server
      server.startServer();
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has gone to the background, stop the server
      server.stopServer();
    }

    setAppState(nextAppState);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
