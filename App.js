/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useState, useEffect, useRef} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer, useNavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import firebase from 'react-native-firebase';
// import analytics from '@react-native-firebase/analytics';

//
import AuthLoading from './app/main/components/AuthLoadingScreen';
import Home from './app/main/components/MainScreen';
import decorateMainAppStart from './app/main/decorateMainAppStart';
import WatchScan from './app/main/components/WatchScanScreen';
import HistoryScan from './app/main/components/HistoryScanScreen';
import NotifyDetail from './app/main/components/NotifyDetail';
import NotifyWarning from './app/main/components/NotifyWarning';
import Invite from './app/main/components/InviteScreen';
import Register from './app/main/components/RegisterScreen';
import VerifyOTP from './app/main/components/VerifyOTPScreen';
import {navigationRef, navigate} from './RootNavigation';
import {registerAppWithFCM, registerMessageHandler} from './app/CloudMessaging';
import {createNotify, replaceNotify, open} from './app/db/SqliteDb';
import ContextProvider from './LanguageContext';
import LanguageProvider from './app/utils/LanguageProvider';
import {translationMessages} from './app/i18n';
import configuration from './app/Configuration';

const Stack = createStackNavigator();
// const prefix = 'mic.bluezone://';

// Gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [initialRoute, setInitialRoute] = useState('AuthLoading');

  const setAuthLoading = navi => {
    if(navi === 'RegisterAuth') {
      navigate('RegisterAuth')
    } else {
      setLoading(true);
      setInitialRoute('Home');
    }
  };

    open();
    createNotify();

  useEffect(() => {
    // const state = navigationRef.current.getRootState();
    registerAppWithFCM();

    // Save the initial route name
    // routeNameRef.current = getActiveRouteName(state);
    registerMessageHandler(async onRemotemessage => {
        const {Language} = configuration;
        replaceNotify(onRemotemessage, Language);
    });

    open();
    createNotify();
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    firebase.notifications().onNotificationOpened(remoteMessage => {
      const obj = remoteMessage.notification;
      if (
        obj && obj.data.group === 'WARN'
      ) {
        navigate('NotifyWarning', {item: obj});
      } else if (
          obj && obj.data.group === 'INFO'
      ) {
        navigate('NotifyDetail', {item: {title: obj.title, bigText: obj.body, timestamp: obj.data.timestamp, text: obj.data.text}});
      } else {
        navigate('Register', remoteMessage);
      }
      // firebase.notifications().cancelNotification(remoteMessage.notification._notificationId);
      firebase
        .notifications()
        .removeDeliveredNotification(
          remoteMessage.notification._notificationId,
        );
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification._notificationId,
      );
    });

    // Check whether an initial notification is available
    firebase
      .notifications()
      .getInitialNotification()
      .then(remoteMessage => {
        const obj = remoteMessage.notification;
        if (remoteMessage) {
          if (
              obj && obj.data.group === 'WARN'
          ) {
            navigate('NotifyWarning', {item: obj});
          }
          if (
              obj && obj.data.group === 'INFO'
          ) {
            navigate('NotifyDetail', {item: {title: obj.title, bigText: obj.body, timestamp: obj.data.timestamp, text: obj.data.text}});
          }
          firebase
            .notifications()
            .removeDeliveredNotification(
              remoteMessage.notification._notificationId,
            );
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification._notificationId,
          );
        }
      });
  }, []);

  return (
    <ContextProvider>
      <LanguageProvider messages={translationMessages}>
        <NavigationContainer
          ref={navigationRef}
          // onStateChange={state => {
          //   const previousRouteName = routeNameRef.current;
          //   const currentRouteName = getActiveRouteName(state);
          //
          //   if (previousRouteName !== currentRouteName) {
          //     analytics().setCurrentScreen(currentRouteName, currentRouteName);
          //     // alert(`The route changed to "${currentRouteName}"`);
          //   }
          // }}
        >
          <Stack.Navigator
            headerMode="none"
            mode="card"
            initialRouteName={initialRoute}>
            {!loading ? (
              <>
                <Stack.Screen
                  name="AuthLoading"
                  component={(props) => <AuthLoading setLoading={setAuthLoading} {...props} />}
                />
                <Stack.Screen
                  name="RegisterAuth"
                  component={(props) => <Register setLoading={setAuthLoading} {...props}  />}
                />
                <Stack.Screen
                  name="VerifyOTPAuth"
                  component={(props) => <VerifyOTP setLoading={setAuthLoading} {...props}  />}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={decorateMainAppStart(Home)}
                />
                <Stack.Screen name="WatchScan" component={WatchScan} />
                <Stack.Screen name="HistoryScan" component={HistoryScan} />
                <Stack.Screen path="cuongntg" name="NotifyDetail" component={NotifyDetail} />
                <Stack.Screen name="NotifyWarning" component={NotifyWarning} />
                <Stack.Screen name="Invite" component={Invite} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ContextProvider>
  );
}
