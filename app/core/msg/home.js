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

import {defineMessages} from 'react-intl';

export default defineMessages({
  warn: {
    id: 'bluezone.home.warn',
    defaultMessage: 'Cảnh báo',
  },
  header: {
    id: 'bluezone.home.header',
    defaultMessage: 'Bảo vệ mình, bảo vệ cộng đồng',
  },
  productLabel1: {
    id: 'bluezone.home.productLabel1',
    defaultMessage: 'Ứng dụng cảnh báo nếu bạn đã từng tiếp xúc gần',
  },
  productLabel2: {
    id: 'bluezone.home.productLabel2',
    defaultMessage: 'người nhiễm',
  },
  productLabel3: {
    id: 'bluezone.home.productLabel3',
    defaultMessage: 'COVID-19',
  },
  around: {
    id: 'bluezone.home.around',
    defaultMessage: 'quanh bạn',
  },
  community: {
    id: 'bluezone.home.community',
    defaultMessage: 'Cộng đồng',
  },
  bluezoner: {
    id: 'bluezone.home.bluezoner',
    defaultMessage: 'Bluezoner',
  },
  bluezoners: {
    id: 'bluezone.home.bluezoners',
    defaultMessage: 'Bluezoner',
  },
  traceButton: {
    id: 'bluezone.home.traceButton',
    defaultMessage: 'Người dùng quanh bạn',
  },
  historyButton: {
    id: 'bluezone.home.historyButton',
    defaultMessage: 'Lịch sử tiếp xúc',
  },
  scheduleNotifyOTP: {
    id: 'bluezone.home.scheduleNotifyOTP',
    defaultMessage:
      'Bạn cần cập nhật số điện thoại để nhận được hỗ trợ trực tiếp trong trường hợp bạn tiếp xúc gần với người nhiễm COVID-19.',
  },
  updatePhoneNumber: {
    id: 'bluezone.home.updatePhoneNumber',
    defaultMessage: 'Cập nhật số điên thoại',
  },
  scanning: {
    id: 'bluezone.home.scanning',
    defaultMessage: 'Đang quét...',
  },
  inviteContent: {
    id: 'bluezone.home.inviteContent',
    defaultMessage:
      'Bảo vệ người thân, bạn bè trước đại dịch. Hãy mời họ tham gia cộng đồng Bluezoner',
  },
  inviteButton: {
    id: 'bluezone.home.inviteButton',
    defaultMessage: 'Đồng ý',
  },
  Cancel: {
    id: 'bluezone.modal.Cancel',
    defaultMessage: 'Bỏ qua',
  },
  Ok: {
    id: 'bluezone.modal.Ok',
    defaultMessage: 'Cập nhật',
  },
  hasNewVersion: {
    id: 'bluezone.modal.hasNewVersion',
    defaultMessage: 'Đã có phiên bản mới',
  },
  updateVersion: {
    id: 'bluezone.modal.updateVersion',
    defaultMessage: 'Bạn hãy cập nhật để sử dụng các tính năng mới nhất',
  },
  permissionLocation: {
    id: 'bluezone.modal.permissionLocation',
    defaultMessage: 'Cấp quyền truy cập vị trí',
  },
  openSettingLocation: {
    id: 'bluezone.modal.openSettingLocation',
    defaultMessage: 'Bật vị trí',
  },
  openSettingPermissionBlueTooth: {
    id: 'bluezone.modal.openSettingPermissionBlueTooth',
    defaultMessage: 'Cấp quyền truy cập Bluetooth',
  },
  openSettingBluetooth: {
    id: 'bluezone.modal.openSettingBluetooth',
    defaultMessage: 'Bật Bluetooth',
  },
  permissionNotify: {
    id: 'bluezone.modal.permissionNotify',
    defaultMessage: 'Cấp quyền thông báo',
  },
  openSettingIOFile: {
    id: 'bluezone.modal.openSettingIOFile',
    defaultMessage: 'Đến cài đặt Bật lưu trữ',
  },
  report: {
    id: 'bluezone.modal.report',
    defaultMessage: 'Thông báo',
  },
  textWhy: {
    id: 'bluezone.home.textWhy',
    defaultMessage: 'Tại sao 2 máy cạnh nhau, số liệu khác nhau?',
  },
  textWhy1: {
    id: 'bluezone.home.textWhy1',
    defaultMessage:
      'Tại sao hai máy cạnh nhau, số liệu khác nhau? Bạn có thể thấy hai máy để gần nhau, nhưng số liệu “Người dùng quanh bạn” khác nhau.',
  },
  textWhy2: {
    id: 'bluezone.home.textWhy2',
    defaultMessage:
      'Điều này là do các máy không quét liên tục, mà có chu kỳ nghỉ luân phiên để tiết kiệm năng lượng. Các máy khác nhau có khoảng thời gian hoạt động và nghỉ khác nhau. Tại thời điểm máy nghỉ không quét thì sẽ không ghi nhận thêm các máy khác cho đến khi máy hoạt động trở lại.',
  },
  textWhy3: {
    id: 'bluezone.home.textWhy3',
    defaultMessage:
      'Tuy nhiên dù số liệu hiển thị giữa các máy có thể khác nhau, nhưng các tiếp xúc gần vẫn được ghi nhận đầy đủ. Tiếp xúc gần được định nghĩa là việc 2 người gặp nhau trong một khoảng thời gian đủ dài, để virus có thể lây nhiễm.',
  },
  agree: {
    id: 'bluezone.home.agree',
    defaultMessage: 'Đồng ý',
  },
  utilities: {
    id: 'bluezone.home.utilities',
    defaultMessage: 'Tiện ích',
  }
});
