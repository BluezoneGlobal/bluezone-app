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

import RNFS from 'react-native-fs';

// Apis
import Service from './apis/service';
import {NOTIFICATION_TYPE} from '../const/notification';
import {
  retryUploadHistoryF12,
  retryUploadHistoryF01Auto,
  retryUploadLogFile,
} from './apis/bluezone';
import {
  retrySyncTokenFirebaseAgain,
  syncTokenFirebase,
  setConfiguration,
} from '../configuration';
import {mergeResourceLanguage} from './language';
import {addJob} from './jobScheduler';
import {removeNotification, createNews} from './announcement';
import log from './log';
import tmpl, * as msg from '../const/log';
import {reportPushAnalytics} from './analytics';

// Thong bao & canh bao
const validateNotificationMessage = notify => {
  // TODO bo sung validate goi tin nay
};
const handleNotificationMessage = notify => {
  // TODO xem lai can thiet gan notifyId nhu nay khong?
  const _notifyId =
    notify.data.notifyId ||
    notify.data.Notify.NotifyID ||
    notify.data.timestamp ||
    new Date().getTime();
  notify.data.notifyId = _notifyId + '';
  createNews(notify);
};

// HistoryF12
const validateUploadHistoryF12 = notify => {
  return (
    !!notify?.data?.DataContent?.FindGUID &&
    !!notify?.data?.DataContent?.Numberdays
  );
};
const handleUploadHistoryF12 = async notify => {
  if (!validateUploadHistoryF12(notify)) {
    log.info(msg.PUSH_INVALIDATE, notify);
    return;
  }
  notify.data.notifyId = notify.data.DataContent.FindGUID + '';

  // Kiem tra co tiep xuc voi BzID trong goi PUSH khong
  log.info(msg.BEGIN_CHECK_EXPOSURE);
  const result = await Service.checkContactF(notify.data.DataContent.InfoF);
  log.info(msg.END_CHECK_EXPOSURE, result);
  if (!result) {
    return;
  }

  syncTokenFirebase(async token => {
    retryUploadHistoryF12(
      notify.data.DataContent.Numberdays,
      notify.data.DataContent.FindGUID,
      () => {},
      async () =>
        await addJob({
          type: 'UploadHistoryF',
          data: {notifyObj: notify},
        }),
    );
  });
};

// DeleteNotification
const validateDeleteNotification = notify => {
  return !!(notify.data.notifyId || notify?.data?.Notify.NotifyID);
};
const handleDeleteNotification = notify => {
  if (validateDeleteNotification(notify)) {
    // TODO bo sung ghi log cho nay
    return;
  }
  const _notifyId = notify.data.notifyId || notify.data.Notify.NotifyID;
  removeNotification(_notifyId);
};

// UploadHistoryF01Auto
const validateUploadHistoryF01Auto = notify => {
  return !!notify?.data?.DataContent?.FindGUID;
};
const handleUploadHistoryF01Auto = notify => {
  if (!validateUploadHistoryF01Auto(notify)) {
    log.info(tmpl(msg.PUSH_INVALIDATE, notify.data.Type), notify);
    return;
  }
  const FindGUID = notify.data.DataContent.FindGUID;
  syncTokenFirebase(() => {
    retryUploadHistoryF01Auto(notify.data.DataContent.Numberdays, FindGUID);
  });
};

// Config
const validateConfig = notify => {
  return !!notify?.data?.DataContent;
};
const handleSetConfig = notify => {
  if (!validateConfig(notify)) {
    // TODO bo sung ghi log cho nay
    return;
  }
  setConfiguration(notify.data.DataContent);
};

// Resource
const validateResource = notify => {
  return !!notify?.data?.DataContent;
};
const handleSetResource = notify => {
  if (!validateResource(notify)) {
    // TODO bo sung ghi log cho nay
    return;
  }
  mergeResourceLanguage(JSON.parse(notify.data.DataContent)).then(() => {});
};

// Register Token Again
const validateRegisterTokenFirebaseAgain = notify => {
  return !!notify?.data?.DataContent?.PushGUID;
};
const handleRegisterTokenFirebaseAgain = notify => {
  if (validateRegisterTokenFirebaseAgain(notify)) {
    // TODO bo sung ghi log cho nay
    return;
  }
  retrySyncTokenFirebaseAgain(notify.data.DataContent.PushGUID);
};

const handleConfirmedF01 = () => {};

const handleUploadLog = notify => {
  log.uploadFileLog();
};

const validatePush = notify => {
  return notify?.data?.Type;
};

// DeleteNotification
const validateReportPushNotification = notify => {
  return !!notify?.data?.Notify.key;
};

const handleReportPushAnalytics = notify => {
  if (!validateReportPushNotification(notify)) {
    // TODO bo sung ghi log cho nay
    return;
  }

  debugger;
  const key = notify.data.Notify.key;
  reportPushAnalytics(key);
};

const remoteMessageListener = async notify => {
  log.info(tmpl(msg.PUSH_RECEIVE, notify?.data?.Type), notify);

  if (!validatePush(notify)) {
    log.info(tmpl(msg.PUSH_INVALIDATE, notify.data.Type), notify);
    return;
  }
  let _notify = {};
  try {
    _notify = {
      data: {
        Type: notify.data.Type,
        Notify: notify.data.Notify ? JSON.parse(notify.data.Notify) : {},
        DataContent: notify.data.DataContent
          ? JSON.parse(notify.data.DataContent)
          : {},
      },
    };
  } catch (e) {
    log.error(msg.PARSE_PUSH_FAILURE, notify);
    return;
  }
  debugger;
  switch (_notify.data.Type) {
    case NOTIFICATION_TYPE.SEND_HTML_NEWS:
    case NOTIFICATION_TYPE.SEND_URL_NEW:
    case NOTIFICATION_TYPE.SEND_SHORT_NEWS:
    case NOTIFICATION_TYPE.REMIND_PHONE_NUMBER:
      handleNotificationMessage(_notify);
      break;
    case NOTIFICATION_TYPE.CONFIRMED_F12:
      handleConfirmedF01(_notify);
      break;
    case NOTIFICATION_TYPE.FIND_F12:
      handleUploadHistoryF12(_notify);
      break;
    case NOTIFICATION_TYPE.DELETE_NOTIFICATION:
      handleDeleteNotification(_notify);
      break;
    case NOTIFICATION_TYPE.UPLOAD_HISTORY_F01_AUTO:
      handleUploadHistoryF01Auto(_notify);
      break;
    case NOTIFICATION_TYPE.SET_NEW_CONFIG:
      handleSetConfig(_notify);
      break;
    case NOTIFICATION_TYPE.SET_NEW_RESOURCE:
      handleSetResource(_notify);
      break;
    case NOTIFICATION_TYPE.REGISTER_TOKEN_FIREBASE_AGAIN:
      handleRegisterTokenFirebaseAgain(_notify);
      break;
    case NOTIFICATION_TYPE.UPLOAD_LOG:
      handleUploadLog(_notify);
      break;
    case NOTIFICATION_TYPE.PING_PONG:
      handleReportPushAnalytics(_notify);
      break;
  }
};

export {remoteMessageListener};
