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

export const NOTIFICATION_TYPE = {
  FIND_F12: 'KiemTraLichSuTiepXuc',
  CONFIRMED_F12: 'CanhBaoXacNhanTiepXuc',
  UPLOAD_HISTORY_F01_AUTO: 'LayThongTinVaLichSu',
  SEND_SHORT_NEWS: 'GuiThongBao',
  SEND_HTML_NEWS: 'bznews',
  SEND_URL_NEW: 'urlnews',
  REMIND_PHONE_NUMBER: 'MOBILE',
  DELETE_NOTIFICATION: 'XoaThongBao',
  SET_NEW_CONFIG: 'CapNhatCauHinh',
  SET_NEW_RESOURCE: 'CapNhatNgonNgu',
  REGISTER_TOKEN_FIREBASE_AGAIN: 'GetInfoApp',
  UPLOAD_LOG: 'GetLogApp',
  PING_PONG: 'PingPong',
};

export const RESULT_VERIFY_TYPE = {
  CONTACT: 'true',
  NO_CONTACT: 'false',
};

export const TYPE_SCREEN_VERIFY = {
  [RESULT_VERIFY_TYPE.CONTACT]: 'infected',
  [RESULT_VERIFY_TYPE.NO_CONTACT]: 'safe',
};
