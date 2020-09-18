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

import Service from './core/apis/service';
import {
  getConfiguration as getConfigurationAPI,
  registerTokenFirebase as registerTokenFirebaseApi,
  retryRegisterTokenFirebase as retryRegisterTokenFirebaseApi,
  retryRegisterTokenFirebaseAgain as retryRegisterTokenFirebaseAgainApi,
  retryUpdateTokenFirebase as retryUpdateTokenFirebaseApi,
  updateTokenFirebase as updateTokenFirebaseApi,
} from './core/apis/bluezone';
import {
  setConfiguration as setConfigurationStorage,
  setLanguage as setLanguageStorage,
  setPhoneNumber as setPhoneNumberStorage,
  setStatusNotifyRegister as setStatusNotifyRegisterStorage,
  setTokenFirebase as setTokenFirebaseStorage,
  multiGet,
} from './core/storage';
import {getTokenFirebase} from './core/fcm';
import {
  scheduleNotificationChangeLanguageListener,
  scheduleNotificationSetConfigurationListener,
} from './core/notifyScheduler';
import log from './core/log';
import * as msg from './const/log';

const configuration = {
  PhoneNumber: '',
  LinkQRAndroid:
    'https://play.google.com/store/apps/details?id=com.mic.bluezone',
  LinkQRIOS: 'https://apps.apple.com/us/app/bluezone/id1508062685?ls=1',
  LinkShareAndroid:
    'https://play.google.com/store/apps/details?id=com.mic.bluezone',
  LinkShareIOS: 'https://apps.apple.com/us/app/bluezone/id1508062685?ls=1',
  Introduce: 'https://bluezone.vn',
  Introduce_en: 'https://bluezone.ai',
  TimeSaveLog: 10000,
  TimeShowLog: 30000,
  RssiThreshold: -88, //  -69,
  RssiThreshold_Android_Android: -86,
  RssiThreshold_Android_iOS: -69,
  RssiThreshold_iOS_Android: -88,
  RssiThreshold_iOS_iOS: -74,
  PeriodDay: 14,
  DbMaxRow: 100000,
  DbMaxDay: 180,
  ScanBleRun: 40000,
  ScanBleSleep: 260000,
  BroadcastBleRun: 15000,
  BroadcastBleSleep: 15000,
  ScanDevicesRun: 40000,
  ScanDevicesSleep: 260000,
  MaxNumberSubKeyPerDay: 96,
  Beta: true,
  ShareAppText: 'Chia sẻ ứng dụng',
  ShareAppText_en: 'Share the app',
  JoinGroupFaceText: 'Tham gia group trên Facebook',
  JoinGroupFaceText_en: 'Join the group on Facebook',
  ShareMessageText:
    'Bộ Y tế: Bảo vệ mình, bảo vệ cộng đồng chống COVID-19 đưa cuộc sống trở lại bình thường. Bạn đã cài Ứng dụng phát hiện tiếp xúc gần Bluezone và cài tiếp cho 3 người khác chưa? Cài đặt tại www.Bluezone.gov.vn \n\n#Ungdungphathientiepxucgan\n#Bluezone\n#Baoveminh\n#Baovecongdong\n#Caicho3nguoi',
  ShareMessageText_en:
    'Ministry of Health: Protect yourself, protect the community against COVID-19, bringing life back to normal. Have you installed Close  application Bluezone and got 3 others to install the app? Get the app at www.Bluezone.ai \n\n#Closecontactdetectorapp\n#Bluezone\n#Protectyourself\n#Protectcommunity\n#Installfor3people',
  NOTIFI_BLE_IOS_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật Bluetooth.\n\nBluezone sử dụng Bluetooth năng lượng thấp BLE. Công nghệ này không tốn pin ngay cả khi luôn bật.\n\nBạn cần bật Bluetooth bằng cách vào Bảng điều khiển hoặc vào Cài đặt để cấu hình.',
  NOTIFI_BLE_IOS_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not turned Bluetooth on.\n\nBluezone uses Bluetooth Low Energy (BLE). This technology does not drain the battery even when it is turned on.\n\nYou need to turn on Bluetooth by going to Control Panel or Settings to configure.',
  NOTIFI_PERMISSION_BLE_IOS_TEXT:
    'Bluezone sử dụng Bluetooth năng lượng thấp BLE để ghi nhận những người "tiếp xúc gần" với bạn. Công nghệ này không tốn pin ngay cả khi luôn bật.\n\nBạn cần cấp quyền truy cập Bluetooth để có thể ghi nhận các "tiếp xúc gần".',
  NOTIFI_PERMISSION_BLE_IOS_TEXT_en:
    'Bluezone uses Bluetooth Low Energy BLE to recognize people who are in "close contact" with you. This technology does not drain the battery even when it is turned on.\n\nYou need to agree to turn on Bluetooth to record "close contact".',
  NOTIFI_PERMISSION_TEXT:
    'Bạn cần đồng ý cấp quyền thông báo để ứng dụng có thể gửi cảnh báo nếu bạn "tiếp xúc gần" người nhiễm COVID-19 trong tương lai.',
  NOTIFI_PERMISSION_TEXT_en:
    'You need to accept notification permission so that the application can send alerts if you have “close contact" with people infected with COVID-19 in the future.',
  NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT:
    'Bluezone không sử dụng vị trí của thiết bị. Bluezone chỉ bật Bluetooth năng lượng thấp BLE để ghi nhận các "tiếp xúc gần".\n\nMặc dù vậy, theo chính sách của Google, khi bật Bluetooth BLE thiết bị sẽ tự động đề nghị truy cập vị trí thiết bị, ngay cả khi Bluezone không sử dụng tới quyền đó.\n\nBạn cần cấp quyền để có thể ghi nhận các "tiếp xúc gần"',
  NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT_en:
    'Bluezone does not use the device location. Bluezone only turns on Bluetooth Low Energy (BLE) to record "close contact".\n\nHowever, according to Google policy, when BLE is turned on the device will automatically offer to access the device location, even if Bluezone does not use that permission.\n\nYou need to accept the permission to record "close contact".',
  NOTIFI_LOCATION_ANDROID_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật vị trí.\n\nBluezone chỉ sử dụng Bluetooth năng lượng thấp BLE để ghi nhận các "tiếp xúc gần". Tuy nhiên, theo chính sách của Google, khi bật Bluetooth BLE thiết bị sẽ tự động đề nghị truy cập vị trí thiết bị, ngay cả khi Bluezone không sử dụng tới quyền đó.\n\nBạn cần cấp quyền Bật vị trí để có thể ghi nhận các "tiếp xúc gần".',
  NOTIFI_LOCATION_ANDROID_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not enabled location.\n\nBluezone only turns on Bluetooth Low Energy (BLE) to record "close contact". However, according to Google policy, when BLE is turned on the device will automatically offer the access to device location, even if Bluezone does not use that permission.\n\nYou need to accept the permission to enable location to record "close contact".',
  NOTIFI_PERMISSION_WRITE_FILE_TEXT:
    'Bluezone chỉ sử dụng quyền "truy cập tệp" để ghi lịch sử "tiếp xúc gần" lên bộ nhớ thiết bị.\n\nMặc dù vậy, theo chính sách của Google, thiết bị vẫn tự động đề nghị "cho phép truy cập vào ảnh, phương tiện và tệp" ngay cả khi Bluezone không sử dụng các quyền còn lại.\n\nBạn cần cấp quyền để có thể ghi nhận các "tiếp xúc gần".',
  NOTIFI_PERMISSION_WRITE_FILE_TEXT_en:
    'Bluezone only uses “access to file" permission to write the history of "close contact” on device memory.\n\nHowever, according to Google policy, the device automatically recommends "access to photos, media and files” even if Bluezone does not use the two first permissions.\n\nYou need to accept permissions to record "close contact".',
  NOTIFI_BLUETOOTH_ANDROID_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật Bluetooth.\n\nBluezone sử dụng Bluetooth năng lượng thấp BLE. Công nghệ này không tốn pin ngay cả khi luôn bật.\n\nBạn cần bật Bluetooth bằng cách vào Bảng điều khiển hoặc vào Cài đặt để cấu hình.',
  NOTIFI_BLUETOOTH_ANDROID_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not turned Bluetooth on.\n\nBluezone uses Bluetooth Low Energy (BLE). This technology does not drain the battery even when it is turned on.\n\nYou need to turn on Bluetooth by going to Control Panel or Settings to configure.',
  NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật vị trí.\n\nBluezone chỉ sử dụng Bluetooth năng lượng thấp BLE để ghi nhận các "tiếp xúc gần". Tuy nhiên, theo chính sách của Google, khi bật Bluetooth BLE thiết bị sẽ tự động đề nghị truy cập vị trí thiết bị, ngay cả khi Bluezone không sử dụng tới quyền đó.\n\nBạn cần cấp quyền Bật vị trí bằng cách vào "Cài đặt / Ứng dụng / Bluezone / Quyền"',
  NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not turned on Location.\n\nBluezone only turns on Bluetooth Low Energy (BLE) to record "close contact". However, according to Google policy, when BLE is turned on the device will automatically offer the access to device location, even if Bluezone does not use that permission.\n\nYou need to accept the permission to turn on location by going to "Settings / Applications / Bluezone / Permissions".',
  NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật quyền truy cập tệp.\n\nMặc dù vậy, theo chính sách của Google, thiết bị vẫn tự động đề nghị "cho phép truy cập vào ảnh, phương tiện và tệp" ngay cả khi Bluezone không sử dụng các quyền còn lại.\n\nBạn cần cấp quyền Bật lưu trữ bằng cách vào "Cài đặt / Ứng dụng / Bluezone / Quyền"',
  NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not enabled access to file.\n\nHowever, according to Google policy, the device automatically recommends "access to photos, media and files” even if Bluezone does not use the two first permissions.\n\nYou need to accept the permissions to enable storage by going to "Settings / pplications / Bluezone / Permissions".',
  LinkGroupFace: 'http://facebook.com/groups/bluezonevn',
  LinkGroupFace_en: 'http://facebook.com/groups/bluezonevn',
  TimeEnableBluetooth: 300000,
  BatteryEnableBluetooth: 15,
  Notifications: [],
  PermissionNotificationsAndroid: [],
  PermissionNotificationsIos: [],
  Language: null,
  ScheduleNotifyDay: 1,
  ScheduleNotifyHour: [8, 13, 20],
  TimeCountDownOTP: 900,
  TurnContact: {
    vi: {
      id: '38',
      index: 16,
    },
    en: {
      id: '39',
      index: 15,
    },
  },

  // Lưu gửi AsyncStorage
  TokenFirebase: '',
  Register_Phone: 'FirstOTP',
  FirstOTP: null,
  StatusNotifyRegister: null,
  SupportPhoneNumber: '0888128896',
  LinkDetail: 'https://www.bluezone.gov.vn',
  LinkDetailEn: 'https://bluezone.ai/',
  LinkRulesVi: 'https://bluezone.gov.vn/dieu-khoan-su-dung',
  LinkRulesEn: 'https://bluezone.ai/terms-of-use',
  MailTo: 'lienhe@bluezone.gov.vn',
  ScheduleRegisterNotification: {
    itemRepeat: [
      {
        id: '100',
        dayStartTime: 28800000,
        repeatTime: 86400000,
      },
      {
        id: '102',
        dayStartTime: 32400000,
        repeatTime: 86400000,
      },
      {
        id: '104',
        dayStartTime: 36000000,
        repeatTime: 86400000,
      },
      {
        id: '106',
        dayStartTime: 39600000,
        repeatTime: 86400000,
      },
      {
        id: '108',
        dayStartTime: 43200000,
        repeatTime: 86400000,
      },
      {
        id: '110',
        dayStartTime: 46800000,
        repeatTime: 86400000,
      },
      {
        id: '112',
        dayStartTime: 50400000,
        repeatTime: 86400000,
      },
      {
        id: '114',
        dayStartTime: 54000000,
        repeatTime: 86400000,
      },
      {
        id: '116',
        dayStartTime: 57600000,
        repeatTime: 86400000,
      },
      {
        id: '118',
        dayStartTime: 61200000,
        repeatTime: 86400000,
      },
      {
        id: '119',
        dayStartTime: 64800000,
        repeatTime: 86400000,
      },
      {
        id: '119',
        dayStartTime: 72000000,
        repeatTime: 86400000,
      },
      {
        id: '119',
        dayStartTime: 75600000,
        repeatTime: 86400000,
      },
    ],
    title: 'Cập nhật số điện thoại.',
    titleEn: 'Declare your phone number.',
    message: 'Bạn hãy vào ứng dụng và cập nhật số điện thoại nhé.',
    messageEn: 'Please open Bluezone and add your mobile number.',
    bigText: 'Bạn hãy vào ứng dụng và cập nhật số điện thoại nhé.',
    bigTextEn: 'Please open Bluezone and add your mobile number.',
  },
  ScheduleUpdateAppNotification: {
    itemRepeat: [
      {
        id: '102',
        dayStartTime: 32400000,
        repeatTime: 86400000,
      },
    ],
    title: 'Phiên bản mới.',
    titleEn: 'New version.',
    message: 'Đã có phiên bản mới. Bạn hãy truy cập ứng dụng để cập nhật.',
    messageEn: 'New version is available. Please open Bluezone to get the update.',
    bigText: 'Đã có phiên bản mới. Bạn hãy truy cập ứng dụng để cập nhật.',
    bigTextEn: 'New version is available. Please open Bluezone to get the update.',
  },
  AndroidScanNotification: {
    title: 'Bluezone đang không thể hoạt động chính xác !',
    titleEn: 'Bluezone not working properly !',
    message: 'Bluetooth cần được bật để Bluezone có thể cảnh báo tới bạn.',
    messageEn: 'Bluetooth needs to be turned on for Bluezone to send you the alerts.',
    bigText: 'Bluetooth cần được bật để Bluezone có thể cảnh báo tới bạn.',
    bigTextEn: 'Bluetooth needs to be turned on for Bluezone to send you the alerts.',
  },
  iOSScanNotification: {
    title: 'Bluezone đang không thể hoạt động chính xác !',
    titleEn: 'Bluezone not working properly !',
    message: 'Bluetooth cần được bật để Bluezone có thể cảnh báo tới bạn.',
    messageEn: 'Bluetooth needs to be turned on for Bluezone to send you the alerts.',
    bigText: 'Bluetooth cần được bật để Bluezone có thể cảnh báo tới bạn.',
    bigTextEn: 'Bluetooth needs to be turned on for Bluezone to send you the alerts.',
  },
  AndroidEnableBluetoothNotification: {
    title: 'Bluezone đang không thể hoạt động chính xác.',
    titleEn: 'Bluezone not working properly.',
    message: 'Bluetooth đã tắt. Bluetooth sẽ tự động bật lại sau 1 tiếng nữa.',
    messageEn:
      'Bluetooth is off. Bluezone will automatically turn Bluetooth on in 1 hour.',
    bigText: 'Bluetooth đã tắt. Bluetooth sẽ tự động bật lại sau 1 tiếng nữa.',
    bigTextEn:
      'Bluetooth is off. Bluezone will automatically turn Bluetooth on in 1 hour.',
    buttonText: 'Bật Bluetooth',
    buttonTextEn: 'Enable Bluetooth',
  },
  TimeAutoEnableBluetooth: 3600000,
};

