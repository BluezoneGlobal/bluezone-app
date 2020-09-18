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

import firebase from 'react-native-firebase';
import {Platform} from 'react-native';

import {retryRegisterOrUpdateTokenFirebase} from '../configuration';

// Const
import {FCM_CHANNEL_ID, FCM_CHANNEL_DES, FCM_CHANNEL_NAME} from '../const/fcm';

/**
 * Tra ve Token firebase moi nhat
 * (Chi dung cho 2 ham sync trong configuration, khong duoc goi tu cac noi khac)
 * @param success
 * @param failure
 */
function getTokenFirebase(success, failure) {
  firebase
    .messaging()
    .getToken()
    .then(success)
    .catch(failure);
}

function registerTokenRefresh(callback) {
  firebase.messaging().onTokenRefresh(callback);
}

/**
 * Dong bo token firebase voi server
 */
function requestTokenFirebase() {
  if (Platform.OS === 'android') {
    const channel = new firebase.notifications.Android.Channel(
      FCM_CHANNEL_ID,
      FCM_CHANNEL_NAME,
      firebase.notifications.Android.Importance.Max,
    ).setDescription(FCM_CHANNEL_DES);

    // Create the channel
    firebase.notifications().android.createChannel(channel);
  }

  // TODO can update them su dung job
  // Get the device token
  getTokenFirebase(retryRegisterOrUpdateTokenFirebase);

  // TODO can update them su dung job
  // Listen to whether the token changes
  registerTokenRefresh(retryRegisterOrUpdateTokenFirebase);
}

function registerMessageHandler(callback) {
  return firebase.messaging().onMessage(callback);
}

function registerNotificationDisplay(callback) {
  return firebase.notifications().onNotificationDisplayed(callback);
}

const registerNotificationOpened = callback => {
  return firebase.notifications().onNotificationOpened(callback);
};

const registerInitialNotification = callback => {
  firebase
    .notifications()
    .getInitialNotification()
    .then(callback);
};

const removeDeliveredNotification = id => {
  firebase.notifications().removeDeliveredNotification(id);
};

const displayNotification = notification => {
  firebase.notifications().displayNotification(notification);
};

const cancelNotification = id => {
  firebase.notifications().cancelNotification(id);
};

const scheduleNotification = (notification, options) => {
  firebase.notifications().scheduleNotification(notification, options);
};

const createNotification = () => {
  return new firebase.notifications.Notification();
};

const setBadge = count => {
  firebase.notifications().setBadge(count);
};

export {
  requestTokenFirebase,
  registerMessageHandler,
  registerNotificationOpened,
  registerInitialNotification,
  removeDeliveredNotification,
  displayNotification,
  cancelNotification,
  scheduleNotification,
  getTokenFirebase,
  createNotification,
  registerNotificationDisplay,
  setBadge,
};
