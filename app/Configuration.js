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
import axios from 'axios';
// import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import {NativeModules, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import Service from './apis/service';
import {
  hasNotifySystem,
  // NOTIFY_INVITE_NUMBER,
} from './utils/notifyConfiguration';
import {DOMAIN} from './apis/server';

// CONST
const TIME_RETRY = [0, 0, 0, 0, 0];
const TIME_RETRY_UPDATE_TOKEN_FIREBASE = [1000, 2000, 3000, 5000, 8000, 13000, 21000, 34000, 55000];
let CURRENT_RETRY = 0;
let timerRegister;
let CURRENT_RETRY_UPDATE_TOKEN_FCM = 0;
let timerUpdateToken;
// const TypeOS = Platform.OS === 'android' ? 1 : 2;
let UPDATE_TOKEN_FIREBASE_RUNNING = false;
let REGISTER_USER_RUNNING = false;
const filePath = RNFS.ExternalStorageDirectoryPath + '/Bluezone/.id';
const validDateRegx = /^[0-9A-Za-z]{6}$/;

// Create UserCode in JS
// const generateRandom = () => {
//   var szCharSet =
//     '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//   var nSizeCharSet = szCharSet.length;
//   var UserCode = '';
//
//   global.Math.seedrandom(new Date().getTime());
//
//   for (var i = 0; i < 6; i++) {
//     UserCode += szCharSet.charAt(
//       global.Math.floor(global.Math.random() * nSizeCharSet),
//     );
//   }
//
//   return UserCode;
// };

const validateUserCode = id => validDateRegx.test(id);

const getUserIdFromFile = async onResult => {
  RNFS.exists(filePath)
    .then(result => {
      if (result) {
        RNFS.readFile(filePath, 'utf8')
          .then(value => {
            onResult(value);
          })
          .catch(() => onResult());
      } else {
        onResult();
      }
    })
    .catch(() => onResult());
};

const saveUserToFile = UserCode => {
  RNFS.writeFile(filePath, UserCode, 'utf8')
    .then(success => {
      console.log('WRITEN ID TO FILE SUCCES!');
    })
    .catch(err => {
      console.log('WRITEN ID TO FILE ERROR:' + err.message);
    });
};

const removeFileSaveUser = () => {
  return RNFS.unlink(filePath)
    .then(() => {
      console.log('FILE DELETED');
    })
    .catch(err => {
      console.log(err.message);
    });
};

const createUserCode = async () => {
  const UserCode = await Service.generatorId();
  return UserCode;
};

const configuration = {
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
  RssiThreshold: -69,
  PeriodDay: 14,
  DbMaxRow: 100000,
  DbMaxDay: 180,
  ScanBleRun: 25000,
  ScanBleSleep: 95000,
  BroadcastBleRun: 15000,
  BroadcastBleSleep: 15000,
  ScanDevicesRun: 25000,
  ScanDevicesSleep: 95000,
  Beta: true,
  ShareAppText: 'Chia sẻ ứng dụng',
  ShareAppText_en: 'Share the app',
  JoinGroupFaceText: 'Tham gia group trên Facebook',
  JoinGroupFaceText_en: 'Join the group on Facebook',
  ShareMessageText:
    'Bộ Y tế: Bảo vệ mình, bảo vệ cộng đồng chống COVID-19 đưa cuộc sống trở lại bình thường. Bạn đã cài Ứng dụng Khẩu trang điện tử Bluezone và cài tiếp cho 3 người khác chưa? Cài đặt tại www.Bluezone.gov.vn \n\n#Khautrangdientu\n#Bluezone\n#Baoveminh\n#Baovecongdong\n#Caicho3nguoi',
  ShareMessageText_en:
    'Ministry of Health: Protect yourself, protect the community against COVID-19, bringing life back to normal. Have you installed electronic mask application Bluezone and got 3 others to install the app? Get the app at www.Bluezone.ai \n\n#Electronicmask\n#Bluezone\n#Protectyourself\n#Protectcommunity\n#Installfor3people',
  NOTIFI_BLE_IOS_TEXT:
    'Bluezone không thể ghi nhận các "tiếp xúc gần" vì thiết bị chưa Bật Bluetooth.\n\nBluezone sử dụng Bluetooth năng lượng thấp BLE. Công nghệ này không tốn pin ngay cả khi luôn bật.\n\nBạn cần bật Bluetooth bằng cách vào Bảng điều khiển hoặc vào Cài đặt để cấu hình.',
  NOTIFI_BLE_IOS_TEXT_en:
    'Bluezone cannot record "close contact" because the device has not turned Bluetooth on.\n\nBluezone uses Bluetooth Low Energy (BLE). This technology does not drain the battery even when it is turned on.\n\nYou need to turn on Bluetooth by going to Control Panel or Settings to configure.',
  NOTIFI_PERMISSION_BLE_IOS_TEXT:
    'Bluezone sử dụng Bluetooth năng lượng thấp BLE để ghi nhận những người "tiếp xúc gần" với bạn. Công nghệ này không tốn pin ngay cả khi luôn bật.\n\nBạn cần đồng ý bật Bluetooth để có thể ghi nhận các "tiếp xúc gần".',
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
  PermissonNotificationsAndroid: [],
  PermissonNotificationsIos: [],
  Language: null,
  ScheduleNotifyDay: 1,
  ScheduleNotifyHour: [8, 13, 20],
  TimeCountDownOTP: 180,

  // Lưu gửi AsyncStorage
  UserCode: '',
  TokenFirebase: '',
  Register_Phone: 'FirstOTP',
  FirstOTP: null,
  StatusNotifyRegister: null,
  PhoneNumber: '',
};

