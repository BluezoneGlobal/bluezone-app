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
    notifyId: 'notifyOTP',
    smallIcon: 'icon_bluezone_service',
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
    unRead: 0,
  },
};

export const warn = {
  data: {
    smallIcon: 'icon_bluezone_service',
    largeIcon: '',
    title: 'Bluezone',
    text: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    bigText: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    titleEn: 'Bluezone',
    textEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    bigTextEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    unRead: 0,
    timestamp: 1588868540072,
    group: 'WARN',
    data: {
      bluezoneIds: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách bluezone bị nhiễm
      // FO: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F0
      // F1: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F1
      // hasSendHistory: true, // => Nếu đã gửi lịch sử tiếp xúc
      // FindFID: '123213123', // => Nếu đã gửi lịch sử tiếp xúc, thì phải có FindFID
    },
  },
};

export const verifyInfected = {
  data: {
    smallIcon: 'icon_bluezone_service',
    largeIcon: '',
    title: 'Bluezone',
    text: 'Bạn đã tiếp xúc với F0',
    bigText: 'Bạn đã tiếp xúc với F0',
    titleEn: 'Bluezone',
    textEn: 'Bạn đã tiếp xúc với F0',
    bigTextEn: 'Bạn đã tiếp xúc với F0',
    unRead: 0,
    timestamp: new Date().getTime(),
    group: 'VERIFY',
    data: {
      FindFID: '1588868540072',
      result: 'INFECTED',
      // object: 'F1', // F0, F1, F2, Thông tin định danh là F0, F1 hay F2
      // contactId: '3Ih7QP', // ID tiếp xúc
      // timeContact: [123456789, 123456789, 123123123, 123123123], // THời gian tiếp xúc
      // hasInfected: true, // => Nếu đã khai báo thông tin
    },
  },
};

export const verifySafe = {
  data: {
    smallIcon: 'icon_bluezone_service',
    largeIcon: '',
    title: 'Bluezone',
    text: 'Chúc mừng bạn an toàn',
    bigText: 'Chúc mừng bạn an toàn',
    titleEn: 'Bluezone',
    textEn: 'Chúc mừng bạn an toàn',
    bigTextEn: 'Chúc mừng bạn an toàn',
    unRead: 0,
    timestamp: new Date().getTime(),
    group: 'VERIFY',
    data: {
      FindFID: '1588868540072',
      result: 'SAFE',
    },
  },
};

export const messageNotifyOTPSuccess = {
  data: {
    notifyId: 'notifyOTP',
    smallIcon: 'icon_bluezone_service',
    timestamp: new Date().getTime(),
    unRead: 0,
    largeIcon: '',
    title: 'Bluezone',
    text: 'Bạn đã cập nhật thành công số điện thoại.',
    bigText: 'Bạn đã cập nhật thành công số điện thoại.',
    titleEn: 'Bluezone',
    textEn: 'You have successfully updated your phone number.',
    bigTextEn: 'You have successfully updated your phone number.',
    group: 'MOBILE',
  },
};
