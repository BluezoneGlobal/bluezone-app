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
  title: {
    id: 'bluezone.verifyOTP.title',
    defaultMessage: 'Xác thực mã OTP',
  },
  enterPin: {
    id: 'bluezone.verifyOTP.enterPin',
    defaultMessage: 'Chúng tôi đang gửi SMS đến số điện thoại của bạn',
  },
  pleaseEnterPin: {
    id: 'bluezone.verifyOTP.pleaseEnterPin',
    defaultMessage: 'Vui lòng nhập mã OTP',
  },
  validPin: {
    id: 'bluezone.verifyOTP.validPin',
    defaultMessage: 'Gửi lại SMS',
  },
  confirm: {
    id: 'bluezone.verifyOTP.confirm',
    defaultMessage: 'Kích hoạt',
  },
  confirmHistory: {
    id: 'bluezone.verifyOTP.confirmHistory',
    defaultMessage: 'Gửi',
  },
  receivedOTP: {
    id: 'bluezone.verifyOTP.receivedOTP',
    defaultMessage: 'Bạn chưa nhận được mã OTP hoặc mã đã hết hạn?',
  },
  skip: {
    id: 'bluezone.register.skip',
    defaultMessage: 'Bỏ qua',
  },
  resetOTP: {
    id: 'bluezone.verifyOTP.resetOTP',
    defaultMessage: 'Gửi lại mã OTP',
  },
  optNotValid: {
    id: 'bluezone.verifyOTP.optNotValid',
    defaultMessage: 'Mã OTP không đúng, Bạn vui lòng thử lại.',
  },
  retry: {
    id: 'bluezone.verifyOTP.retry',
    defaultMessage: 'Thử lại',
  },
  saveOTP: {
    id: 'bluezone.verifyOTP.saveOTP',
    defaultMessage: 'Vui lòng nhập lại mã OTP',
  },
  otpsuccess: {
    id: 'bluezone.verifyOTP.otpsuccess',
    defaultMessage: 'Xác thực OTP thành công',
  },
  changePhoneNumber: {
    id: 'bluezone.verifyOTP.changePhoneNumber',
    defaultMessage: 'Số điện thoại không đúng?',
  },
  pleaseEnterYourPhone: {
    id: 'bluezone.verifyOTP.pleaseEnterYourPhone',
    defaultMessage: 'Nhập mã xác thực',
  },
  labelOPTSendHistory: {
    id: 'bluezone.verifyOTP.labelOPTSendHistory',
    defaultMessage: 'bluezone.verifyOTP.labelOPTSendHistory',
  },
  sendingHistory: {
    id: 'bluezone.verifyOTP.sending',
    defaultMessage: 'bluezone.verifyOTP.sending',
  },
  titleSendHistory: {
    id: 'bluezone.verifyOTP.titleSendHistory',
    defaultMessage: 'bluezone.verifyOTP.titleSendHistory',
  },
  titleSendHistorySuccess: {
    id: 'bluezone.verifyOTP.titleSendHistorySuccess',
    defaultMessage: 'bluezone.verifyOTP.titleSendHistorySuccess',
  },
  sendHistorySuccess: {
    id: 'bluezone.verifyOTP.sendHistorySuccess',
    defaultMessage: 'bluezone.verifyOTP.sendHistorySuccess',
  },
  titleSendHistoryError: {
    id: 'bluezone.verifyOTP.titleSendHistoryError',
    defaultMessage: 'bluezone.verifyOTP.titleSendHistoryError',
  },
  sendHistoryError: {
    id: 'bluezone.verifyOTP.sendHistoryError',
    defaultMessage: 'bluezone.verifyOTP.sendHistoryError',
  },
  otpdate: {
    id: 'bluezone.verifyOTP.otpdate',
    defaultMessage:
      'Mã OTP đã hết hạn. Bạn vui lòng click “Gửi lại” để lấy 1 mã OTP khác.',
  },
  btnTryAgain: {
    id: 'bluezone.verifyOTP.textBtnTryAgain',
    defaultMessage: 'Gửi lại token',
  },
  dong: {
    id: 'bluezone.register.dong',
    defaultMessage: 'Đóng',
  },
  errorServer: {
    id: 'bluezone.verifyOTP.errorServer',
    defaultMessage:
      'Có lỗi xảy ra khi thực hiện xác thực mã OTP. Xin lỗi bạn vì sự bất tiện này, vui lòng thực hiện lại sau.',
  },
  agree: {
    id: 'bluezone.verifyOTP.agree',
    defaultMessage: 'Đồng ý',
  },
  errorTitle: {
    id: 'bluezone.verifyOTP.errorTitle',
    defaultMessage: 'Thông báo',
  },
  otpIncorrect: {
    id: 'bluezone.verifyOTP.otpIncorrect',
    defaultMessage: 'Mã OTP không đúng. Bạn vui lòng thử lại.',
  },
  otpExpired: {
    id: 'bluezone.verifyOTP.otpExpired',
    defaultMessage: 'Mã OTP đã hết hạn. Bạn vui lòng nhập lại 1 mã OTP khác.',
  },
  retype: {
    id: 'bluezone.verifyOTP.retype',
    defaultMessage: 'Nhập  lại',
  },
});
