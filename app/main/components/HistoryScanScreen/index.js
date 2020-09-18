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

import React from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
  Picker,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work

// Components
import Modal from 'react-native-modal';
import Header from '../../../base/components/Header';
import Text, {MediumText} from '../../../base/components/Text';
import CountBlueZoner from '../../../base/components/CountBlueZoner';
import ButtonIconText from '../../../base/components/ButtonIconText';
import {setHistoryDays} from '../../../core/storage';
import Service from '../../../core/apis/service';

// Language
import message from '../../../core/msg/history';
import warning from '../../../core/msg/warning';
import {injectIntl, intlShape} from 'react-intl';

// Config
import configuration from '../../../configuration';

// Sqlite db
import {open} from '../../../core/db/SqliteDb';

// Style
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import {getHistoryDays} from '../../../core/storage';

const ONE_DAY = 86400000;

class HistoryScanScreen extends React.Component {
  constructor(props) {
    super(props);
    const startOfToday = moment()
      .startOf('day')
      .valueOf();
    this.state = {
      listUser: [],
      total: 0,
      totalBluezoner: 0,
      nearTotalBluezoner: 0,
      nearTotal: 0,
      day: [startOfToday],
      daySelected: startOfToday,
      showDay: false,
      showHour: false,
      fontScale: null,
    };
    this.isGetting = 0;
    this.days = [];
    this.db = null;
  }

  get30DayBefore = () => {
    const startDate = moment().startOf('day');
    const listDays = [startDate.valueOf()];
    for (let i = 1; i < 30; i++) {
      listDays.push(startDate.subtract(1, 'days').valueOf());
    }
    return listDays;
  };

  async componentDidMount() {
    this.initData();
    // Picker
    let fontScale;
    try {
      fontScale = await Service.getFontScale();
      this.setState({
        fontScale,
      });
    } catch (e) {
      fontScale = 1;
    }
    this.setState({
      fontScale,
    });
  }

  componentWillUnmount() {
    setHistoryDays(this.days);
    this.db = null;
  }

  initData = async () => {
    const daysTemp = await getHistoryDays();
    this.days = daysTemp || [];

    this.getDays(days => {
      const startOfToday = moment()
        .startOf('day')
        .valueOf();
      this.days = [...days, ...this.days];
      this.days = this.days.length === 0 ? [startOfToday] : this.days;
      // Loai tru duplicate
      this.days = this.days.filter(
        (item, index) => this.days.indexOf(item) === index,
      );
      // Sort ngay lon nhat len dau
      this.days.sort((a, b) => b - a);
      const daySelected = this.days[0];
      this.setState({day: this.days, daySelected});
      const endOfDaySelected = daySelected + ONE_DAY - 1;
      this.onGetDataFromDB(daySelected, endOfDaySelected);
    });
  };