const _defaultFunc = () => {};

const mergeConfiguration = (
  configObject,
  TokenFirebase,
  Language,
  FirstOTP,
  StatusNotifyRegister,
  PhoneNumber,
) => {
  Object.assign(configuration, configObject, {
    TokenFirebase: TokenFirebase || '',
    Language: Language || 'vi',
    FirstOTP: FirstOTP || null,
    StatusNotifyRegister: StatusNotifyRegister || null,
    PhoneNumber: PhoneNumber || '',
  });
};

const initConfiguration = async callBack => {
  multiGet([
    'Configuration',
    'TokenFirebase',
    'Language',
    'FirstOTP',
    'StatusNotifyRegister',
    'PhoneNumber',
  ]).then(results => {
    const {
      Configuration,
      TokenFirebase,
      Language,
      FirstOTP,
      StatusNotifyRegister,
      PhoneNumber,
    } = results;

    console.log('TokenFirebase', TokenFirebase);
    mergeConfiguration(
      Configuration,
      TokenFirebase,
      Language,
      FirstOTP,
      StatusNotifyRegister,
      PhoneNumber,
    );

    callBack(configuration);
  });
};

/**
 * Luu so dien thoai
 * @param PhoneNumber
 */
const setPhoneNumber = PhoneNumber => {
  if (!PhoneNumber) {
    throw new Error('setPhoneNumber::PhoneNumber is required !');
  }
  Object.assign(configuration, {PhoneNumber});
  setPhoneNumberStorage(PhoneNumber);
};

