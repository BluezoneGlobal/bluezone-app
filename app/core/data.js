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

// export const messageNotifyOTP = {
//   data: {
//     notifyId: 'notifyOTP',
//     smallIcon: 'icon_bluezone_service',
//     largeIcon: '',
//     title: 'Bluezone',
//     text:
//       'Bạn cần cập nhật số điện thoại để nhận được hỗ trợ trực tiếp trong trường hợp bạn tiếp xúc gần với người nhiễm COVID-19',
//     bigText:
//       'Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn "tiếp xúc gần" với người nhiễm COVID-19',
//     titleEn: 'Bluezone',
//     textEn:
//       'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
//     bigTextEn:
//       'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
//     group: 'MOBILE',
//     timestamp: new Date().getTime(),
//     unRead: 0,
//   },
// };
//
// export const warn = {
//   data: {
//     smallIcon: 'icon_bluezone_service', // (*)
//     largeIcon: '', // (*)
//     title: 'Bluezone', // (*)
//     text: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
//     bigText: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
//     titleEn: 'Bluezone', // (*)
//     textEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
//     bigTextEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
//     unRead: 0,
//     timestamp: new Date().getTime() + 1,
//     group: 'WARN', // (*)
//     data: {
//       bluezoneIds: ['3Ih7QP', '4Ih7QP', '5Ih7QP', '6Ih7QP'], // Danh sách bluezone bị nhiễm // (*) // Chua ro kibj ban
//       // FO: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F0
//       // F1: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F1
//       // hasSendHistory: true, // => Nếu đã gửi lịch sử tiếp xúc
//       FindID: '123456789', // => Nếu đã gửi lịch sử tiếp xúc, thì phải có FindID // (*)
//     },
//   },
// };
//
// export const verifyInfected = {
//   data: {
//     smallIcon: 'icon_bluezone_service', // (*)
//     largeIcon: '', // (*)
//     title: 'Bluezone', // (*)
//     text: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
//     bigText: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
//     titleEn: 'Bluezone', // (*)
//     textEn: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
//     bigTextEn: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
//     unRead: 0,
//     timestamp: new Date().getTime() + 2,
//     group: 'VERIFY', // (*)
//     data: {
//       FindID: '123456789', // (*)
//       result: 'CONTACT', // (*)
//       // object: 'F1', // F0, F1, F2, Thông tin định danh là F0, F1 hay F2
//       // contactId: '3Ih7QP', // ID tiếp xúc
//       // timeContact: [123456789, 123456789, 123123123, 123123123], // THời gian tiếp xúc
//       // info: true, // => Nếu đã khai báo thông tin
//     },
//   },
// };
//
// export const verifySafe = {
//   data: {
//     smallIcon: 'icon_bluezone_service', // (*)
//     largeIcon: '', // (*)
//     title: 'Bluezone', // (*)
//     text: 'Chúc mừng bạn an toàn', // (*)
//     bigText: 'Chúc mừng bạn an toàn', // (*)
//     titleEn: 'Bluezone', // (*)
//     textEn: 'Chúc mừng bạn an toàn', // (*)
//     bigTextEn: 'Chúc mừng bạn an toàn', // (*)
//     unRead: 0,
//     timestamp: new Date().getTime() + 3,
//     group: 'VERIFY', // (*)
//     data: {
//       FindID: '123456789', // (*)
//       result: 'SAFE', // (*)
//     },
//   },
// };
//
// export const messageNotifyOTPSuccess = {
//   data: {
//     notifyId: 'notifyOTP',
//     smallIcon: 'icon_bluezone_service',
//     timestamp: new Date().getTime(),
//     unRead: 0,
//     largeIcon: '',
//     title: 'Bluezone',
//     text: 'Bạn đã cập nhật thành công số điện thoại.',
//     bigText: 'Bạn đã cập nhật thành công số điện thoại.',
//     titleEn: 'Bluezone',
//     textEn: 'You have successfully updated your phone number.',
//     bigTextEn: 'You have successfully updated your phone number.',
//     group: 'MOBILE',
//   },
// };

// -------------------------