const getConfigurationAsync = async () => {
  AsyncStorage.multiGet([
    'Configuration',
    'TokenFirebase',
    'Language',
    'FirstOTP',
    'StatusNotifyRegister',
    'PhoneNumber',
  ]).then(results => {
    let keys = {};
    results.forEach(result => {
      Object.assign(keys, {[result[0]]: result[1]});
    });

    const {
      Configuration,
      TokenFirebase,
      Language,
      FirstOTP,
      StatusNotifyRegister,
      PhoneNumber,
    } = keys;
    const configObject = JSON.parse(Configuration || '{}');

    mergeConfiguration(
      configObject,
      TokenFirebase,
      Language,
      FirstOTP,
      StatusNotifyRegister,
      PhoneNumber,
    );
  });
};

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

const getUserCodeAsync = async () => {
  const UserCode = await AsyncStorage.getItem('UserCode');
  if (validateUserCode(UserCode)) {
    Service.setUserId(UserCode);
    Object.assign(configuration, {
      UserCode: UserCode,
    });
    // Platform.OS !== 'ios' && saveUserToFile(UserCode);
    Platform.OS !== 'ios' && removeFileSaveUser();
  } else {
    // Service.restoreDb();
    // getUserIdFromFile(getUserIdFromFileCallback);
    getUserIdFromFileCallback();
  }
};

const getUserIdFromFileCallback = async userCodeFromFile => {
  const userCode = validateUserCode(userCodeFromFile)
    ? userCodeFromFile
    : await createUserCode();
  AsyncStorage.setItem('UserCode', userCode);
  Service.setUserId(userCode);
  Object.assign(configuration, {
    UserCode: userCode,
  });
  // Platform.OS !== 'ios' && saveUserToFile(userCode);
};

function notifySchedule(notify, timestamp) {
  const isVietnamese =
    !configuration.Language || configuration.Language === 'vi';
  PushNotification.localNotificationSchedule({
    /* Android Only Properties */
    id: notify.id,
    largeIcon: 'icon_bluezone_null',
    smallIcon: 'icon_bluezone_service',
    bigText: isVietnamese ? notify.bigText : notify.bigText_en,
    subText: isVietnamese ? notify.subText : notify.subText_en,
    vibrate: true,
    importance: notify.importance,
    priority: notify.priority,
    allowWhileIdle: false,
    ignoreInForeground: false,

    /* iOS only properties */
    alertAction: 'view',
    category: '',
    userInfo: {
      id: notify.id,
    },

    /* iOS and Android properties */
    title: isVietnamese ? notify.title : notify.title_en,
    message: isVietnamese ? notify.message : notify.message_en,
    playSound: false,
    date: new Date(timestamp),
  });
}

const createNofityInvice = (config, firstTime) => {
  const newNotifys = config.Notifications || [];
  const oldNotifys = configuration.Notifications || [];

  newNotifys.forEach(notify => {
    const tf = oldNotifys.find(item => item.id === notify.id);
    if (tf) {
      return;
    }
    const timeSchedule = hasNotifySystem(notify, firstTime);
    if (timeSchedule) {
      notifySchedule(notify, timeSchedule);
    }
  });

  oldNotifys.forEach(notify => {
    const tf = newNotifys.find(item => item.id === notify.id);
    if (tf) {
      return;
    }

    // Xoa notify
    PushNotification.cancelLocalNotifications({id: notify.id});
  });
};

