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

import RNFS from 'react-native-fs';

import {
  addDevLog,
  getPartialDevLog,
  getAllDevLog,
  clearDevLog,
} from '../db/SqliteDb';
import {dev} from '../apis/server';
import {
  getLastTimeClearLog as getLastTimeClearLogStorage,
  setLastTimeClearLog as setLastTimeClearLogStorage,
} from '../../core/storage';
import {syncTokenFirebase} from '../../configuration';
import {retryUploadLogFile} from '../apis/bluezone';
import * as msg from '../../const/log';

const PREFIX_LOG_INFO = 'I/';
const PREFIX_LOG_WARN = 'W/';
const PREFIX_LOG_ERROR = 'E/';
const PREFIX_LOG_CRASH = 'C/';

const events = [];
const logFileName = 'log';
const logFileType = 'txt';

let lastTimeClearLog = null;

const info = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_INFO)
    ? key
    : `${PREFIX_LOG_INFO}: ${key}`;
  addLogDb({key: _key, data: data});
};

const warn = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_WARN)
    ? key
    : `${PREFIX_LOG_WARN}: ${key}`;
  addLogDb({key: _key, data: data});
};

const error = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_ERROR)
    ? key
    : `${PREFIX_LOG_ERROR}: ${key}`;
  addLogDb({key: _key, data: data});
};

const crash = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_CRASH)
    ? key
    : `${PREFIX_LOG_CRASH}: ${key}`;
  addLogDb({key: _key, data: data});
};

const getLastTimeClearLog = async () => {
  if (!lastTimeClearLog) {
    lastTimeClearLog = await getLastTimeClearLogStorage();
  }
  return lastTimeClearLog;
};

const setLastTimeClearLog = value => {
  lastTimeClearLog = value;
  setLastTimeClearLogStorage(value);
};

const addLogDb = ({key, data}) => {
  const _data = dev ? data : undefined;
  broadcastEventListener({key, data});
  const dateNow = new Date();
  getLastTimeClearLog().then(_lastTimeClearLog => {
    if (
      dateNow.toLocaleDateString() !==
      new Date(_lastTimeClearLog).toLocaleDateString()
    ) {
      setLastTimeClearLog(dateNow.getTime());
      clearDevLog(
        2000,
        () => {
          addDevLog({key, data: _data});
        },
        () => {
          addDevLog({key, data: _data});
        },
      );
      return;
    }
    addDevLog({key, data: _data});
  });
};

const get = (timestamp, success = () => {}, failure = () => {}) => {
  getPartialDevLog(timestamp, success, failure);
};

const addListener = fn => {
  events.push(fn);
};

const broadcastEventListener = status => {
  for (let i = 0; i < events.length; i++) {
    events[i](status);
  }
};

const writeFileLog = (success, failed) => {
  getAllDevLog(data => {
    const now = new Date().getTime();
    const root = RNFS.DocumentDirectoryPath;

    const _logFilePath = `${root}/${logFileName}_${now}_${logFileType}`;
    RNFS.writeFile(_logFilePath, 'content', 'utf8')
      .then(result => {
        success(_logFilePath);
      })
      .catch(failed);
  }, failed);
};

const uploadFileLog = () => {
  syncTokenFirebase(async () => {
    writeFileLog(
      filePath => {
        retryUploadLogFile(
          filePath,
          () => {
            RNFS.unlink(filePath).then(r => {});
          },
          () => {
            RNFS.unlink(filePath).then(r => {});
          },
        );
      },
      e => {
        error(msg.WRITE_LOG_FILE, e);
      },
    );
  });
};

const log = {
  info,
  warn,
  error,
  crash,
  get,
  addListener,
  writeFileLog,
  uploadFileLog,
};

export default log;
