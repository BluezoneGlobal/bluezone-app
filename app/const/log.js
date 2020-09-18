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

// Json
export const PARSE_PUSH_FAILURE = 'Có lỗi chuyển gói PUSH từ string sang json của';

// Upload lich su tiep xuc
export const HISTORY_FILE = '({1}) File lịch sử tiếp xúc';
export const UPLOAD_SUCCESS = '({1}) Đẩy lịch sử tiếp xúc thành công';
export const UPLOAD_FAILURE = '({1}) Đẩy lịch sử tiếp xúc lỗi - lần {2}';
export const UPLOAD_STOP = '({1}) Dừng đẩy lịch sử tiếp xúc do upload luôn 0% (freeMemory() === 0)';
export const DELETE_FILE_SUCCESS = 'Xóa file lịch sử tiếp xúc thành công';
export const DELETE_FILE_FAILURE = '({1}) Xóa file lịch sử tiếp xúc lỗi';
export const PARSE_RESPONSE_BODY_FAILURE = '({1}) Lỗi JSON.parse(response.body) khi upload thành công';
export const UPLOAD_PROGRESS = '({1}) Đẩy lịch sử tiếp xúc: {2}%';
export const INFO_FILE_UPLOAD = '({1}) Thông tin file';

// Gửi thông tin trước khi upload lịch sử tiếp xúc
export const SEND_INFO_BLUEZONE_SUCCESS = '({1}) Gửi thông tin truy vết thành công';
export const SEND_INFO_BLUEZONE_FAILURE = '({1}) Gửi thông tin truy vết lỗi - lần {2}';

// Service API
export const BEGIN_CHECK_EXPOSURE = 'Bắt đầu kiểm tra tiếp xúc';
export const END_CHECK_EXPOSURE = 'Kết thúc kiểm tra tiếp xúc';
export const BEGIN_GET_BZ_INFO = 'Bắt đầu lấy BzID';
export const END_GET_BZ_INFO = 'Kết thúc lấy BzID';
export const BEGIN_WRITE_HISTORY_FILE = 'Bắt đầu ghi file lịch sử tiếp xúc';
export const END_WRITE_HISTORY_FILE = 'Kết thúc ghi file lịch sử tiếp xúc';

// PUSH
export const PUSH_RECEIVE = 'Nhận được gói PUSH {1}';
export const PUSH_INVALIDATE = 'Gói PUSH không hợp lệ {1}';

// Token firebase
export const REGISTER_TOKEN_FIREBASE = 'Đăng kí token firebase';
export const UPDATE_TOKEN_FIREBASE = 'Cập nhật token firebase';
export const REGISTER_TOKEN_FIREBASE_SUCCESS = 'Đăng kí token firebase thành công';
export const REGISTER_TOKEN_FIREBASE_FAILURE = 'Đăng kí token firebase lỗi';
export const UPDATE_TOKEN_FIREBASE_SUCCESS = 'Cập nhật token firebase thành công';
export const UPDATE_TOKEN_FIREBASE_FAILURE = 'Cập nhật token firebase lỗi';
export const SYNC_TOKEN_FIREBASE_SUCCESS = 'Đồng bộ token firebase thành công';
export const SYNC_TOKEN_FIREBASE_FAILURE = 'Đồng bộ token firebase lỗi';
export const GET_TOKEN_FIREBASE_FAILURE = 'Lấy token firebase lỗi';

// Log
export const WRITE_LOG_FILE = 'Lỗi ghi lịch sử log ra file';
export const UPLOAD_LOG_FILE_SUCCESS = 'Đẩy file log thành công';
export const UPLOAD_LOG_FILE_ERROR = 'Đẩy file log lỗi - lần {1}';

/**
 * Tra ve noi dung ghi log
 * @param template
 * @param args
 * @returns {*}
 */
const tmpl = (template, ...args) => {
  for (let i = 0; i < args.length; i++) {
    template = template.replace(new RegExp(`\\{${i + 1}\\}`, 'gmi'), args[i]);
  }
  return template;
};

export default tmpl;
