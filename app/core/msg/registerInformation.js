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
  titleHeader: {
    id: 'bluezone.registerInformation.titleHeader',
    defaultMessage: 'Thông tin bổ sung',
  },
  title: {
    id: 'bluezone.registerInformation.title',
    defaultMessage: 'Bạn hãy bổ sung thêm các thông tin sau',
  },
  fullName: {
    id: 'bluezone.registerInformation.fullName',
    defaultMessage: 'Họ tên',
  },
  address: {
    id: 'bluezone.registerInformation.address',
    defaultMessage: 'Địa chỉ',
  },
  send: {
    id: 'bluezone.registerInformation.send',
    defaultMessage: 'Gửi',
  },
  skip: {
    id: 'bluezone.registerInformation.skip',
    defaultMessage: 'Bỏ qua',
  },
  close: {
    id: 'bluezone.registerInformation.close',
    defaultMessage: 'Đóng',
  },

  // call api
  try: {
    id: 'bluezone.registerInformation.try',
    defaultMessage: 'Thử lại',
  },
  error: {
    id: 'bluezone.registerInformation.error',
    defaultMessage: 'Đã xảy ra sự cố',
  },
  redo: {
    id: 'bluezone.registerInformation.redo',
    defaultMessage: 'Vui lòng thao tác lại để sử dụng dịch vụ',
  },
  fullNameEnterNotValid: {
    id: 'bluezone.registerInformation.fullNameEnterNotValid',
    defaultMessage: 'Họ và tên bạn nhập phải từ 3 kí tự trở lên.',
  },
  addressEnterNotValid: {
    id: 'bluezone.registerInformation.addressEnterNotValid',
    defaultMessage: 'Địa chỉ bạn nhập không hợp lệ',
  },
  errorTitle: {
    id: 'bluezone.registerInformation.errorTitle',
    defaultMessage: 'Thông báo',
  },
  btnTryAgain: {
    id: 'bluezone.registerInformation.textBtnTryAgain',
    defaultMessage: 'Nhập lại',
  },
  textCheckbox1: {
    id: 'bluezone.registerInformation.textCheckbox1',
    defaultMessage:
      'Xác nhận thông tin bạn điền vào là chính xác. Bạn đã đọc, đồng ý với ',
  },
  textCheckbox2: {
    id: 'bluezone.registerInformation.textCheckbox2',
    defaultMessage: 'Điều khoản sử dụng ',
  },
  textCheckbox3: {
    id: 'bluezone.registerInformation.textCheckbox3',
    defaultMessage:
      'và đồng ý chia sẻ với cơ quan y tế khi bạn được xác định bị nhiễm hoặc nghi nhiễm Covid-19.',
  },
});
