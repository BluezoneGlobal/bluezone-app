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

export const messageNotifyOTP = {
  data: {
    notifyId: '1234',
    smallIcon: 'icon_bluezone',
    largeIcon: '',
    title: 'Bluezone',
    text:
      'Bạn cần cập nhật số điện thoại để nhận được hỗ trợ trực tiếp trong trường hợp bạn tiếp xúc gần với người nhiễm Covid 19',
    bigText:
      'Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn "tiếp xúc gần" với người nhiễm Covid 19',
    titleEn: 'Bluezone',
    textEn:
      'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for Covid 19',
    bigTextEn:
      'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for Covid 19',
    group: 'MOBILE',
    timestamp: new Date().getTime(),
    unRead: false,
  },
};

export const warn = {
  data: {
    notifyId: '1111',
    smallIcon: 'icon_bluezone',
    largeIcon: '',
    title: 'Bluezone',
    text: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    bigText: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    titleEn: 'Bluezone',
    textEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    bigTextEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    unRead: false,
    timestamp: new Date().getTime(),
    group: 'WARN',
    data: {
      bluezoneIds: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách bluezone bị nhiễm
      // FO: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F0
      // F1: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F1
    },
  },
};

export const verifyInfected = {
  data: {
    notifyId: '2222',
    smallIcon: 'icon_bluezone',
    largeIcon: '',
    title: 'Bluezone',
    text:
      'Bạn đã tiếp xúc với F0',
    bigText:
      'Bạn đã tiếp xúc với F0',
    titleEn: 'Bluezone',
    textEn:
      'Bạn đã tiếp xúc với F0',
    bigTextEn:
      'Bạn đã tiếp xúc với F0',
    unRead: false,
    timestamp: new Date().getTime(),
    group: 'VERIFY',
    data: {
      FindFID: '123',
      result: 'infected',
      object: 'F1', // F0, F1, F2, Thông tin định danh là F0, F1 hay F2
      contactId: '3Ih7QP', // ID tiếp xúc
      timeContact: [123456789, 123456789, 123123123, 123123123], // THời gian tiếp xúc
    },
  },
};

export const verifySafe = {
  data: {
    notifyId: '3333',
    smallIcon: 'icon_bluezone',
    largeIcon: '',
    title: 'Bluezone',
    text:
      'Chúc mừng bạn an toàn',
    bigText:
      'Chúc mừng bạn an toàn',
    titleEn: 'Bluezone',
    textEn:
      'Chúc mừng bạn an toàn',
    bigTextEn:
      'Chúc mừng bạn an toàn',
    unRead: false,
    timestamp: new Date().getTime(),
    group: 'VERIFY',
    data: {
      FindFID: '123',
      result: 'safe',
    },
  },
};

export const messageNotifyOTPSuccess = {
  data: {
    notifyId: '4444',
    smallIcon: 'icon_bluezone',
    largeIcon: '',
    title: 'Bluezone',
    text: 'Bạn đã cập nhật thành công số điện thoại.',
    bigText: 'Bạn đã cập nhật thành công số điện thoại.',
    titleEn: 'Bluezone',
    textEn: 'You have successfully updated your phone number.',
    bigTextEn: 'You have successfully updated your phone number.',
    group: 'MOBILE',
    timestamp: new Date().getTime(),
    unRead: false,
  },
};
