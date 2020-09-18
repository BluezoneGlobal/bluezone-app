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

import AsyncStorage from '@react-native-community/async-storage';

import {
  ResourceLanguage,
  Configuration,
  TokenForDeclaration,
  JobImmediately,
  HistoryDays,
  IsFirstLoading,
  InfoDeclare,
  TimespanNotification,
  TimesOpenApp,
  FirstTimeOpen,
  TokenFirebase,
  PhoneNumber,
  Language,
  StatusNotifyRegister,
  VersionCurrent,
  LatestVersionApp,
  TimeAnalyticsBle,
  LastTimeClearLog,
  DateOfWelcome,
  DisplayOriginalImg,
  QuestionFAQ,
} from '../const/storage';

// TODO Can sua de moi du lieu ghi vao storage deu dung JSON.stringify, va lay ra deu dung JSON.parse. Dam bao tuong tich ban cu. thay vi ben ngoai phan tu convert nhu gio.
const _processInput = input => {
  if (input instanceof Date) {
    return JSON.stringify(input.getTime());
  }
  return JSON.stringify(input);
};

const _processOutput = output => {
  if (output === null) {
    return output;
  }
  let result;
  try {
    result = JSON.parse(output);
  } catch (e) {
    // Cac truong hop string duoc luu thang vao storage ma khong qua JSON.stringify truoc day se tam thoi nhay vao catch nay.
    result = output;
  }
  return result;
};

const getResourceLanguage = async () => {
  const result = await AsyncStorage.getItem(ResourceLanguage);
  return _processOutput(result);
};

const setResourceLanguage = (resourceLanguage = {}) => {
  const _resource = _processInput(resourceLanguage);
  AsyncStorage.setItem(ResourceLanguage, _resource);
};

const getConfiguration = async () => {
  const result = await AsyncStorage.getItem(Configuration);
  return _processOutput(result);
};

const setConfiguration = (configurationString = {}) => {
  const _resource = _processInput(configurationString);
  AsyncStorage.setItem(Configuration, _resource);
};

const getTokenForDeclaration = async () => {
  const result = await AsyncStorage.getItem(TokenForDeclaration);
  return _processOutput(result);
};

const setTokenForDeclaration = (tokenForDeclaration = '') => {
  const _resource = _processInput(tokenForDeclaration);
  AsyncStorage.setItem(TokenForDeclaration, _resource);
};

const getJobImmediately = async () => {
  const result = await AsyncStorage.getItem(JobImmediately);
  return _processOutput(result);
};

const setJobImmediately = (job = []) => {
  const _resource = _processInput(job);
  AsyncStorage.setItem(JobImmediately, _resource);
};

const getHistoryDays = async () => {
  const result = await AsyncStorage.getItem(HistoryDays);
  return _processOutput(result);
};

const setHistoryDays = (historyDays = []) => {
  const _resource = _processInput(historyDays);
  AsyncStorage.setItem(HistoryDays, _resource);
};

const getIsFirstLoading = async () => {
  const result = await AsyncStorage.getItem(IsFirstLoading);
  return _processOutput(result);
};

const setIsFirstLoading = (firstLoading = true) => {
  const _resource = _processInput(firstLoading);
  AsyncStorage.setItem(IsFirstLoading, _resource);
};

const getInfoDeclare = async () => {
  const result = await AsyncStorage.getItem(InfoDeclare);
  return _processOutput(result);
};

const setInfoDeclare = (infoDeclare = {}) => {
  const _resource = _processInput(infoDeclare);
  AsyncStorage.setItem(InfoDeclare, _resource);
};

const getTimespanNotification = async () => {
  const result = await AsyncStorage.getItem(TimespanNotification);
  return _processOutput(result);
};

const setTimespanNotification = (timespanNotification = 0) => {
  const _resource = _processInput(timespanNotification);
  AsyncStorage.setItem(TimespanNotification, _resource);
};

const getTimesOpenApp = async () => {
  const result = await AsyncStorage.getItem(TimesOpenApp);
  return _processOutput(result);
};

const setTimesOpenApp = (timesOpenApp = 0) => {
  const _resource = _processInput(timesOpenApp);
  AsyncStorage.setItem(TimesOpenApp, _resource);
};

const getFirstTimeOpen = async () => {
  const result = await AsyncStorage.getItem(FirstTimeOpen);
  return _processOutput(result);
};

const setFirstTimeOpen = (firstTimeOpen = 0) => {
  const _resource = _processInput(firstTimeOpen);
  AsyncStorage.setItem(FirstTimeOpen, _resource);
};