const removeNotifyPermisson = () => {
  const notifications =
    Platform.OS === 'ios'
      ? configuration.PermissonNotificationsIos
      : configuration.PermissonNotificationsAndroid;
  if (!notifications || notifications.length === 0) {
    return;
  }
  notifications.forEach(notify => {
    notify.id && PushNotification.cancelLocalNotifications({id: notify.id});
  });
};

const createNotifyPermission = () => {
  const notifications =
    Platform.OS === 'ios'
      ? configuration.PermissonNotificationsIos
      : configuration.PermissonNotificationsAndroid;
  if (!notifications || notifications.length === 0) {
    return;
  }

  notifications.forEach(notify => {
    if (
      !notify.repeatTime ||
      notify.repeatTime < 0 ||
      !notify.dayStartTime ||
      notify.dayStartTime < 0
    ) {
      return;
    }

    let iDate = new Date().setHours(0, 0, 0, 0) + notify.dayStartTime;
    if (iDate < new Date().getTime()) {
      iDate += 86400000;
    }

    const isVietnamese =
      !configuration.Language || configuration.Language === 'vi';

    PushNotification.localNotificationSchedule({
      /* Android Only Properties */
      id: notify.id,
      largeIcon: 'icon_bluezone_null',
      smallIcon: 'icon_bluezone_service',
      bigText: isVietnamese ? notify.bigText : notify.bigText_en,
      subText: isVietnamese ? notify.subText : notify.subText_en,
      vibrate: true,
      importance: notify.importance,
      priority: notify.priority,
      allowWhileIdle: false,
      ignoreInForeground: false,

      /* iOS only properties */
      alertAction: 'view',
      category: '',
      userInfo: {
        id: notify.id,
      },

      /* iOS and Android properties */
      title: isVietnamese ? notify.title : notify.title_en,
      message: isVietnamese ? notify.message : notify.message_en,
      playSound: false,
      number: notify.number,
      repeatType: 'time',
      repeatTime: notify.repeatTime,
      date: new Date(iDate),
    });
  });
};

// API lấy thông tin config .
const getConfigurationAPI = async (successCb, errorCb) => {
  // Option gửi server.
  const options = {
    method: 'GET',
    url: `${DOMAIN}/api/App/GetConfigApp`,
    timeout: 3000,
  };
  await axios(options).then(
    async response => {
      if (response && response.status === 200) {
        try {
          const data = response.data.Object;

          const firstTimeAsync = await AsyncStorage.getItem('firstTimeOpen');
          let firstTime = firstTimeAsync
            ? Number.parseInt(firstTimeAsync, 10)
            : null;

          if (!firstTime) {
            firstTime = new Date().getTime();
            await AsyncStorage.setItem('firstTimeOpen', firstTime.toString());
          }

          await createNofityInvice(data, firstTime);
          removeNotifyPermisson(data);

          // Cập nhật thông tin configuration.
          Object.assign(configuration, data);

          successCb(configuration);

          // Lưu lại thông tin cấu hình.
          const configString = JSON.stringify(data);
          AsyncStorage.setItem('Configuration', configString);

          Service.setConfig(data);
        } catch (e) {
          errorCb(configuration);
        }
      }
    },
    error => {
      errorCb(error);
    },
  );
};

// Lưu số điện thoại
const setPhoneNumber = PhoneNumber => {
  Object.assign(configuration, {PhoneNumber});
  if (PhoneNumber) {
    AsyncStorage.setItem('PhoneNumber', PhoneNumber); // TODO by NhatPA: Đang xảy ra trường hợp null
  }
};

// Lưu thông tin TokenFirebase
const setTokenFirebase = TokenFirebase => {
  if (
    configuration.TokenFirebase !== '' &&
    TokenFirebase === configuration.TokenFirebase
  ) {
    return;
  }
  if (configuration.TokenFirebase === '') {
    registerUser(TokenFirebase);
  } else {
    updateTokenFirebase(TokenFirebase, configuration.TokenFirebase);
  }
};

