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

/**
 * Đăng kí tokenfirebase
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number}}
 */
const RegisterUserErrorCode = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
};

/**
 *  Đăng kí số điện thoại
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number, TOKEN_FIREBASE_CHUA_DANG_KI: number, SO_DIEN_THOAI_KHONG_HOP_LE: number}}
 */
const CreateAndSendOTPCodeErrorCode = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 21,
  TOKEN_FIREBASE_CHUA_DANG_KI: 22,
  SO_DIEN_THOAI_KHONG_HOP_LE: 23,
};

/**
 * Xác thực OTP gửi qua số điện thoại đã đăng kí
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_CU_CHUA_DANG_KI: number, TOKEN_FIREBASE_MOI_KHONG_HOP_LE: number}}
 */
const ConfirmOTPCodeErrorCode = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_CHUA_DANG_KI: 31,
  SO_DIEN_THOAI_KHONG_HOP_LE: 32,
  MA_OTP_KHONG_HOP_LE: 33,
  MA_OTP_DA_HET_HAN: 34,
};

/**
 * Cap nhau Token firebase
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_CU_CHUA_DUOC_DANG_KI: number, TOKEN_FIREBASE_MOI_KHONG_HOP_LE: number}}
 */
const UpdateTokenFirebaseErrorCode = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_MOI_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
  TOKEN_FIREBASE_CU_CHUA_DUOC_DANG_KI: 41,
};

/**
 * Gui lich su tiep xuc bang OTP
 * @type {{OTP_HET_HAN: number, YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number, OTP_KHONG_HOP_LE: number}}
 */
const ReportHistoryConfirmDeclareErrorCode = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
  OTP_KHONG_HOP_LE: 51,
  OTP_HET_HAN: 52,
};

/**
 * Gui lich su tiep xuc khi xac dinh la F0, F1
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number, FIND_GUID_HET_HAN: number, FIND_GUID_KHONG_HOP_LE: number}}
 */
const ReportHistoryConfirmContact = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
  FIND_GUID_KHONG_HOP_LE: 61,
  FIND_GUID_HET_HAN: 62,
};

/**
 * Khai bao y té
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number, TOKEN_KHONG_HOP_LE: number, FIND_GUID_HET_HAN: number, TOKEN_HET_HAN: number, FIND_GUID_KHONG_HOP_LE: number}}
 */
const DeclareInformation = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
  FIND_GUID_KHONG_HOP_LE: 61,
  FIND_GUID_HET_HAN: 62,
  TOKEN_KHONG_HOP_LE: 71, // Token trả về khi xác nhận tiếp xúc
  TOKEN_HET_HAN: 72, // Token trả về khi xác nhận tiếp xúc
};

/**
 * Dang ki lai Tokenfirebase khi can
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_KHONG_HOP_LE: number}}
 */
const PushInfoApp = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_KHONG_HOP_LE: 11, // Null, trống, đăng kí fail
};

/**
 * Thông tin bổ sung
 * @type {{YEU_CAU_KHONG_HOP_LE: number, SERVER_LOI: number, TOKEN_FIREBASE_CHUA_DANG_KI: number, FULLNAME_KHONG_HOP_LE: number, ADDRESS_KHONG_HOP_LE: number}}
 */
const RegisterInfomation = {
  SERVER_LOI: 1,
  YEU_CAU_KHONG_HOP_LE: 2,
  TOKEN_FIREBASE_CHUA_DANG_KI: 81,
  FULLNAME_KHONG_HOP_LE: 82,
  ADDRESS_KHONG_HOP_LE: 83,
};


export {
  RegisterUserErrorCode,
  CreateAndSendOTPCodeErrorCode,
  ConfirmOTPCodeErrorCode,
  UpdateTokenFirebaseErrorCode,
  ReportHistoryConfirmDeclareErrorCode,
  ReportHistoryConfirmContact,
  DeclareInformation,
  PushInfoApp,
  RegisterInfomation
};