const getTokenFirebase = async () => {
  const result = await AsyncStorage.getItem(TokenFirebase);
  return _processOutput(result);
};

const setTokenFirebase = (tokenFirebase = '') => {
  const _resource = _processInput(tokenFirebase);
  AsyncStorage.setItem(TokenFirebase, _resource);
};

const getPhoneNumber = async () => {
  const result = await AsyncStorage.getItem(PhoneNumber);
  return _processOutput(result);
};

const setPhoneNumber = (phoneNumber = 0) => {
  const _resource = _processInput(phoneNumber);
  AsyncStorage.setItem(PhoneNumber, _resource);
};

const getLanguage = async () => {
  const result = await AsyncStorage.getItem(Language);
  return _processOutput(result);
};

const setLanguage = (language = 'vi') => {
  const _language = _processInput(language);
  AsyncStorage.setItem(Language, _language);
};

const getStatusNotifyRegister = async () => {
  const result = await AsyncStorage.getItem(StatusNotifyRegister);
  return _processOutput(result);
};

const setStatusNotifyRegister = (statusNotifyRegister = 0) => {
  const _resource = _processInput(statusNotifyRegister);
  AsyncStorage.setItem(StatusNotifyRegister, _resource);
};

const getVersionCurrent = async () => {
  const result = await AsyncStorage.getItem(VersionCurrent);
  return _processOutput(result);
};

const setVersionCurrent = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(VersionCurrent, _resource);
};

const getLatestVersionApp = async () => {
  const result = await AsyncStorage.getItem(LatestVersionApp);
  return _processOutput(result);
};

const setLatestVersionApp = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(LatestVersionApp, _resource);
};

const multiGet = async keys => {
  const _keys = await AsyncStorage.multiGet(keys);
  const result = {};
  _keys.forEach(item => {
    Object.assign(result, {[item[0]]: _processOutput(item[1])});
  });

  return result;
};

const setTimeAnalyticsBle = value => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(TimeAnalyticsBle, _resource);
};

const getTimeAnalyticsBle = async () => {
  const result = await AsyncStorage.getItem(TimeAnalyticsBle);
  return _processOutput(result);
};

const getLastTimeClearLog = async () => {
  const result = await AsyncStorage.getItem(LastTimeClearLog);
  return _processOutput(result);
};

const setLastTimeClearLog = value => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(LastTimeClearLog, _resource);
};

const getDateOfWelcome = async () => {
  const result = await AsyncStorage.getItem(DateOfWelcome);
  return _processOutput(result);
};

const setDateOfWelcome = (infoDates = {}) => {
  const _resource = _processInput(infoDates);
  AsyncStorage.setItem(DateOfWelcome, _resource);
};

const getDisplayOriginalImg = async () => {
  const result = await AsyncStorage.getItem(DisplayOriginalImg);
  return _processOutput(result);
};

const setDisplayOriginalImg = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(DisplayOriginalImg, _resource);
};

const getQuestionFAQ = async () => {
  const result = await AsyncStorage.getItem(QuestionFAQ);
  return _processOutput(result);
};

const setQuestionFAQ = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(QuestionFAQ, _resource);
};

export {
  getResourceLanguage,
  setResourceLanguage,
  getConfiguration,
  setConfiguration,
  getTokenForDeclaration,
  setTokenForDeclaration,
  getJobImmediately,
  setJobImmediately,
  getHistoryDays,
  setHistoryDays,
  getIsFirstLoading,
  setIsFirstLoading,
  getInfoDeclare,
  setInfoDeclare,
  getTimespanNotification,
  setTimespanNotification,
  getTimesOpenApp,
  setTimesOpenApp,
  getFirstTimeOpen,
  setFirstTimeOpen,
  getTokenFirebase,
  setTokenFirebase,
  getPhoneNumber,
  setPhoneNumber,
  getLanguage,
  setLanguage,
  getStatusNotifyRegister,
  setStatusNotifyRegister,
  getVersionCurrent,
  setVersionCurrent,
  getLatestVersionApp,
  setLatestVersionApp,
  multiGet,
  setTimeAnalyticsBle,
  getTimeAnalyticsBle,
  getLastTimeClearLog,
  setLastTimeClearLog,
  getDateOfWelcome,
  setDateOfWelcome,
  getDisplayOriginalImg,
  setDisplayOriginalImg,
  getQuestionFAQ,
  setQuestionFAQ,
};
