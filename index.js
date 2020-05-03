/* eslint-disable no-undef */
/**
 * @format
 */
const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : (GLOBAL.XMLHttpRequest =
      GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest);
XMLHttpRequest = _XHR;

import React from 'react';
import {AppRegistry} from 'react-native';

// Components
import App from './App';
import {name as appName} from './app.json';
// import {getBluezonerAmount} from './app/apis/bluezone';

import {registerBackgroundMessageHandler} from './app/CloudMessaging';

// Register background handler
// registerBackgroundMessageHandler(async remoteMessage => {
// console.log('registerBackgroundMessageHandler', JSON.stringify(remoteMessage));
// getBluezonerAmount((amount) => console.log('getBluezonerAmount', amount), (error) => console.log('amount', error ));
// });

// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }
//
//   return <App />;
// }

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => registerBackgroundMessageHandler,
); // <-- Add this line
