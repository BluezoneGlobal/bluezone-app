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

import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

const TraceCovid =
  Platform.OS === 'ios'
    ? NativeModules.ScannerManager
    : NativeModules.TraceCovid;

const eventEmitter = new NativeEventEmitter(NativeModules.TraceCovid);

const startService = (scanFull = false) => {
  if (Platform.OS === 'ios') {
    TraceCovid.startService();
  } else {
    TraceCovid.startService(!!scanFull);
  }
};

const setConfig = config => {
  if (Platform.OS === 'ios') {
    if (config.TimeSaveLog) {
      config.TimeSaveLog &&
        config.TimeSaveLog > 0 &&
        TraceCovid.onSetTimeDelay(config.TimeSaveLog);

      config.MaxNumberSubKey &&
        config.MaxNumberSubKey > 0 &&
        TraceCovid.setMaxNumberSubKey(config.MaxNumberSubKey);
    }
  } else {
    TraceCovid.setConfig({...config});
  }
};

// TODO Ham nay moi Android su dung?
const addListener = (event, onScan) => {
  return eventEmitter.addListener(event, onScan);
};

const addListenerScanBLE = onScan => {
  return addListener('onScanResult', onScan);
};

const addListenerScanBluetooth = onScan => {
  return addListener('onScanBlueToothResult', onScan);
};

const setLanguage = language => {
  Platform.OS === 'android' && TraceCovid.setLanguage(language);
};

const checkContactF = async data => {
  return await TraceCovid.checkContactF(data);
};

const getBluezoneIdInfo = async (dayStartTrace = 14) => {
  return await TraceCovid.getBluezoneIdInfo(dayStartTrace);
};

const writeHistoryContact = async dayStartTrace => {
  return await TraceCovid.writeHistoryContact(dayStartTrace || 14);
};

const getBluezoneId = async () => {
  return await TraceCovid.getBluezoneId();
};

const getFirst6Char = bzId =>
  bzId && bzId.length >= 6 ? bzId.substring(0, 6).concat('***') : bzId;

const getBluezoneIdFirst6Char = async () => {
  const bzId = await getBluezoneId();
  return getFirst6Char(bzId);
};

const setContentNotify = (title, content) => {
  Platform.OS === 'android' && TraceCovid.setContentNotify(title, content);
};

let version;
const getVersion = () => {
  if (!version) {
    if (
      Platform.OS === 'android' ||
      Platform.OS === 'ios' ||
      Platform.OS === 'windows'
    ) {
      version = TraceCovid.appVersion;
    } else {
      version = 'unknown';
    }
  }
  return version;
};

const getFontScale = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return TraceCovid.getFontScale();
  }
  return -1;
};

const androidOpenSettings = settingsName => {
  if (Platform.OS !== 'android') {
    return;
  }
  TraceCovid.openSettings(settingsName);
};

const service = {
  startService,
  setConfig,
  addListener,
  addListenerScanBLE,
  addListenerScanBluetooth,
  setLanguage,
  checkContactF,
  getBluezoneIdInfo,
  writeHistoryContact,
  getFirst6Char,
  getBluezoneId,
  getBluezoneIdFirst6Char,
  setContentNotify,
  getVersion,
  getFontScale,
  androidOpenSettings,
};

export default service;
