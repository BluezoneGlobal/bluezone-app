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

import DeviceInfo from 'react-native-device-info';

const isValidPart = (x, lexicographical) => {
  return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
};

const versionCompare = (v1, v2, options) => {
  const lexicographical = options && options.lexicographical;
  const zeroExtend = options && options.zeroExtend;
  let v1parts = v1.split('.');
  let v2parts = v2.split('.');

  if (
    !v1parts.every(isValidPart, lexicographical) ||
    !v2parts.every(isValidPart, lexicographical)
  ) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) {
      v1parts.push('0');
    }
    while (v2parts.length < v1parts.length) {
      v2parts.push('0');
    }
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
};

const checkUpdate = (currentVersion, latestVersion, rangeVersion = []) => {
  if (currentVersion === latestVersion) {
    return false;
  }

  if (rangeVersion.length === 0) {
    if (versionCompare(currentVersion, latestVersion) === NaN) {
      return false;
    }
    return versionCompare(latestVersion, currentVersion) === 1;
  }

  for (let i = 0; i < rangeVersion.length; i++) {
    const compare1 = versionCompare(currentVersion, rangeVersion[i][0]);
    const compare2 = versionCompare(rangeVersion[i][1], currentVersion);

    if (compare1 === NaN || compare2 === NaN) {
      break;
    }
    if (
      (compare1 === 0 || compare1 === 1) &&
      (compare2 === 0 || compare2 === 1)
    ) {
      return true;
    }
  }
  return false;
};

const getStatusUpdate = (latestVersion, rangeForce, rangeRecommended) => {
  const currentVersion = DeviceInfo.getVersion();
  if (checkUpdate(currentVersion, latestVersion, rangeForce)) {
    if (rangeForce.length !== 0) {
      return 1;
    }
  }
  if (checkUpdate(currentVersion, latestVersion, rangeRecommended)) {
    return 2;
  }
  return 0;
};

export default getStatusUpdate;