export const messageNotifyOTP = (language = 'vi') => ({
  data: {
    // smallIcon: 'icon_bluezone_service',
    // largeIcon: '',
    // title: 'Bluezone',
    // text:
    //   'Bạn cần cập nhật số điện thoại để nhận được hỗ trợ trực tiếp trong trường hợp bạn tiếp xúc gần với người nhiễm COVID-19 111',
    // bigText:
    //   'Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn "tiếp xúc gần" với người nhiễm COVID-19',
    // titleEn: 'Bluezone',
    // textEn:
    //   'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
    // bigTextEn:
    //   'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
    // group: 'MOBILE',
    // timestamp: new Date().getTime(),
    // unRead: 0,

    notifyId: 'notifyOTP',
    Type: 'MOBILE',
    Notify: {
      Id: 'notifyOTP',
      SmallIcon: 'icon_bluezone_service',
      LargeIcon: '',
      Title: 'Bluezone',
      Text:
        'Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn "tiếp xúc gần" với người nhiễm COVID-19',
      BigText:
        'Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn "tiếp xúc gần" với người nhiễm COVID-19',
      TitleEn: 'Bluezone',
      TextEn:
        'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
      BigTextEn:
        'You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19',
      TypeLanguage: language,
    },
    // Notify:
    //   '{"Id":"notifyOTP","SmallIcon":"icon_bluezone_service","LargeIcon":"","Title":"Bluezone","Text":"Bạn cần cập nhật số điện thoại để nhận được hỗ trợ trực tiếp trong trường hợp bạn tiếp xúc gần với người nhiễm COVID-19","BigText":"Bạn cần cập nhật số điện thoại để nhận được sự hỗ trợ trực tiếp trong trường hợp bạn \\"tiếp xúc gần\\" với người nhiễm COVID-19","TitleEn":"Bluezone","TextEn":"You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19","BigTextEn":"You need to update your phone number to receive direct support if you have been close contact with people who have tested positive for COVID-19"}',
    DataContent: {
      Sender: 'MIC',
      Content: '',
      unRead: 0,
      timestamp: new Date().getTime(),
    },
    // DataContent:
    //   '{"Sender":"MIC","Content":"","unRead":0,"timestamp":1595749062345}',
  },
});

export const warn = {
  data: {
    smallIcon: 'icon_bluezone_service', // (*)
    largeIcon: '', // (*)
    title: 'Bluezone', // (*)
    text: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
    bigText: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
    titleEn: 'Bluezone', // (*)
    textEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
    bigTextEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh', // (*)
    unRead: 0,
    timestamp: new Date().getTime() + 1,
    group: 'WARN', // (*)
    data: {
      bluezoneIds: ['3Ih7QP', '4Ih7QP', '5Ih7QP', '6Ih7QP'], // Danh sách bluezone bị nhiễm // (*) // Chua ro kibj ban
      // FO: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F0
      // F1: ['3Ih7QP', '3Ih7QP', '3Ih7QP', '3Ih7QP'], // Danh sách Id F1
      // hasSendHistory: true, // => Nếu đã gửi lịch sử tiếp xúc
      FindID: '123456789', // => Nếu đã gửi lịch sử tiếp xúc, thì phải có FindID // (*)
    },

    Type: 'KiemTraLichSuTiepXuc',
    // Notify: {
    //   Id: 'notifyOTP',
    //   SmallIcon: 'icon_bluezone_service',
    //   LargeIcon: '',
    //   Title: 'Bluezone',
    //   Text: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    //   BigText: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    //   TitleEn: 'Bluezone',
    //   TextEn: 'Bạn có nguy cơ đã tiếp xúc với ngư ời nghi nhiễm bệnh',
    //   BigTextEn: 'Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh',
    // },
    Notify:
      '{"Id":"notifyOTP","SmallIcon":"icon_bluezone_service","LargeIcon":"","Title":"Bluezone","Text":"Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh","BigText":"Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh","TitleEn":"Bluezone","TextEn":"Bạn có nguy cơ đã tiếp xúc với ngư ời nghi nhiễm bệnh","BigTextEn":"Bạn có nguy cơ đã tiếp xúc với người nghi nhiễm bệnh"}',
    // DataContent: {
    //   FindID: 111,
    //   ListBluezoneID: ['ADES12', 'TR3123'],
    //   Sender: 'Bộ y tế',
    //   Content: 'Bạn có thể tiếp xúc gần người nhiễm COVID-19',
    //   IsQuestion: false,
    //   Numberdays: 14,
    //   IsFullContact: true,
    //   unRead: 0,
    //   timestamp: new Date().getTime(),
    // },
    DataContent:
      '{"FindID":111,"ListBluezoneID":["ADES12","TR3123"],"Sender":"Bộ y tế","Content":"Bạn có thể tiếp xúc gần người nhiễm COVID-19","IsQuestion":false,"Numberdays":14,"IsFullContact":true,"unRead":0,"timestamp":1595750409210}',
  },
};

