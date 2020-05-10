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

import axios from 'axios';
import configuration from '../Configuration';
import {DOMAIN} from './server';
import RNFS from 'react-native-fs';
import Service from './service';

// 1. Trả về trạng phái phiên bản app mới nhất trên server
export const getCheckVersions = async (success, fail) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN}/api/App/CheckVersion`,
  };
  await axios(options).then(
    response => {
      if (response && response.status === 200 && response.data.isOk) {
        success(response.data.Object);
      }
    },
    error => {
      fail(error);
    },
  );
};

// 2. Trả về số lượng người cài app
export const getBluezonerAmount = async (success, fail) => {
  const options = {
    method: 'GET',
    url: `${DOMAIN}/api/App/GetTotalUserInstallApp`,
  };
  await axios(options).then(
    response => {
      if (response && response.status === 200 && response.data.isOk) {
        success(response.data.Object);
      }
    },
    error => {
      fail && fail(error);
    },
  );
};

// 3.
export function CreateAndSendOTPCode(PhoneNumber, successCb, errorCb) {
  const {TokenFirebase} = configuration;
  const options = {
    method: 'POST',
    data: {
      PhoneNumber: PhoneNumber,
      TokenFirebase: TokenFirebase,
    },
    url: `${DOMAIN}/api/App/CreateAndSendOTPCode`,
  };
  axios(options).then(
    response => {
      if (response && response.status === 200) {
        successCb(response);
      }
    },
    error => {
      errorCb(error);
    },
  );
}

export function VerifyOTPCode(PhoneNumber, OTPCode, successCb, errorCb) {
  const {TokenFirebase} = configuration;
  const options = {
    method: 'POST',
    data: {
      TokenFirebase: TokenFirebase,
      PhoneNumber: PhoneNumber,
      OTPCode: OTPCode,
    },
    url: `${DOMAIN}/api/App/ConfirmOTPCode`,
  };
  axios(options).then(
    response => {
      if (response && response.status === 200 && response.data.isOk === true) {
        successCb(response);
      } else {
        errorCb(response.isError);
      }
    },
    error => {
      errorCb(error);
    },
  );
}

export async function uploadHistoryF12(filePath, FindFID, successCb, errorCb) {
  const {TokenFirebase} = configuration;
  const UserCode = await Service.getBluezoneIdFirst6Char();

  // RNFS.readFile(filePath, 'utf8')
  //   .then(success => {
  //     alert(success);
  //   })
  //   .catch(err => {
  //     alert(err);
  //   });

  const file = {
    uri: `file://${filePath}`,
    type: 'text/xml',
    name: 'history.txt',
  };

  // const file = {
  //   // id: 'f12',
  //   uri:
  //     'file:///storage/emulated/0/Pictures/Screenshots/Screenshot_20190514-195706.png',
  //   type: 'image/png',
  //   name: 'image.png',
  //   // webkitRelativePath: '',
  // };

  let formData = new FormData();
  formData.append('BluezoneID', UserCode);
  formData.append('TokenFirebase', TokenFirebase);
  formData.append('FindFID', FindFID);
  formData.append('file', file);

  const options = {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: `${DOMAIN}/api/App/ReportHistoryF12`,
  };

  axios(options).then(
      response => {
        alert(JSON.stringify(response));
        if (response && response.status === 200 && response.data.isOk === true) {
          successCb(response);
        } else {
          errorCb(response.Object);
        }
      },
      error => {
        errorCb(error);
      },
  );
}

export function uploadHistoryF0(filePath, OTPCode, successCb, errorCb) {
  const {TokenFirebase} = configuration;

  const file = {
    uri: `file://${filePath}`,
    type: 'text/xml',
    name: 'history.txt',
  };

  const formData = new FormData();
  formData.append('OTPCode', OTPCode);
  formData.append('TokenFirebase', TokenFirebase);
  formData.append('file', file);

  const options = {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: `${DOMAIN}/api/App/ReportHistoryF12`,
  };

  axios(options).then(
    response => {
      if (response && response.status === 200 && response.data.isOk === true) {
        successCb(response);
      } else {
        errorCb(response.Object);
      }
    },
    error => {
      errorCb(error);
    },
  );
}

export function declaration(FindFID, InfoJson, successCb, errorCb) {
  const {TokenFirebase, UserCode} = configuration;

  const options = {
    method: 'POST',
    data: {
      FindFID: 1,
      BluezoneID: UserCode,
      TokenFirebase: TokenFirebase,
      InfoJson: InfoJson,
    },
    url: `${DOMAIN}/api/App/F12DeclareInformation`,
  };
  axios(options).then(
    response => {
      if (response && response.status === 200 && response.data.isOk === true) {
        successCb(response);
      } else {
        errorCb(response.isError);
      }
    },
    error => {
      errorCb(error);
    },
  );
}
