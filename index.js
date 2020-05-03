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
import LanguageProvider from "./app/utils/LanguageProvider";
import ContextProvider from "./LanguageContext";
import {translationMessages} from "./app/i18n";
import {NavigationContainer} from "@react-navigation/native";

// Register background handler
registerBackgroundMessageHandler(async remoteMessage => {
  // console.log('registerBackgroundMessageHandler', JSON.stringify(remoteMessage));
  // getBluezonerAmount((amount) => console.log('getBluezonerAmount', amount), (error) => console.log('amount', error ));
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return (
      <ContextProvider>
        <LanguageProvider messages={translationMessages}>
          <App />
        </LanguageProvider>
      </ContextProvider>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