  getDays = async callback => {
    const SQL_QUERY = `SELECT DISTINCT DATE(timestamp/1000, 'unixepoch', 'localtime') AS dayonly FROM trace_info WHERE timestamp >= ${
      this.days.length > 0 ? this.days[0] + ONE_DAY : 0
    }`;
    this.db = open();
    this.db.transaction(tx => {
      tx.executeSql(
        SQL_QUERY,
        [],
        async (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(moment(results.rows.item(i).dayonly).valueOf());
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

  onSetDay = item => {
    this.setState({daySelected: item});
    if (Platform.OS === 'android') {
      const endOfDaySelected = item + ONE_DAY - 1;
      this.onGetDataFromDB(item, endOfDaySelected);
    }
  };

  onGetDataFromDB = (timeStart, timeEnd) => {
    if (this.isGetting > 0) {
      return;
    }
    this.isGetting = 4;
    const {RssiThreshold} = configuration;
    const result = {};
    // Tong tiep xuc
    const SQL_QUERY1 = `SELECT COUNT(DISTINCT IFNULL(macid, '') || IFNULL(blid_contact, '')) as userCount FROM trace_info WHERE timestamp >= ${timeStart} AND timestamp <= ${timeEnd}`;
    // Tong tiep xuc gan
    const SQL_QUERY2 = `SELECT COUNT(DISTINCT IFNULL(macid, '') || IFNULL(blid_contact, '')) as userCount FROM trace_info WHERE rssi > ${RssiThreshold} AND timestamp >= ${timeStart} AND timestamp <= ${timeEnd}`;
    // Tong bluezoner
    const SQL_QUERY3 = `SELECT COUNT(DISTINCT blid_contact) as userCount FROM trace_info WHERE blid_contact NOT NULL AND timestamp >= ${timeStart} AND timestamp <= ${timeEnd}`;
    // Tong bluzoner gan
    const SQL_QUERY4 = `SELECT COUNT(DISTINCT blid_contact) as userCount FROM trace_info WHERE blid_contact NOT NULL AND rssi > ${RssiThreshold} AND timestamp >= ${timeStart} AND timestamp <= ${timeEnd}`;
    this.db = open();
    this.db.transaction(tx => {
      tx.executeSql(
        SQL_QUERY1,
        [],
        (txTemp, results) => {
          Object.assign(result, {
            total: results.rows.item(0).userCount.toString(),
          });
          this.setStateAtLast(result, --this.isGetting);
        },
        (error, a) => {
          this.setStateAtLast(result, --this.isGetting);
        },
      );
      tx.executeSql(
        SQL_QUERY2,
        [],
        (txTemp, results) => {
          Object.assign(result, {
            nearTotal: results.rows.item(0).userCount.toString(),
          });
          this.setStateAtLast(result, --this.isGetting);
        },
        (error, a) => {
          this.setStateAtLast(result, --this.isGetting);
        },
      );
      tx.executeSql(
        SQL_QUERY3,
        [],
        (txTemp, results) => {
          Object.assign(result, {
            totalBluezoner: results.rows.item(0).userCount.toString(),
          });
          this.setStateAtLast(result, --this.isGetting);
        },
        (error, a) => {
          this.setStateAtLast(result, --this.isGetting);
        },
      );
      tx.executeSql(
        SQL_QUERY4,
        [],
        (txTemp, results) => {
          Object.assign(result, {
            nearTotalBluezoner: results.rows.item(0).userCount.toString(),
          });
          this.setStateAtLast(result, --this.isGetting);
        },
        (error, a) => {
          this.setStateAtLast(result, --this.isGetting);
        },
      );
    });
  };

  setStateAtLast = (result, count) => {
    if (count === 0) {
      this.setState(result);
    }
  };

  onShowModalDay = () => {
    this.setState({showDay: true});
  };

  onHideDay = () => {
    this.setState({showDay: false});
    const endOfDaySelected = this.state.daySelected + ONE_DAY - 1;
    this.onGetDataFromDB(this.state.daySelected, endOfDaySelected);
  };

  onSendHistory = () => {
    this.props.navigation.navigate('HistoryUploadedByOTP');
  };

  render() {
    const {intl} = this.props;
    const {
      day,
      nearTotalBluezoner,
      totalBluezoner,
      daySelected,
      total,
      nearTotal,
      fontScale,
      showDay,
    } = this.state;
    const listDay = day.map(item => (
      <Picker.Item
        key={moment(item).format('DD/MM/YYYY')}
        label={moment(item).format('DD/MM/YYYY')}
        value={item}
      />
    ));

    const {formatMessage} = intl;

    return (
      <SafeAreaView style={styles.warper}>
        <Header
          styleTitle={styles.titleHeader}
          title={formatMessage(message.header)}
          styleHeader={styles.header}
        />
        <View style={styles.flex}>
          <View style={styles.flex}>
            <View style={styles.content}>
              <MediumText style={styles.title}>
                {formatMessage(message.totalContact)}
              </MediumText>
              <View style={styles.contentChild}>
                <CountBlueZoner countBlueZone={totalBluezoner} />
              </View>
            </View>
            <View style={styles.content}>
              <MediumText style={styles.title}>
                {formatMessage(message.closeContact)}
              </MediumText>
              <View style={styles.contentChild}>
                <CountBlueZoner
                  countBlueZone={nearTotalBluezoner}
                  backgroundColor={'rgb(11,147,35)'}
                />
              </View>
            </View>
          </View>
          <View style={styles.datePickerL}>
            <View style={styles.datePicker1}>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={styles.datePickerO}
                  onPress={this.onShowModalDay}>
                  <Text style={styles.datePickerT}>
                    {moment(daySelected).format('DD/MM/YYYY')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.datePicker}>
                  {fontScale && (
                    <Picker
                      selectedValue={daySelected}
                      style={[
                        styles.pickerAndroid,
                        {
                          width: this.state.fontScale * 83.33 + 66.67,
                        },
                      ]}
                      onValueChange={this.onSetDay}>
                      {listDay}
                    </Picker>
                  )}
                </View>
              )}

              <ButtonIconText
                onPress={this.onSendHistory}
                text={formatMessage(warning.uploadText)}
                source={require('../NotifyWarning/styles/images/send.png')}
                styleBtn={styles.buttonSend}
                styleText={{fontSize: fontSize.normal}}
                styleIcon={styles.buttonIcon}
              />
            </View>
          </View>
        </View>

        {Platform.OS === 'ios' && (
          <Modal isVisible={showDay} style={styles.pickerIOS}>
            <View style={styles.pickerIOSContainer}>
              <TouchableOpacity
                style={styles.buttonOK}
                onPress={this.onHideDay}>
                <Text style={styles.titleButtonOK}>Xong</Text>
              </TouchableOpacity>
              <Picker
                selectedValue={daySelected}
                style={styles.pickerDay}
                onValueChange={this.onSetDay}>
                {listDay}
              </Picker>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    );
  }
}

HistoryScanScreen.propTypes = {
  intl: intlShape.isRequired,
};

HistoryScanScreen.defaultProps = {};

export default injectIntl(HistoryScanScreen);