/**
 * Luu ngon ngu hien tai
 * @param Language
 */
const setLanguage = Language => {
  Object.assign(configuration, {Language});
  setLanguageStorage(Language);
  Service.setLanguage(Language);
  scheduleNotificationChangeLanguageListener(Language);
};

// TODO xem xet bo ham nay di
const setStatusNotifyRegister = StatusNotifyRegister => {
  Object.assign(configuration, {StatusNotifyRegister});
  setStatusNotifyRegisterStorage(StatusNotifyRegister);
};

/**
 * Dang ki token firebase voi server. Thanh cong thi luu vao cau hinh.
 * @param TokenFirebase
 * @param success
 * @param failure
 * @description Chi dung local, khong export ham nay
 */
const registerTokenFirebase = (
  TokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const _success = data => {
    Object.assign(configuration, {TokenFirebase});
    setTokenFirebaseStorage(TokenFirebase);

    success(data);
  };
  registerTokenFirebaseApi(TokenFirebase, _success, failure);
};

/**
 * Dang ki token firebase voi server, cho phep thu lai neu co loi xay ra. Thanh cong thi luu vao cau hinh.
 * @param TokenFirebase
 * @param success
 * @param failure
 * @param timeRetry
 * @description Chi dung local, khong export ham nay
 */
