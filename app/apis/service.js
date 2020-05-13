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
  Platform.OS !== 'ios'
    ? NativeModules.TraceCovid
    : NativeModules.ScannerManager;

const eventEmitter = new NativeEventEmitter(NativeModules.TraceCovid);

const startService = scanFull => {
  if (Platform.OS !== 'ios') {
    TraceCovid.startService(!!scanFull);
  } else {
    TraceCovid.startService();
  }
};

const setConfig = config => {
  if (Platform.OS !== 'ios') {
    TraceCovid.setConfig(config);
  } else if (config.TimeSaveLog) {
    config.TimeSaveLog &&
      config.TimeSaveLog > 0 &&
      TraceCovid.onSetTimeDelay(config.TimeSaveLog);
    config.MaxNumberSubKey &&
      config.MaxNumberSubKey > 0 &&
      TraceCovid.setMaxNumberSubKey(config.MaxNumberSubKey);
  }
};

const addListener = (event, onScan) => {
  return eventEmitter.addListener(event, onScan);
};

const addListenerScanBLE = onScan => {
  return eventEmitter.addListener('onScanResult', onScan);
};

const addListenerScanBlueTooth = onScan => {
  return eventEmitter.addListener('onScanBlueToothResult', onScan);
};

const addListenerBluezoneIdAndroidChange = onChange => {
  if (Platform.OS === 'ios') {
    return null;
  }
  return eventEmitter.addListener('onBluezoneIdChange', bzId => {
    onChange(getFirst6Char(bzId));
  });
};

const getBluezoneIdDataIOS = async () => {
  return TraceCovid.getBluezoneIdData && (await TraceCovid.getBluezoneIdData());
};

const addListenerBluezoneIdDataChange = onChange => {
  return eventEmitter.addListener('onBluezoneIdDataChange', onChange);
};

const changeLanguageNotifi = language => {
  Platform.OS !== 'ios' && TraceCovid.setLanguage(language);
};

const checkContact = ids => {
  return Platform.OS !== 'ios' && TraceCovid.checkContact(ids);
};

const writeHistoryContact = ids => {
  return Platform.OS !== 'ios' && TraceCovid.writeHistoryContact(ids);
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

const service = {
  startService,
  setConfig,
  addListener,
  addListenerScanBLE,
  addListenerScanBlueTooth,
  addListenerBluezoneIdAndroidChange,
  changeLanguageNotifi,
  checkContact,
  writeHistoryContact,
  getFirst6Char,
  getBluezoneIdFirst6Char,
  getBluezoneIdDataIOS,
  addListenerBluezoneIdDataChange,
};

export default service;