const registerUser = async (
  TokenFirebase,
  successCb,
  errorCb,
  TIME_RETRY = TIME_RETRY,
) => {
  if (REGISTER_USER_RUNNING || configuration.TokenFirebase) {
    return;
  }
  REGISTER_USER_RUNNING = true;
  // Check nếu đang setTimeOut mà vào app ở trạng thái forground thì clearTimeout.
  // if (timerRegister) {
  //   CURRENT_RETRY = 0;
  //   clearTimeout(timerRegister);
  // }

  const options = {
    method: 'post',
    data: {
      TokenFirebase: TokenFirebase,
    },
    url: `${DOMAIN}/api/App/RegisterUser`,
  };

  axios(options).then(
    response => {
      REGISTER_USER_RUNNING = false;
      if (response && response.status === 200 && response.data.isOk === true) {
        successCb && successCb(response.data);
        timerRegister && clearTimeout(timerRegister);
        Object.assign(configuration, {TokenFirebase});
        AsyncStorage.setItem('TokenFirebase', TokenFirebase);
      }
    },
    error => {
      REGISTER_USER_RUNNING = false;
      // Start kich ban thu lai lien tuc toi khi duoc
      timerRegister && clearTimeout(timerRegister);
      if (CURRENT_RETRY < TIME_RETRY.length) {
        console.log('CURRENT_RETRY', CURRENT_RETRY);
        timerRegister = setTimeout(
          () => registerUser(TokenFirebase, successCb, errorCb, TIME_RETRY),
          TIME_RETRY[CURRENT_RETRY],
        );
        CURRENT_RETRY++;
      } else {
        console.log('errorCb', errorCb);
        errorCb && errorCb(error);
        CURRENT_RETRY = 0;
      }
    },
  );
};

const updateTokenFirebase = (TokenFirebase, TokenFirebaseOld)  => {
  if (UPDATE_TOKEN_FIREBASE_RUNNING) {
    return;
  }
  UPDATE_TOKEN_FIREBASE_RUNNING = true;

  // Option gửi server.
  const options = {
    method: 'post',
    data: {
      TokenFirebase: TokenFirebase,
      TokenFirebaseOld: TokenFirebaseOld,
    },
    url: `${DOMAIN}/api/App/UpdateTokenFirebase`,
  };

  axios(options).then(
    response => {
      UPDATE_TOKEN_FIREBASE_RUNNING = false;
      if (response && response.status === 200 && response.data.isOk === true) {
        timerUpdateToken && clearTimeout(timerUpdateToken);
        Object.assign(configuration, {TokenFirebase: TokenFirebase});
        AsyncStorage.setItem('TokenFirebase', TokenFirebase);
      }
    },
    error => {
      UPDATE_TOKEN_FIREBASE_RUNNING = false;
      timerUpdateToken && clearTimeout(timerUpdateToken);
      if (CURRENT_RETRY_UPDATE_TOKEN_FCM < TIME_RETRY_UPDATE_TOKEN_FIREBASE.length) {
        timerUpdateToken = setTimeout(
          updateTokenFirebase,
            TIME_RETRY_UPDATE_TOKEN_FIREBASE[CURRENT_RETRY_UPDATE_TOKEN_FCM],
        );
        CURRENT_RETRY_UPDATE_TOKEN_FCM++;
      } else {
        CURRENT_RETRY_UPDATE_TOKEN_FCM = 0;
      }
    },
  );
};

const getConfig = () => {
  return configuration;
};

// Lưu thông tin Language
const setLanguage = Language => {
  Object.assign(configuration, {Language});
  AsyncStorage.setItem('Language', Language);
  Platform.OS === 'android' && NativeModules.TraceCovid.setLanguage(Language);
};

const setStatusNotifyRegister = StatusNotifyRegister => {
  Object.assign(configuration, {StatusNotifyRegister});
  AsyncStorage.setItem('StatusNotifyRegister', StatusNotifyRegister);
};

const checkNotifyOfDay = () => {
  let {
    ScheduleNotifyDay, // Giá trị số ngày để hiển thị thông báo.
    ScheduleNotifyHour, // Khung giờ nhắc trong ngày VD: [8, 13, 20].
    StatusNotifyRegister, // Thời gian cuối cùng hiển thị thông báo.
    PhoneNumber,
    TokenFirebase,
  } = configuration;

  // Trường hợp người dùng khai báo OTP lần đầu vào app;
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
    if (i === ScheduleNotifyHour.length - 1 && ScheduleNotifyHour[ScheduleNotifyHour.length - 1] <= hoursOld) return false;
    if (ScheduleNotifyHour[i] <= hoursOld && ScheduleNotifyHour[i + 1] >= hoursOld && ScheduleNotifyHour[i] <= currentTimeOfHours && ScheduleNotifyHour[i + 1] >= currentTimeOfHours) return false;
  }
  return true;
};

export default configuration;
export {
  setTokenFirebase,
  getConfigurationAPI,
  getConfigurationAsync,
  getUserCodeAsync,
  getConfig,
  registerUser,
  removeNotifyPermisson,
  createNotifyPermission,
  setLanguage,
  setStatusNotifyRegister,
  checkNotifyOfDay,
  setPhoneNumber,
};
