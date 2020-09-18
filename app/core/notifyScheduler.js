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

import {Platform} from 'react-native';
import firebase from 'react-native-firebase';

import configuration from '../configuration';
import {cancelNotify, pushNotify, removeNotify} from './notify';
import {createNotification, scheduleNotification} from './fcm';
import {FCM_CHANNEL_ID, SMALL_ICON} from '../const/fcm';
import {getLatestVersionApp} from './storage';
import {CurrentVersionValue} from './version';
import {getBluetoothState} from './bluetooth';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';

const bluetoothGranted = async () => {
  const v = check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
  return v === RESULTS.GRANTED;
};

const createScheduleNotifications = (scheduleNotifications, language) => {
  const {itemRepeat = []} = scheduleNotifications || {};
  itemRepeat.length > 0 &&
    itemRepeat.forEach(item => {
      let iDate = new Date().setHours(0, 0, 0, 0) + item.dayStartTime;
      if (iDate < new Date().getTime()) {
        iDate += 86400000;
      }
      createSchedulingNotification(
        _createNotification(item.id, scheduleNotifications, language),
        iDate,
      );
    });
};

const clearScheduleNotifications = scheduleScanNotifications => {
  const {itemRepeat = []} = scheduleScanNotifications || {};
  itemRepeat.length > 0 &&
    itemRepeat.forEach(item => {
      cancelNotify(item.id);
    });
};

const scheduleScanNotificationsChange = (
  oldScheduleNotifications,
  newScheduleNotifications,
  language,
  isCreate,
) => {
  const {itemRepeat: oldRepeat = []} = newScheduleNotifications || {};
  const {itemRepeat: newRepeat = []} = oldScheduleNotifications || {};

  oldRepeat.forEach(notify => {
    const tf = newRepeat.find(item => item.id === notify.id);
    if (tf) {
      return;
    }
    // Xoa notify
    cancelNotify(notify.id);
  });

  isCreate &&
    newRepeat.forEach(item => {
      const tf = oldRepeat.find(i => i.id === item.id);
      if (tf) {
        return;
      }

      let iDate = new Date().setHours(0, 0, 0, 0) + item.dayStartTime;
      if (iDate < new Date().getTime()) {
        iDate += 86400000;
      }

      // Create schedule
      createSchedulingNotification(
        _createNotification(item.id, newScheduleNotifications, language),
        iDate,
      );
    });
};

// Xử lý thông báo hẹn giờ khi app thiếu chức năng để scan -------------------
const createScheduleScanNotification = () => {
  if (Platform.OS === 'android') {
    return;
  }

  const {iOSScheduleScanNotification, Language} = configuration;
  createScheduleNotifications(iOSScheduleScanNotification, Language);
};

const clearScheduleScanNotification = () => {
  if (Platform.OS === 'android') {
    return;
  }

  const {iOSScheduleScanNotification} = configuration;
  clearScheduleNotifications(iOSScheduleScanNotification);
};

const scheduleScanNotification_ChangeLanguage = async language => {
  if (Platform.OS === 'android') {
    return;
  }
  const isEnable = await getBluetoothState();
  if (!isEnable) {
    const {iOSScheduleScanNotification} = configuration;
    clearScheduleScanNotification(iOSScheduleScanNotification, language);
    createScheduleScanNotification(iOSScheduleScanNotification, language);
  }
};

const scheduleScanNotification_SetConfiguration = async (
  oldConfig = {},
  newConfig = {},
) => {
  if (Platform.OS === 'android') {
    return;
  }

  if (!(await bluetoothGranted())) {
    return;
  }

  const isEnable = await getBluetoothState();
  const {Language} = configuration;
  const {iOSScheduleScanNotification: newSchedule} = oldConfig;
  const {iOSScheduleScanNotification: oldSchedule} = newConfig;
  scheduleScanNotificationsChange(
    oldSchedule,
    newSchedule,
    Language,
    !!isEnable,
  );
};

// Xử lý thông báo ngay lập tức khi app thiếu chức năng để scan -------------------
const createScanNotification = iOSScanNotification => {
  if (Platform.OS === 'android') {
    return;
  }
  if (!iOSScanNotification) {
    return;
  }

  const {Language} = configuration;
  pushNotify(
    {
      data: {
        ...iOSScanNotification,
        ...{
          text: iOSScanNotification.message,
          textEn: iOSScanNotification.messageEn,
          notifyId: 'scanNotification',
        },
      },
    },
    Language,
  );
};

const clearScanNotification = iOSScanNotification => {
  if (Platform.OS === 'android') {
    return;
  }
  iOSScanNotification && removeNotify('scanNotification');
};

const scanNotification_ChangeLanguage = async () => {
  if (Platform.OS === 'android') {
    return;
  }
  const isEnable = await getBluetoothState();
  if (!isEnable) {
    createScanNotification();
  }
};

