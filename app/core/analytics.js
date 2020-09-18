/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 08/28/2020, 14:36
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

import {Platform} from 'react-native';
import firebase from 'react-native-firebase';

import {getTimeAnalyticsBle, setTimeAnalyticsBle} from './storage';
import {getBluetoothState} from './bluetooth';
import {NOTIFICATION_TYPE} from '../const/notification';

async function reportBluetoothState() {
  if (Platform.OS === 'android') {
    return;
  }
  // lay thoi gian ban len truoc do
  let previousTime = (await getTimeAnalyticsBle()) || 0;
  previousTime = new Date(previousTime);
  const previousHour = previousTime.setMinutes(0, 0, 0);

  // lay thoi gian hien tai
  const currentTime = new Date();
  const currentHour = currentTime.setMinutes(0, 0, 0);

  // 1 tieng gui thong ke len server 1 lan
  if (previousHour !== currentHour) {
    const hour = currentTime.getHours();
    const isEnable = await getBluetoothState();
    const eventName = `Bluetooth_${isEnable ? 'ON' : 'OFF'}_${hour}_hour`;
    firebase.analytics().logEvent(eventName, {value: 'bluetoothStatus'});
    setTimeAnalyticsBle(currentTime);
  }
}

// Xu ly day trang thai bluetooth len server bat ke moc thoi gian
const bluetoothChangeListener = () => {
  reportBluetoothState().then(() => {});
};

function reportPushAnalytics(key) {
  const eventName = NOTIFICATION_TYPE.PING_PONG;
  firebase.analytics().logEvent(`${eventName}_${key}`, {value: key});
}

export {reportBluetoothState, bluetoothChangeListener, reportPushAnalytics};
