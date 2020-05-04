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

const getNotifications = async callback => {
  const SQL_QUERY = `SELECT * FROM table_CPMS`;
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

export {
  open,
  close,
  getDays,
  getNotifications,
};
