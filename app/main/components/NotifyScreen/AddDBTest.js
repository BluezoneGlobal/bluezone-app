/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author congtm@bkav.com on 11/04/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import {
    View,
    Button,
    Alert,
    Text,
    VirtualizedList,
    Animated,
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = 'Test.db';
const database_version = '1.0';
const database_displayname = 'SQLite Test Database';
const database_size = 20000000;
let db;

class TestSQL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUser: [],
        };
        this.index = 0;
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );
        db.transaction(function(txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_CPMS'",
                [],
                function(tx, res) {
                    txn.executeSql('DROP TABLE IF EXISTS table_CPMS', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS table_CPMS(id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp REAL, userid TEXT, macid TEXT, rssi TEXT)',
                        [],
                    );
                },
            );
        });
    }

    onWrite = () => {
        db.transaction(function(tx) {
            for (let i = 0; i < 30000; ++i) {
                tx.executeSql(
                    'INSERT INTO table_CPMS (timestamp, userid, macid, rssi) VALUES (?,?,?,?)',
                    [
                        new Date().getTime(),
                        `0000OE${i}`,
                        'D4:D2:E5:E2:2C:0D',
                        'fFN0WezbQs-KIj9qE1CTZ8',
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

    onPress = () => {
        this.onWrite();
    };

    onGetDataFromDB = index => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM table_CPMS WHERE ID > ${index * 30}  LIMIT 30`,
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    this.setState(prev => ({
                        listUser: prev.listUser.concat(temp),
                    }));
                },
            );
        });
    };

    keyExtractor = item => item;

    getItemCount = data => (data ? data.length : 0);

    getItem = (data, index) => data[index];

    handleOnScroll = event => {
        const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
        if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100
        ) {
            this.index = this.index + 1;
            this.onGetDataFromDB(this.index);
        }
    };
    onPressGetData = () => {
        this.onGetDataFromDB(this.index);
    };
    renderItem = ({item}) => {
        return (
            <View style={{flexDirection: 'row'}}>
                <Text>Id: {item.id}</Text>
                <Text>User: {item.timestamp}</Text>
                <Text>userid: {item.userid}</Text>
                <Text>macid: {item.macid}</Text>
                <Text>rssi: {item.rssi}</Text>
            </View>
        );
    };

    render() {
        const {listUser} = this.state;
        return (
            <View style={{flex: 1}}>
                <Button title={'Create DB'} onPress={this.onPress} />
                <Button title={'TestDB'} onPress={this.onPressGetData} />
                <Button title={'abc'} />
                <Button title={'abc'} />
                <Button title={'abc'} />
                <VirtualizedList
                    onScroll={this.handleOnScroll}
                    data={listUser}
                    initialNumToRender={4}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    getItemCount={this.getItemCount}
                    getItem={this.getItem}
                />
            </View>
        );
    }
}

export default TestSQL;
