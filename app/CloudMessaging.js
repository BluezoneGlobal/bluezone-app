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

'use strict';

import messaging from '@react-native-firebase/messaging';
import {setTokenFirebase} from './Configuration';

// https://rnfirebase.io/messaging/usage
async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

async function requestUserPermission(callback) {
  const settings = await messaging().requestPermission();

  callback(settings);
  if (settings) {
    console.log('Permission settings:', settings);
  }
}

async function requestTokenFirebase() {
  // Get the device token
  messaging()
    .getToken()
    .then(token => {
      return setTokenFirebase(token);
    });

  // Listen to whether the token changes
  messaging().onTokenRefresh(token => {
    setTokenFirebase(token);
  });
}

function registerBackgroundMessageHandler(callback) {
  // Register background handler
  messaging().setBackgroundMessageHandler(callback);
}

async function registerMessageHandler(callback) {
  return messaging().onMessage(callback);
}

function getTokenFirebase(callback) {
  messaging()
    .getToken()
    .then(callback);
}

export {
  requestUserPermission,
  requestTokenFirebase,
  registerAppWithFCM,
  registerBackgroundMessageHandler,
  registerMessageHandler,
  getTokenFirebase,
};