export const verifyInfected = {
  data: {
    smallIcon: 'icon_bluezone_service', // (*)
    largeIcon: '', // (*)
    title: 'Bluezone', // (*)
    text: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
    bigText: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
    titleEn: 'Bluezone', // (*)
    textEn: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
    bigTextEn: 'Bạn đã tiếp xúc với người nhiễm COVID-19', // (*)
    unRead: 0,
    timestamp: new Date().getTime() + 2,
    group: 'VERIFY', // (*)
    data: {
      FindID: '123456789', // (*)
      result: 'INFECTED', // (*)
      // object: 'F1', // F0, F1, F2, Thông tin định danh là F0, F1 hay F2
      // contactId: '3Ih7QP', // ID tiếp xúc
      // timeContact: [123456789, 123456789, 123123123, 123123123], // THời gian tiếp xúc
      // info: true, // => Nếu đã khai báo thông tin
    },

    Type: 'CanhBaoXacNhanTiepXuc',
    // Notify: {
    //   SmallIcon: 'icon_bluezone_service',
    //   LargeIcon: '',
    //   Title: 'Bluezone',
    //   Text: 'Bạn đã tiếp xúc với F0',
    //   BigText: 'Bạn đã tiếp xúc với F0',
    //   TitleEn: 'Bluezone',
    //   TextEn: 'Bạn đã tiếp xúc với F0',
    //   BigTextEn: 'Bạn đã tiếp xúc với F0',
    // },
    Notify:
      '{"SmallIcon":"icon_bluezone_service","LargeIcon":"","Title":"Bluezone","Text":"Bạn đã tiếp xúc với người nhiễm COVID-19","BigText":"Bạn đã tiếp xúc với người nhiễm COVID-19","TitleEn":"Bluezone","TextEn":"Bạn đã tiếp xúc với F0","BigTextEn":"Bạn đã tiếp xúc với F0"}',
    // DataContent: {
    //   FindID: 111,
    //   Sender: 'Bộ y tế',
    //   Content: 'Bạn có thể tiếp xúc gần F0',
    //   Result: true,
    //   unRead: 0,
    //   timestamp: new Date().getTime(),
    // },
    DataContent:
      '{"FindID":111,"Sender":"Bộ y tế","Content":"Bạn có thể tiếp xúc gần người nhiễm COVID-19","Result":"true","unRead":0,"timestamp":1595750477278}',
  },
};

export const verifySafe = {
  data: {
    smallIcon: 'icon_bluezone_service', // (*)
    largeIcon: '', // (*)
    title: 'Bluezone', // (*)
    text: 'Chúc mừng bạn an toàn', // (*)
    bigText: 'Chúc mừng bạn an toàn', // (*)
    titleEn: 'Bluezone', // (*)
    textEn: 'Chúc mừng bạn an toàn', // (*)
    bigTextEn: 'Chúc mừng bạn an toàn', // (*)
    unRead: 0,
    timestamp: new Date().getTime() + 3,
    group: 'VERIFY', // (*)
    data: {
      FindID: '123456789', // (*)
      result: 'SAFE', // (*)
    },

    notifyId: 'notifyOTP',
    Type: 'CanhBaoXacNhanTiepXuc',
    // Notify: {
    //   SmallIcon: 'icon_bluezone_service',
    //   LargeIcon: '',
    //   Title: 'Bluezone',
    //   Text: 'Chúc mừng bạn an toàn',
    //   BigText: 'Chúc mừng bạn an toàn',
    //   TitleEn: 'Bluezone',
    //   TextEn: 'Chúc mừng bạn an toàn',
    //   BigTextEn: 'Chúc mừng bạn an toàn',
    // },
    Notify:
      '{"SmallIcon":"icon_bluezone_service","LargeIcon":"","Title":"Bluezone","Text":"Chúc mừng bạn an toàn","BigText":"Chúc mừng bạn an toàn","TitleEn":"Bluezone","TextEn":"Chúc mừng bạn an toàn","BigTextEn":"Chúc mừng bạn an toàn"}',
    // DataContent: {
    //   FindID: 111,
    //   Sender: 'Bộ y tế',
    //   Content: 'Chúc mừng bạn an toàn',
    //   Result: false,
    //   unRead: 0,
    //   timestamp: new Date().getTime(),
    // },
    DataContent:
      '{"FindID":111,"Sender":"Bộ y tế","Content":"Chúc mừng bạn an toàn","Result":"false","unRead":0,"timestamp":1595750521916}',
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

    Type: 'MOBILE',
    Notify: {
      Id: 'notifyOTP',
      SmallIcon: 'icon_bluezone_service',
      LargeIcon: '',
      Title: 'Bluezone',
      Text: 'Bạn đã cập nhật thành công số điện thoại',
      BigText: 'Bạn đã cập nhật thành công số điện thoại',
      TitleEn: 'Bluezone',
      TextEn: 'You have successfully updated your phone number.',
      BigTextEn: 'You have successfully updated your phone number.',
    },
    DataContent: {
      Sender: 'MIC',
      Content: '',
      unRead: 0,
      timestamp: 1595749062345,
    },
  },
};
