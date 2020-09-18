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

// Const
import {TIME_RETRY_REQUEST_DEFAULT} from '../../const/api';

const _defaultFunc = () => {};

const _retryApi = (
  request,
  successCallback = _defaultFunc,
  failureCallback = _defaultFunc,
  timeRetry = TIME_RETRY_REQUEST_DEFAULT,
  numberRetry = 0,
) => {
  const _failureCallback = error => {
    if (numberRetry < timeRetry.length) {
      setTimeout(
        () =>
          _retryApi(
            request,
            successCallback,
            failureCallback,
            timeRetry,
            numberRetry + 1,
          ),
        timeRetry[numberRetry],
      );
    } else {
      failureCallback(error);
    }
  };
  const lastRetry = numberRetry >= timeRetry.length;
  request(successCallback, _failureCallback, numberRetry, lastRetry);
};

/**
 * Dang ki de goi 1 API bat khi neu loi thi se duoc thu gui lai
 * @param request
 * @param successCallback
 * @param failureCallback
 * @param timeRetry
 */
const retryApi = (request, successCallback, failureCallback, timeRetry) => {
  _retryApi(request, successCallback, failureCallback, timeRetry, 0);
};

export default retryApi;
