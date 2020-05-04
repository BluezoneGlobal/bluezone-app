/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 09:59
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

import React from 'react';
import {View, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {close, open} from '../../../db/SqliteDb';

// Components
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifySection from './NotifySession';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
// import InviteScreen from "../InviteScreen";

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
    this.index = 0;
    // this.db = null;
    this.db = open();
    this.db.transaction(function(txn) {
      txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_CPMS'",
          [],
          function(tx, res) {
            txn.executeSql('DROP TABLE IF EXISTS table_CPMS', []);
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_CPMS(id INTEGER PRIMARY KEY AUTOINCREMENT, largeIcon TEXT, title TEXT, text TEXT, bigText TEXT, timestamp REAL, _group TEXT, unRead TEXT)',
                [],
            );
          },
      );
    });
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    // this.initData();
    this.onWrite();
  }

  componentWillUnmount() {
    close();
    this.db = null;
  }

  onWrite = () => {
    this.db.transaction(function(tx) {
      for (let i = 0; i < 100; ++i) {
        tx.executeSql(
            'INSERT INTO table_CPMS (largeIcon, title, text, bigText, timestamp, _group, unRead) VALUES (?,?,?,?,?,?,?)',
            [
              'boyte',
              'Bộ Y tế',
              'Cách ly thêm 1 tuần đối với Hà...',
              'Được biết đối tượng F3 Hà... xét nghiệm đã cho kết quả âm tính lần 2. Tiến hành cách ly thêm một tuần để theo dõi và xét nghiệm.',
              1588517528002,
              'info',
              'false',
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
              } else {
                alert('Registration Failed');
              }
            },
        );
      }
    });
  };

  initData = async () => {
    this.getNotifications(this.index, items => {
      this.setState(prev => ({
        notifications: prev.notifications.concat(items),
      }));
    });
  };

  onGetDataFromDB = async (index) => {
    this.getNotifications(index, items => {
      this.setState(prev => ({
        notifications: prev.notifications.concat(items),
      }));
    });
  };

  getNotifications = async (index, callback) => {
    const SQL_QUERY = `SELECT * FROM table_CPMS WHERE _group IS NOT "warn" AND ID > ${index * 5} LIMIT 5`;
    // this.db = open();
    this.db.transaction(tx => {
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

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  onPressWarning = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyWarning', {item});
  };

  onPressNotification = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyDetail', {item});
  };

  render() {
    const {route} = this.props;
    const {notifications} = this.state;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const dataWar = {
      items: [
        {
          largeIcon: 'bluezone',
          title: 'Bluezone',
          text: 'Bạn được xác định tiếp xúc ...',
          bigText: 'Bạn được xác định tiếp xúc ...',
          timestamp: 1588517528002,
          _group: 'info',
          unRead: 'true',
        },
        {
          largeIcon: 'bluezone',
          title: 'Bluezone',
          text: 'Bạn có thể đã tiếp xúc với F0',
          bigText: 'Bạn có thể đã tiếp xúc với F0',
          timestamp: 1588517528002,
          _group: 'info',
          unRead: 'false',
        },
        {
          largeIcon: 'bluezone',
          title: 'Bluezone',
          text: 'Bạn được xác định là F0',
          bigText: 'Bạn được xác định là F0',
          timestamp: 1588517528002,
          _group: 'info',
          unRead: 'false',
        },
      ],
      callback: {
        onPress: this.onPressWarning,
      },
    };

    const dataNtf = {
      items:
      // [
      //   {
      //     largeIcon: 'bluezone',
      //     title: 'Bluezone',
      //     text: 'Bạn được xác định tiếp xúc ...',
      //     bigText: 'Bạn được xác định tiếp xúc ...',
      //     timestamp: 1588517528002,
      //     _group: 'info',
      //     unRead: 'false',
      //   },
      //   {
      //     largeIcon: 'boyte',
      //     title: 'Bộ Y tế',
      //     text: 'Cách ly thêm 1 tuần đối với Hà...',
      //     bigText: 'Cách ly thêm 1 tuần đối với Hà...',
      //     timestamp: 1588517528002,
      //     _group: 'info',
      //     unRead: 'false',
      //   },
      //   {
      //     largeIcon: 'bluezone',
      //     title: 'Bluezone',
      //     text: 'Bạn được xác định là F0',
      //     bigText: 'Bạn được xác định là F0',
      //     timestamp: 1588517528002,
      //     _group: 'info',
      //     unRead: 'false',
      //   },
      // ],
      notifications,
      callback: {
        onPress: this.onPressNotification,
      },
    };

    return (
      <SafeAreaView style={styles.container}>
        {header ? (
          <Header
            onBack={this.onBack}
            colorIcon={'#015cd0'}
            styleTitle={styles.textHeader}
            showBack
            title={'Thông báo'}
          />
        ) : (
          <View>
            <TouchableOpacity onPress={this.initData} style={styles.header}>
              <MediumText style={styles.textHeader}>Thông báo</MediumText>
            </TouchableOpacity>
            <View style={styles.wrapper}>
              <NotifySection
                title={'Cảnh báo'}
                data={dataWar}
                styleTitle={styles.titleWar}
                styleTextTitle={styles.textTitleWar}
              />
              <NotifySection
                title={'Thông báo'}
                data={dataNtf}
                styleTitle={styles.titleNtf}
                styleTextTitle={styles.textTitleNtf}
                onGet={this.onGetDataFromDB}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default NotifyScreen;
