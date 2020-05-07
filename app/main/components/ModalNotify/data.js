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
        notifyId: '1995',
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
        group: 'mobile',
        timestamp: new Date().getTime(),
        unRead: false,
    },
};

export const messageNotifyOTPSuccess = {
    data: {
        notifyId: '1995',
        smallIcon: 'icon_bluezone_service',
        largeIcon: '',
        title: 'Bluezone',
        text:
            'Bạn đã cập nhật thành công số điện thoại.',
        bigText:
            'Bạn đã cập nhật thành công số điện thoại.',
        titleEn: 'Bluezone',
        textEn:
            'You have successfully updated your phone number.',
        bigTextEn:
            'You have successfully updated your phone number.',
        group: 'mobile',
        timestamp: new Date().getTime(),
        unRead: false,
    },
};