const retryRegisterTokenFirebase = (
  TokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  const _success = data => {
    Object.assign(configuration, {TokenFirebase});
    setTokenFirebaseStorage(TokenFirebase);

    success(data);
  };
  retryRegisterTokenFirebaseApi(TokenFirebase, _success, failure, timeRetry);
};

/**
 * Cap nhat token firebase voi server. Thanh cong thi luu vao cau hinh.
 * @param TokenFirebaseNew
 * @param TokenFirebaseOld
 * @param success
 * @param failure
 * @description Chi dung local, khong export ham nay
 */
const updateTokenFirebase = (
  TokenFirebaseNew,
  TokenFirebaseOld,
  success = _defaultFunc,
  failure = _defaultFunc,
) => {
  const _success = data => {
    Object.assign(configuration, {TokenFirebase: TokenFirebaseNew});
    setTokenFirebaseStorage(TokenFirebaseNew);

    success(data);
  };

  updateTokenFirebaseApi(TokenFirebaseNew, TokenFirebaseOld, _success, failure);
};

/**
 * Cap nhat token firebase voi server, cho phep thu lai neu co loi xay ra. Thanh cong thi luu vao cau hinh.
 * @param TokenFirebaseNew
 * @param TokenFirebaseOld
 * @param success
 * @param failure
 * @param timeRetry
 * @description Chi dung local, khong export ham nay
 */
