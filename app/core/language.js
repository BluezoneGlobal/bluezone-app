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

import {createFromResourceLanguage} from '../i18n';
import {
  getResourceLanguage as getResourceLanguageStorage,
  setResourceLanguage as setResourceLanguageStorage,
} from './storage';
import {CurrentLanguageVersion, versionCompare} from './version';
import vi from '../translations/vi';
import en from '../translations/en';
import {getCheckVersions, getResourceLanguage} from './apis/bluezone';

let language = {};
const handleResourceChangeList = [];

const registerResourceLanguageChange = handleChange => {
  for (let i = 0; i < handleResourceChangeList.length; i++) {
    if (handleResourceChangeList[i] === handleChange) {
      return;
    }
  }
  handleResourceChangeList.push(handleChange);
};

const broadcastResourceChange = _language => {
  for (let i = 0; i < handleResourceChangeList.length; i++) {
    handleResourceChangeList[i](_language);
  }
};

const initResourceLanguage = async callback => {
  // Lay resource tu storage
  let storageResourceJson = (await getResourceLanguageStorage()) || {};
  const storageResourceVersion = storageResourceJson.version;

  // Lay resource build cung app
  const appResourceJson = {
    version: CurrentLanguageVersion,
    vi: vi,
    en: en,
  };
  const appResourceVersion = appResourceJson.version;

  if (
    storageResourceVersion &&
    versionCompare(appResourceVersion, storageResourceVersion) >= 0
  ) {
    // Xoa resource trong storage
    setResourceLanguageStorage({});
  }

  // So sanh phien ban resource app va storage
  // Neu appResourceVersion >= storageResourceJson => Lay appResourceJson uu tien nhat
  if (
    storageResourceVersion &&
    versionCompare(storageResourceVersion, appResourceVersion) >= 0
  ) {
    language = {
      version: storageResourceVersion,
      vi: {
        ...appResourceJson.vi,
        ...storageResourceJson.vi,
      },
      en: {
        ...appResourceJson.en,
        ...storageResourceJson.en,
      },
    };
  } else {
    language = appResourceJson;
  }
  callback(language);
};

const setResourceLanguage = _language => {
  language = {
    version: _language.version,
    vi: {
      ...language.vi,
      ..._language.vi,
    },
    en: {
      ...language.en,
      ..._language.en,
    },
  };
  // Chi luu cac phan thay doi vao storage
  setResourceLanguageStorage(_language);

  const resource = createFromResourceLanguage(language);
  broadcastResourceChange(resource);
};

const mergeResourceLanguage = async _language => {
  // Merge resource moi nhat vao resource chung
  language = {
    version: _language.version,
    vi: {
      ...language.vi,
      ..._language.vi,
    },
    en: {
      ...language.en,
      ..._language.en,
    },
  };

  // Merge resource moi nhat vao resource luu storage
  const storageResourceJson = (await getResourceLanguageStorage()) || {};

  // Chi luu cac phan thay doi vao storage
  setResourceLanguageStorage({
    version: _language.version,
    vi: {
      ...storageResourceJson.vi,
      ..._language.vi,
    },
    en: {
      ...storageResourceJson.en,
      ..._language.en,
    },
  });

  handleBroadcastResource();
};

const handleBroadcastResource = () => {
  const resource = createFromResourceLanguage(language);
  broadcastResourceChange(resource);
};

const syncResourceLanguage = (success, failure) => {
  const _success = lang => {
    handleBroadcastResource();
    success(lang);
  };
  const _failure = e => {
    handleBroadcastResource();
    failure(e);
  };
  getCheckVersions(
    serverResourceCheckVersion => {
      const serverResourceVersion = serverResourceCheckVersion.VersionResource;
      if (
        serverResourceVersion &&
        versionCompare(serverResourceVersion, language.version) > 0
      ) {
        getResourceLanguage(
          async serverResource => {
            serverResource.version = '4.0.0';
            if (
              serverResource.version &&
              versionCompare(serverResource.version, language.version) > 0
            ) {
              await mergeResourceLanguage(serverResource);
              success(language);
            } else {
              _success(language);
            }
          },
          e => {
            // Failure of getResourceLanguage
            _failure(e);
          },
          1000,
        );
      } else {
        _success(language);
      }
    },
    e => {
      // Failure of getCheckVersions
      _failure(e);
    },
    1000,
  );
};

export {
  initResourceLanguage,
  syncResourceLanguage,
  setResourceLanguage,
  mergeResourceLanguage,
  registerResourceLanguageChange,
};
