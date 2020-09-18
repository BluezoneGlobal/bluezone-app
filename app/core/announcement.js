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

import {NOTIFICATION_TYPE} from '../const/notification';
import {
  replaceNotify,
  mergeNotify,
  readNotify,
  deleteNotify,
} from './db/SqliteDb';
import {pushNotify} from './notify';
import {getLanguage} from './storage';
import {notifyScreenTool} from '../main/components/NotifyScreen';
import {removeDeliveredNotification} from './fcm';

const isHtmlNews = notify => {
  return notify.data.Type === NOTIFICATION_TYPE.SEND_HTML_NEWS;
};

const isLinkNews = notify => {
  return notify.data.Type === NOTIFICATION_TYPE.SEND_URL_NEW;
};

const isShortNews = notify => {
  return notify.data.Type === NOTIFICATION_TYPE.SEND_SHORT_NEWS;
};

const isPhoneNumberRegister = notify => {
  return notify.data.Type === NOTIFICATION_TYPE.REMIND_PHONE_NUMBER;
};

const showNotify = async notify => {
  const language = (await getLanguage()) || 'vi';
  const notifyLang = notify.data.Notify.TypeLanguage;

  if (!notifyLang || notifyLang.toUpperCase() !== language.toUpperCase()) {
    return;
  }

  pushNotify(
    {
      data: {
        notifyId: notify.data.notifyId,
        smallIcon: notify.data.Notify.SmallIcon,
        largeIcon: notify.data.Notify.LargeIcon,
        title: notify.data.Notify.Title,
        text: notify.data.Notify.Text,
        bigText: notify.data.Notify.BigText,
        titleEn: notify.data.Notify.TitleEn,
        textEn: notify.data.Notify.TextEn,
        bigTextEn: notify.data.Notify.BigTextEn,
        _group: notify.data.Type,
        timestamp: notify.data.Notify.Timestamp || new Date().getTime(),
        unRead: notify.data.unRead,
        data: notify.data.DataContent,
        typeLanguage: notifyLang,
      },
    },
    language,
  );
};

// TODO xem lai cach goi nay. Sua de thuc hien qua ham callback trong tung ham phia duoi.
const reloadNotificationList = () => {
  notifyScreenTool && notifyScreenTool.getList();
};

/**
 * Thong bao dang Html
 */
const createHtmlNews = (notify, success, failure) => {
  if (!isHtmlNews(notify)) {
    return;
  }
  mergeNotify(notify, success, failure);
  showNotify(notify);
  reloadNotificationList();
};

/**
 * Thong bao dang link
 */
const createLinkNews = (notify, success, failure) => {
  if (!isLinkNews(notify)) {
    return;
  }
  mergeNotify(notify, success, failure);
  showNotify(notify);
  reloadNotificationList();
};

/**
 * Thong bao dang PUSH
 */
const createShortNews = (notify, success, failure) => {
  if (!isShortNews(notify)) {
    return;
  }
  mergeNotify(notify, success, failure);
  showNotify(notify);
  reloadNotificationList();
};

const createNews = (notify, success, failure) => {
  if (
    !isShortNews(notify) &&
    !isLinkNews(notify) &&
    !isHtmlNews(notify) &&
    !isPhoneNumberRegister(notify)
  ) {
    return;
  }
  mergeNotify(notify, success, failure);
  showNotify(notify);
  reloadNotificationList();
};

const readNotification = notifyId => {
  readNotify(notifyId);
};

const removeNotification = (notifyId, success, failure) => {
  removeDeliveredNotification(notifyId);
  deleteNotify(notifyId, success, failure);
  reloadNotificationList();
};

/**
 * Nhac dang ki so dien thoai
 */
const createPhoneNumberReminder = notify => {
  if (!isPhoneNumberRegister(notify)) {
    return;
  }
  replaceNotify(notify);
};

export {
  readNotification,
  removeNotification,
  createNews,
  createShortNews,
  createLinkNews,
  createHtmlNews,
  createPhoneNumberReminder,
};
