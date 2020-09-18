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

import {Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import {dev} from '../apis/server';

// TODO: Bo sung close db moi khi open:
// https://www.djamware.com/post/5caec76380aca754f7a9d1f1/react-native-tutorial-sqlite-offline-androidios-mobile-app

if (dev) {
  SQLite.DEBUG(true);
}

SQLite.enablePromise(false);

const database_name = 'app_db_2.db';
const database_version = '3.3';
const database_displayname = 'Bluezone database';
const database_size = 20 * 1024 * 1024;

let db = null;

const open = () => {
  if (db != null) {
    return db;
  }
  if (Platform.OS === 'android') {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      () => {},
      () => {},
    );
  } else {
    db = SQLite.openDatabase({
      name: database_name,
      location: 'Documents',
      database_version,
      database_displayname,
      database_size,
    });
  }
  return db;
};

const close = () => {
  if (db) {
    db.close();
    db = null;
  }
};

const initDatabase = (success, failure) => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='notify'",
      [],
      function(tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql('DROP TABLE IF EXISTS notify');
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS notify(id INTEGER PRIMARY KEY AUTOINCREMENT, notifyId TEXT, smallIcon TEXT, largeIcon TEXT, title TEXT, text TEXT, bigText TEXT, titleEn TEXT, textEn TEXT, bigTextEn TEXT, _group TEXT, timestamp REAL, unRead REAL, data TEXT, level INTEGER)',
          );
          tx.executeSql(
            'CREATE UNIQUE INDEX idx_positions_title ON notify (notifyId)',
          );
        }
      },
    );
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='devLog'",
      [],
      function(tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql('DROP TABLE IF EXISTS devLog');
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS devLog(id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp REAL, key TEXT, data TEXT)',
          );
        }
      },
    );
  });
};

const replaceNotify = (notify, success, failure) => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql(
      'REPLACE INTO notify(notifyId, smallIcon, largeIcon, title, text, bigText, titleEn, textEn, bigTextEn, _group, timestamp, unRead, data) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        notify.data.notifyId,
        notify.data.Notify.SmallIcon,
        notify.data.Notify.LargeIcon,
        notify.data.Notify.Title,
        notify.data.Notify.Text,
        notify.data.Notify.BigText,
        notify.data.Notify.TitleEn,
        notify.data.Notify.TextEn,
        notify.data.Notify.BigTextEn,
        notify.data.Type,
        notify.data.Notify.Timestamp || new Date().getTime(),
        0,
        JSON.stringify(notify.data.DataContent || {}),
      ],
      success,
      failure,
    );
  });
};

const mergeNotify = (notify, success, failure) => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql(
      `SELECT * FROM notify WHERE notifyId ="${notify.data.notifyId}"`,
      [],
      (tx, results) => {
        let oldNotify = results.rows.length > 0 ? results.rows.item(0) : {};
        tx.executeSql(
          'REPLACE INTO notify(notifyId, smallIcon, largeIcon, title, text, bigText, titleEn, textEn, bigTextEn, _group, timestamp, unRead, data) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            notify.data.notifyId,
            notify.data.Notify.SmallIcon || oldNotify.smallIcon,
            notify.data.Notify.LargeIcon || oldNotify.largeIcon,
            notify.data.Notify.Title || oldNotify.title,
            notify.data.Notify.Text || oldNotify.text,
            notify.data.Notify.BigText || oldNotify.bigText,
            notify.data.Notify.TitleEn || oldNotify.titleEn,
            notify.data.Notify.TextEn || oldNotify.textEn,
            notify.data.Notify.BigTextEn || oldNotify.bigTextEn,
            notify.data.Type,
            notify.data.Notify.Timestamp || new Date().getTime(),
            oldNotify.unRead,
            JSON.stringify(notify.data.DataContent || {}),
          ],
          success,
          failure,
        );
      },
    );
  });
};

const readNotify = (notifyId, success, failure) => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql(
      'UPDATE notify SET unRead = ? WHERE notifyId = ?',
      [1, notifyId],
      success,
      failure,
    );
  });
};

const deleteNotify = (notifyId, success, failure) => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql(
      'DELETE FROM notify WHERE notifyId = ?',
      [notifyId],
      success,
      failure,
    );
  });
};

