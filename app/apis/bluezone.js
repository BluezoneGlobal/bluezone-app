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
import {DOMAIN} from '../Configuration';

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
export function CreateAndSendOTPCode(numberPhone, successCb, errorCb) {
  const options = {
    method: 'post',
    data: {
      PhoneNumber: numberPhone,
    },
    url: `${DOMAIN}/api/App/CreateAndSendOTPCode`,
  };
  this.setState({showLoading: true});
  axios(options).then(
    response => {
      successCb(response);
    },
    error => {
      errorCb(error);
    },
  );
}
