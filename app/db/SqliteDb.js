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
import moment from 'moment';
import {pushNotify} from '../CloudMessaging';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = 'app_db.db';
const database_version = '1.0';
const database_displayname = 'Bluezone database';
const database_size = 20000000;
const ONE_DAY = 86400000;
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

const createNotify = () => {
    // console.log('createNotify');
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='notify'",
            [],
            function (tx, res) {
                console.log('cuongntg - item:', res.rows.length);
                if (res.rows.length === 0) {
                    txn.executeSql('DROP TABLE IF EXISTS notify', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS notify(id INTEGER PRIMARY KEY AUTOINCREMENT, notifyId TEXT, smallIcon TEXT, largeIcon TEXT, title TEXT, text TEXT, bigText TEXT, titleEn TEXT, textEn TEXT, bigTextEn TEXT, _group TEXT, timestamp LONG, unRead TEXT, data TEXT)',
                        []
                    );
                    txn.executeSql(
                        'CREATE UNIQUE INDEX idx_positions_title ON notify (notifyId)',
                    );
                }
            }
        );
    });
};

const replaceNotify = (notifyObj, language = 'vi') => {
    pushNotify(notifyObj, language);
    db.transaction(function(txn) {
        txn.executeSql(
            'REPLACE INTO notify(notifyId, smallIcon, largeIcon, title, text, bigText, titleEn, textEn, bigTextEn, _group, timestamp, unRead, data) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                notifyObj.data.notifyId || notifyObj.data.timestamp || new Date().getTime(),
                notifyObj.data.smallIcon,
                notifyObj.data.largeIcon,
                notifyObj.data.title,
                notifyObj.data.text,
                notifyObj.data.bigText,
                notifyObj.data.titleEn,
                notifyObj.data.textEn,
                notifyObj.data.bigTextEn,
                notifyObj.data.group, // push thông tin cấu hình(CONFIG), push thông báo (INFO), push cảnh báo (WARN), push xác minh kết quả tiếp xúc (VERIFY), push nhắc cấp quyền (PERMISSION), push nhắc bật/tắt dịch vụ (SERVICE), push nhắc khai số điện thoại (MOBILE)
                notifyObj.data.timestamp || new Date().getTime(),
                notifyObj.data.unRead,
                JSON.stringify(notifyObj.data.data || {}),
            ],
            async (tx, results) => {
                if (results.rowsAffected > 0) {
                } else {
                    console.log('cuongntg - Insert notify Failed');
                }
            },
        );
        // txn.executeSql(
        //     'SELECT * FROM notify',
        //     [],
        //     (tx, results) => {
        //         var temp = [];
        //         for (let i = 0; i < results.rows.length; ++i) {
        //             temp.push(results.rows.item(i));
        //         }
        //         console.log('CUONGNTG - temp', temp);
        //     },
        // );
    });
};

const getNotifications = async (index, callback) => {
    const SQL_QUERY = `SELECT * FROM notify WHERE ID > ${index * 15} LIMIT 15`;
    db = open();
    db.transaction(tx => {
        tx.executeSql(
            SQL_QUERY,
            [],
            async (txTemp, results) => {
                let temp = [];
                if (results.rows.length > 0) {
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                }
                callback(temp);
            },
            (error, error2) => {
                callback([]);
            },
        );
    });
};

const getDays = async (days, callback) => {
  const SQL_QUERY = `SELECT DISTINCT DATE(timestamp/1000, 'unixepoch') AS dayonly FROM trace_info WHERE timestamp > ${
    days.length > 0 ? days[0] + ONE_DAY : 0
  }`;
  db = open();
  db.transaction(tx => {
    tx.executeSql(
      SQL_QUERY,
      [],
      async (txTemp, results) => {
        let temp = [];
        if (results.rows.length > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(moment(results.rows.item(i).dayonly).valueOf0());
          }
        }
        callback(temp);
      },
      (error, error2) => {
        callback([]);
      },
    );
  });
};

export {open, close, getDays, replaceNotify, createNotify, getNotifications};
