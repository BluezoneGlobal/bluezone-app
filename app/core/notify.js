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

// TODO Can loai bo language ra khoi tham so dau vao ham. Luon check truc tiep trang thai ngon ngu hien tai.
import {
  createNotification,
  displayNotification,
  removeDeliveredNotification,
  cancelNotification,
} from './fcm';
import {FCM_CHANNEL_ID, SMALL_ICON} from '../const/fcm';
import firebase from 'react-native-firebase';

/**
 * Gui 1 local notification
 * @param notifyObj
 * @param language
 */
function pushNotify(notifyObj, language = 'vi') {
  const {
    title,
    titleEn,
    text,
    textEn,
    bigText,
    bigTextEn,
    largeIcon,
    buttonText,
    buttonTextEn,
  } = notifyObj.data;
  const isVI = language === 'vi';

  const _title = (isVI ? title : titleEn) || title || titleEn;
  const _text = (isVI ? text : textEn) || text || textEn;
  const _big = (isVI ? bigText : bigTextEn) || bigText || bigTextEn;
  const _buttonText = isVI ? buttonText : buttonTextEn;

  const notification = createNotification()
    .setNotificationId(notifyObj.data.notifyId)
    .setTitle(_title)
    .setBody(_big)
    .setData({
      ...notifyObj.data,
    })
    .android.setBigText(_text)
    .android.setChannelId(FCM_CHANNEL_ID)
    .android.setSmallIcon(SMALL_ICON)
    .android.setLargeIcon(largeIcon);

  if (_buttonText) {
    const action = new firebase.notifications.Android.Action(
      'open',
      SMALL_ICON,
      buttonText,
    );
    notification.android.addAction(action);
  }

  displayNotification(notification);
}

/**
 * Dong 1 local notification
 * @param notifyId
 */
function removeNotify(notifyId) {
  if (!notifyId) {
    return;
  }
  removeDeliveredNotification(notifyId);
}

function cancelNotify(notifyId) {
  cancelNotification(notifyId);
}

export {pushNotify, removeNotify, cancelNotify};