const retryUpdateTokenFirebase = (
  TokenFirebaseNew,
  TokenFirebaseOld,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  const _success = data => {
    Object.assign(configuration, {TokenFirebase: TokenFirebaseNew});
    setTokenFirebaseStorage(TokenFirebaseNew);

    success(data);
  };
  retryUpdateTokenFirebaseApi(
    TokenFirebaseNew,
    TokenFirebaseOld,
    _success,
    failure,
    timeRetry,
  );
};

/**
 * Dang ki lai token firebase voi server, cho phep thu lai neu co loi xay ra. Thanh cong thi luu vao cau hinh.
 * @param TokenFirebaseOld
 * @param TokenFirebaseNew
 * @param PushGUID
 * @param success
 * @param failure
 * @param timeRetry
 * @description Chi dung local, khong export ham nay
 */
const retryRegisterTokenFirebaseAgain = (
  TokenFirebaseOld,
  TokenFirebaseNew,
  PushGUID,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  const _success = data => {
    Object.assign(configuration, {TokenFirebase: TokenFirebaseNew});
    setTokenFirebaseStorage(TokenFirebaseNew);

    success(data);
  };
  retryRegisterTokenFirebaseAgainApi(
    TokenFirebaseOld,
    TokenFirebaseNew,
    PushGUID,
    _success,
    failure,
    timeRetry,
  );
};