const scanNotification_SetConfiguration = async () => {
  if (Platform.OS === 'android') {
    return;
  }

  if (!(await bluetoothGranted())) {
    return;
  }

  const isEnable = await getBluetoothState();
  if (!isEnable) {
    createScanNotification();
  }
};

/**
 * Dat lich nhac khai bao so dien thoai
 */
const creatScheduleRegisterNotification = () => {
  if (configuration.PhoneNumber) {
    return;
  }
  const {ScheduleRegisterNotification, Language} = configuration;
  createScheduleNotifications(ScheduleRegisterNotification, Language);
};

/**
 * Huy toan bo lich nhac khai bao so dien thoai
 */
const clearScheduleRegisterNotification = () => {
  const {ScheduleRegisterNotification} = configuration;
  clearScheduleNotifications(ScheduleRegisterNotification);
};

const scheduleRegisterNotification_ChangeLanguage = () => {
  const {ScheduleRegisterNotification, PhoneNumber} = configuration;
  if (PhoneNumber) {
    return;
  }
  clearScheduleRegisterNotification(ScheduleRegisterNotification);
  creatScheduleRegisterNotification(ScheduleRegisterNotification);
};

const scheduleRegisterNotification_SetConfig = (oldConfig, newConfig) => {
  const {PhoneNumber} = configuration;
  const {Language} = configuration;
  if (PhoneNumber) {
    return;
  }
  const {ScheduleRegisterNotification: oldSchedule} = oldConfig;
  const {ScheduleRegisterNotification: newSchedule} = newConfig;
  scheduleScanNotificationsChange(oldSchedule, newSchedule, Language, true);
};

/**
 * Dat lich nhac cap nhat ban moi
 */
const creatScheduleUpdateAppNotification = () => {
  const {ScheduleUpdateAppNotification, Language} = configuration;
  createScheduleNotifications(ScheduleUpdateAppNotification, Language);
};

/**
 * Huy toan bo lich nhac cap nhat ban moi
 */
const clearScheduleUpdateAppNotification = () => {
  const {ScheduleUpdateAppNotification} = configuration;
  clearScheduleNotifications(ScheduleUpdateAppNotification);
};

const scheduleUpdateAppNotification_ChangeLanguage = () => {
  // TODO xem cach viet storage moi thi doan code duoi con chay khong
  getLatestVersionApp().then(latestVersion => {
    if (latestVersion === CurrentVersionValue) {
      return;
    }

    const {ScheduleUpdateAppNotification} = configuration;
    clearScheduleScanNotification(ScheduleUpdateAppNotification);
    createScheduleScanNotification(ScheduleUpdateAppNotification);
  });
};

const scheduleUpdateAppNotification_SetConfig = (oldConfig, newConfig) => {
  getLatestVersionApp().then(latestVersion => {
    if (latestVersion === CurrentVersionValue) {
      return;
    }

    const {Language} = configuration;
    const {ScheduleUpdateAppNotification: newSchedule} = oldConfig;
    const {ScheduleUpdateAppNotification: oldSchedule} = newConfig;
    scheduleScanNotificationsChange(oldSchedule, newSchedule, Language, true);
  });
};
// -------------------------------------------------------------------------------------
const _createNotification = (id, n, language) => {
  const isVI = language === 'vi';
  const title = (isVI ? n.title : n.titleEn) || n.title || n.titleEn;
  const text = (isVI ? n.message : n.messageEn) || n.message || n.messageEn;
  const big = (isVI ? n.bigText : n.bigTextEn) || n.bigText || n.bigTextEn;
  const sub = (isVI ? n.subText : n.subTextEn) || n.subText || n.subTextEn;
  const buttonText = isVI ? n.buttonText : n.buttonTextEn;

  const notification = createNotification()
    .setNotificationId(id)
    .setTitle(title)
    .setBody(big)
    .setSubtitle(sub)
    .android.setBigText(text)
    .android.setChannelId(FCM_CHANNEL_ID)
    .android.setSmallIcon(SMALL_ICON)
    .android.setLargeIcon(n.largeIcon);

  if (buttonText) {
    const action = new firebase.notifications.Android.Action(
      'open',
      SMALL_ICON,
      buttonText,
    );
    notification.android.addAction(action);
  }
  return notification;
};

const createSchedulingNotification = (notification, time) => {
  scheduleNotification(notification, {
    fireDate: time,
    repeatInterval: 'day',
  });
};

/**
 * Khoi tao trang thai bluetooth
 */
const initNotifyScheduler = () => {};

/**
 * Xu ly su kien trang thai bluetooth thay doi
 * @param isEnable
 */
const bluetoothChangeListener = isEnable => {
  if (Platform.OS === 'android') {
    return;
  }

  const {iOSScheduleScanNotification, iOSScanNotification} = configuration;
  if (isEnable) {
    // Clear notification
    clearScheduleScanNotification(iOSScheduleScanNotification);
    clearScanNotification(iOSScanNotification);
  } else {
    // Create notification
    clearScheduleScanNotification(iOSScheduleScanNotification);
    clearScanNotification(iOSScanNotification);
    createScheduleScanNotification(iOSScheduleScanNotification);
    createScanNotification(iOSScanNotification);
  }
};

