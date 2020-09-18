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
  description: {
    id: 'bluezone.start.description',
    defaultMessage:
      'Bảo vệ cộng đồng trước đại dịch COVID-19, Bộ Thông tin và Truyền thông và Bộ Y tế triển khai “Ứng dụng phát hiện tiếp xúc gần Bluezone” trên các thiết bị di động thông minh.\n' +
      '\n' +
      'Bluezone là ứng dụng cảnh báo nếu bạn đã tiếp xúc gần với người nhiễm COVID-19, giảm thiểu các nguy cơ lây lan trong cộng đồng, giúp trở lại cuộc sống bình thường.\n' +
      '\n' +
      'Chúng ta cùng chung tay ngăn chặn sự lây lan của virus bằng sức mạnh cả cộng đồng.\n' +
      '\n',
  },
  appRememberTitle: {
    id: 'bluezone.start.appRememberTitle',
    defaultMessage: 'Ứng dụng giúp bạn ghi nhận ',
  },
  appRememberDescription: {
    id: 'bluezone.start.appRememberDescription',
    defaultMessage: 'những người dùng Bluezone đã từng ở gần bạn.',
  },
  warningTitle: {
    id: 'bluezone.start.warningTitle',
    defaultMessage: 'Ứng dụng sẽ cảnh báo ngay ',
  },
  warningDescription: {
    id: 'bluezone.start.warningDescription',
    defaultMessage:
      'cho bạn nếu một trong số đó bị nhiễm hoặc nghi nhiễm COVID-19.',
  },
  dataSecurityTitle: {
    id: 'bluezone.start.dataSecurityTitle',
    defaultMessage: 'Dữ liệu được bảo mật, đảm bảo tính riêng tư ',
  },
  dataSecurityDescription: {
    id: 'bluezone.start.dataSecurityDescription',
    defaultMessage:
      'và được lưu trên điện thoại của bạn. Chỉ cơ quan y tế có thẩm quyền sử dụng dữ liệu này với sự đồng ý của bạn hoặc khi bạn bị nhiễm/nghi nhiễm Covid-19.',
  },
  saveHistory: {
    id: 'bluezone.start.saveHistory',
    defaultMessage: 'Bluezone chỉ ghi nhận lịch sử tiếp xúc mà ',
  },
  saveHistoryTitle: {
    id: 'bluezone.start.saveHistoryTitle',
    defaultMessage: 'không ghi nhận vị trí, địa điểm, ',
  },
  saveHistoryDescription: {
    id: 'bluezone.start.saveHistoryDescription',
    defaultMessage:
      'không sử dụng hoặc truy cập đến các thông tin khác trên điện thoại của bạn.',
  },
  startBluetoothTitle: {
    id: 'bluezone.start.startBluetoothTitle',
    defaultMessage: 'Hãy luôn bật bluetooth ',
  },
  startBluetoothDescription: {
    id: 'bluezone.start.startBluetoothDescription',
    defaultMessage:
      'để Bluezone có thể hoạt động. Bluezone chỉ sử dụng khoảng 10% pin mỗi ngày.',
  },
  button: {
    id: 'bluezone.start.button',
    defaultMessage: 'Bắt đầu sử dụng',
  },
});