const setConfiguration = config => {
  const oldConfig = {...configuration};

  Object.assign(configuration, config);
  setConfigurationStorage(configuration);
  Service.setConfig(configuration);
  scheduleNotificationSetConfigurationListener(oldConfig, configuration);
};

/**
 * Lay cau hinh moi nhat tu server. Thanh cong thi luu vao cau hinh.
 * @param success
 * @param failure
 * @returns {Promise<void>}
 */
const syncConfiguration = (success = _defaultFunc, failure = _defaultFunc) => {
  const _success = _configuration => {
    setConfiguration(_configuration);
    success(configuration);
  };
  return getConfigurationAPI(_success, failure);
};

const _registerOrUpdateTokenFirebase = (
  NewTokenFirebase,
  TokenFirebase,
  registerTokenFirebase,
  updateTokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  if (!NewTokenFirebase) {
    TokenFirebase
      ? success(TokenFirebase)
      : failure({
          error:
            'syncTokenFirebase::getTokenFirebase::NewTokenFirebase is null',
        });
    return;
  }

  if (!TokenFirebase) {
    log.info(msg.REGISTER_TOKEN_FIREBASE);
    registerTokenFirebase(NewTokenFirebase, success, failure, timeRetry);
    return;
  }

  if (NewTokenFirebase === TokenFirebase) {
    success(TokenFirebase);
    return;
  }

  log.info(msg.UPDATE_TOKEN_FIREBASE);
  updateTokenFirebase(
    NewTokenFirebase,
    TokenFirebase,
    success,
    failure,
    timeRetry,
  );
};

/**
 * Dang ki hoac Cap nhat token firebase voi server, cho phep thu lai neu co loi xay ra. Thanh cong thi luu vao cau hinh.
 * @param NewTokenFirebase
 * @param success
 * @param failure
 * @param timeRetry
 * @description Ham nay chi duoc phep su dung duy nhat trong fcm.js
 */