/**
 * Kiem tra nhac khai so dien thoai moi lan vao app
 * @returns {boolean}
 */
const checkRegisterNotificationOfDay = () => {
  let {
    ScheduleNotifyDay, // Giá trị số ngày để hiển thị thông báo.
    ScheduleNotifyHour, // Khung giờ nhắc trong ngày VD: [8, 13, 20].
    StatusNotifyRegister, // Thời gian cuối cùng hiển thị thông báo.
    PhoneNumber,
    TokenFirebase,
  } = configuration;

  if (PhoneNumber || !TokenFirebase) {
    return false;
  }

  // Trường hợp người dùng "bỏ qua" lần đầu vào app thì sẽ cho hiển thị notify cho app.
  if (!StatusNotifyRegister) {
    return true;
  }

  const date = new Date();
  const currentTimeOfHours = date.getHours();
  const Time_ScheduleNotify = ScheduleNotifyDay * 86400000;
  StatusNotifyRegister = parseInt(StatusNotifyRegister || new Date().getTime());
  const currentTimeOfDay = date.setHours(0, 0, 0, 0);
  const StatusNotifyRegisterForHour = new Date(StatusNotifyRegister).setHours(
    0,
    0,
    0,
    0,
  );

  // Check trạng thái đến ngày notify
  const checkDay =
    currentTimeOfDay === StatusNotifyRegisterForHour + Time_ScheduleNotify;

  // Check trường hợp đến ngày notify
  // + Trường hợp 1: Ngày + Thời gian hiện tại nhỏ hơn số giờ đầu.
  // + Trường hợp 2: Trạng thái cuối cùng hiển thị notify của ngày.
  if (
    (checkDay && currentTimeOfHours < ScheduleNotifyHour[0]) ||
    (currentTimeOfDay === StatusNotifyRegisterForHour &&
      currentTimeOfHours < ScheduleNotifyHour[0])
  ) {
    return false;
  }

  // Check trường hợp hiển thị ở các khung giờ khác nhau.
  const hoursOld = new Date(StatusNotifyRegister).getHours();
  for (let i = 0; i < ScheduleNotifyHour.length; i++) {
    if (
      i === ScheduleNotifyHour.length - 1 &&
      ScheduleNotifyHour[i] <= hoursOld &&
      ScheduleNotifyHour[i] <= currentTimeOfHours
    ) {
      return false;
    }
    if (
      ScheduleNotifyHour[i] <= hoursOld &&
      ScheduleNotifyHour[i + 1] >= hoursOld &&
      ScheduleNotifyHour[i] <= currentTimeOfHours &&
      ScheduleNotifyHour[i + 1] >= currentTimeOfHours
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Xu ly su kien ngon ngu thay doi, can thiet lap lai cac notify theo ngon ngu moi
 * @param Language
 */
const scheduleNotificationChangeLanguageListener = Language => {
  scheduleRegisterNotification_ChangeLanguage(Language);
  scheduleUpdateAppNotification_ChangeLanguage(Language);
  scanNotification_ChangeLanguage(Language);
  scheduleScanNotification_ChangeLanguage(Language);
};

/**
 * Xu ly su kien cau hinh thay doi, can thiet lap lai cac notify theo cau hinh moi
 * @param oldConfig
 */
const scheduleNotificationSetConfigurationListener = oldConfig => {
  scheduleRegisterNotification_SetConfig(oldConfig, configuration);
  scheduleUpdateAppNotification_SetConfig(oldConfig, configuration);
  scanNotification_SetConfiguration(oldConfig, configuration);
  scheduleScanNotification_SetConfiguration(oldConfig, configuration);
};

export {
  initNotifyScheduler,
  bluetoothChangeListener,
  // createScheduleScanNotificationListener,
  // --------------------------------
  // createScanNotification,
  // clearScanNotification,
  // scanNotification_ChangeLanguage,
  // scanNotification_SetConfiguration,
  // ------------------------------
  // createScheduleScanNotification,
  // clearScheduleScanNotification,
  // scheduleScanNotification_ChangeLanguage,
  // scheduleScanNotification_SetConfiguration,
  // ------
  creatScheduleRegisterNotification,
  clearScheduleRegisterNotification,
  // scheduleRegisterNotification_ChangeLanguage,
  // scheduleRegisterNotification_SetConfig,
  // ---
  creatScheduleUpdateAppNotification,
  clearScheduleUpdateAppNotification,
  // scheduleUpdateAppNotification_ChangeLanguage,
  // scheduleUpdateAppNotification_SetConfig,
  // ---
  checkRegisterNotificationOfDay,
  scheduleNotificationChangeLanguageListener,
  scheduleNotificationSetConfigurationListener,
};