const getNotifyList = (timestamp, callback, count = 15) => {
  let SQL_QUERY = timestamp
    ? 'SELECT * FROM notify WHERE timestamp < ? ORDER BY timestamp DESC LIMIT ?'
    : 'SELECT * FROM notify ORDER BY timestamp DESC LIMIT ?';
  let PARAMS = timestamp ? [timestamp, count] : [count];

  db = open();
  db.transaction(tx => {
    tx.executeSql(
      SQL_QUERY,
      PARAMS,
      (txTemp, results) => {
        let temp = [];
        if (results.rows.length > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        }
        callback(temp);
      },
      () => {
        callback([]);
      },
    );
  });
};

// TODO Sua bo ham nay di
const getCountNotification = (timestamp, callback) => {
  db = open();
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) AS count FROM notify WHERE timestamp > ?',
      [timestamp],
      (txTemp, results) => {
        callback(results.rows.item(0).count);
      },
    );
  });
};

const addDevLog = log => {
  db = open();
  db.transaction(function(txn) {
    txn.executeSql('INSERT INTO devLog(timestamp, key, data ) VALUES (?,?,?)', [
      log.time || new Date().getTime(),
      log.key,
      JSON.stringify(log.data),
    ]);
  });
};

const getAllDevLog = (success = () => {}, failure = () => {}) => {
  db = open();
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM devLog',
      [],
      (txTemp, results) => {
        let temp = [];
        if (results.rows.length > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        }
        success(temp);
      },
      (error, error2) => {
        failure(error2);
      },
    );
  });
};

const getPartialDevLog = (
  timestamp,
  success = () => {},
  failure = () => {},
  limit = 20,
) => {
  let SQL_QUERY = timestamp
    ? 'SELECT * FROM devLog WHERE timestamp < ? ORDER BY timestamp DESC LIMIT ?'
    : 'SELECT * FROM devLog ORDER BY timestamp DESC LIMIT ?';
  let PARAMS = timestamp ? [timestamp, limit] : [limit];
  db = open();
  db.transaction(tx => {
    tx.executeSql(
      SQL_QUERY,
      PARAMS,
      (txTemp, results) => {
        let temp = [];
        if (results.rows.length > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        }
        success(temp);
      },
      (error, error2) => {
        failure(error2);
      },
    );
  });
};

const clearDevLog = (numberRetained = 2000, success, failure) => {
  db = open();
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM devLog WHERE timestamp < (SELECT MIN(timestamp) FROM (SELECT timestamp FROM devLog ORDER BY timestamp DESC LIMIT ?))',
      [numberRetained],
      (txTemp, results) => {
        success(results.rowsAffected);
      },
      (error, error2) => {
        failure(error2);
      },
    );
  });
};

const getCountBluezoneByDays = (timestamp, success, failure) => {
  const queryIOS = `
      SELECT dateStr, COUNT(blid_contact) as numberContact FROM
            (SELECT
                strftime('%d/%m/%Y', timestamp, 'unixepoch', 'localtime') as dateStr,
                blid_contact
             FROM trace_info
             WHERE timestamp * 1000 >= ?
             GROUP BY dateStr, blid_contact)
      GROUP BY dateStr`;
  const queryAndroid = `
      SELECT dateStr, COUNT(blid_contact) as numberContact FROM
            (SELECT
                strftime('%d/%m/%Y', timestamp / 1000, 'unixepoch', 'localtime') as dateStr,
                blid_contact
             FROM trace_info
             WHERE timestamp >= ?
             GROUP BY dateStr, blid_contact)
      GROUP BY dateStr`;

  const query = Platform.OS === 'android' ? queryAndroid : queryIOS;

  // const queryAndroid1 = `
  //     SELECT nDay, nDay * 86400000, COUNT(blid_contact) as numberContact FROM
  //           (SELECT
  //               timestamp / 86400000 as nDay,
  //               blid_contact
  //            FROM trace_info
  //            WHERE timestamp >= ?
  //            GROUP BY nDay, blid_contact)
  //     GROUP BY nDay`;
  //
  // const queryAndroid2 = `
  //     SELECT
  //               timestamp / 86400000 as nDay
  //            FROM trace_info
  //            WHERE timestamp >= ?
  //            GROUP BY nDay, blid_contact`;

  db = open();
  db.transaction(tx => {
    tx.executeSql(
      query,
      [timestamp],
      (txTemp, results) => {
        let temp = [];
        if (results.rows.length > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        }
        success && success(temp);
      },
      (error, error2) => {
        failure(error2);
      },
    );
  });
};

export {
  open,
  close,
  initDatabase,
  replaceNotify,
  mergeNotify,
  readNotify,
  deleteNotify,
  getNotifyList,
  getCountNotification,
  addDevLog,
  getPartialDevLog,
  getAllDevLog,
  clearDevLog,
  getCountBluezoneByDays,
};