const retryRegisterOrUpdateTokenFirebase = (
  NewTokenFirebase,
  success,
  failure,
  timeRetry,
) => {
  // console.log('TokenFirebase: ' + NewTokenFirebase);
  const {TokenFirebase} = configuration;
  _registerOrUpdateTokenFirebase(
    NewTokenFirebase,
    TokenFirebase,
    retryRegisterTokenFirebase,
    retryUpdateTokenFirebase,
    success,
    failure,
    timeRetry,
  );
};

const _syncTokenFirebase = (
  _registerTokenFirebase,
  _updateTokenFirebase,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  const {TokenFirebase} = configuration;

  getTokenFirebase(
    NewTokenFirebase => {
      console.log('NewTokenFirebase', NewTokenFirebase);
      _registerOrUpdateTokenFirebase(
        NewTokenFirebase,
        TokenFirebase,
        _registerTokenFirebase,
        _updateTokenFirebase,
        success,
        failure,
        timeRetry,
      );
    },
    e => {
      log.error(msg.GET_TOKEN_FIREBASE_FAILURE);
      TokenFirebase ? success(TokenFirebase) : failure(e);
    },
  );
};

/**
 * Lay token firebase moi nhat va dong bo len server. Thanh cong thi luu vao cau hinh.
 * @param success
 * @param failure
 * @description Dung khi dam bao token firebase duoc dong bo len server truoc khi goi mot API khac => Chi duong dung trong bluezone.js
 */
const syncTokenFirebase = (success, failure) => {
  const _success = token => {
    log.info(msg.SYNC_TOKEN_FIREBASE_SUCCESS, token);
    success(token);
  };
  const _failure = e => {
    log.error(msg.SYNC_TOKEN_FIREBASE_FAILURE, e);
    failure(e);
  };
  return _syncTokenFirebase(
    registerTokenFirebase,
    updateTokenFirebase,
    _success,
    _failure,
  );
};

/**
 * Lay token firebase moi nhat va dong bo len server, cho phep thu lai neu co loi xay ra. Thanh cong thi luu vao cau hinh.
 * @param success
 * @param failure
 * @param timeRetry
 * @description Dung khi can dam bao token firebase duoc dong bo len server.
 */
const retrySyncTokenFirebase = (success, failure, timeRetry) => {
  return _syncTokenFirebase(
    retryRegisterTokenFirebase,
    retryUpdateTokenFirebase,
    success,
    failure,
    timeRetry,
  );
};

const _syncTokenFirebaseAgain = (
  pushGUID,
  _registerTokenFirebaseAgain,
  success = _defaultFunc,
  failure = _defaultFunc,
  timeRetry,
) => {
  const {TokenFirebase} = configuration;

  getTokenFirebase(
    NewTokenFirebase => {
      _registerTokenFirebaseAgain(
        TokenFirebase,
        NewTokenFirebase,
        pushGUID,
        success,
        failure,
        timeRetry,
      );
    },
    () => {
      _registerTokenFirebaseAgain(
        TokenFirebase,
        TokenFirebase,
        pushGUID,
        success,
        failure,
        timeRetry,
      );
    },
  );
};

const retrySyncTokenFirebaseAgain = (PushGUID, success, failure, timeRetry) => {
  return _syncTokenFirebaseAgain(
    PushGUID,
    retryRegisterTokenFirebaseAgain,
    success,
    failure,
    timeRetry,
  );
};

// TODO: can ra soat loai bo viec export truc tiep configuration de han che viec phu thuoc ngam va kho debug. Hoac can chi ra duoc nguyen tac nhung cho nao duoc su dung configuration cho nao khong?
export default configuration;

export {
  initConfiguration,
  syncConfiguration,
  setLanguage,
  setStatusNotifyRegister,
  setPhoneNumber,
  setConfiguration,
  retryRegisterTokenFirebaseAgain,
  retryRegisterOrUpdateTokenFirebase,
  syncTokenFirebase,
  retrySyncTokenFirebase,
  retrySyncTokenFirebaseAgain,
};
