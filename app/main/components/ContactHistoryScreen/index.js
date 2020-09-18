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
import {SafeAreaView, View, ScrollView, FlatList} from 'react-native';
import 'moment/locale/vi';
import {injectIntl, intlShape} from 'react-intl';

// Components
import Header from '../../../base/components/Header';
import Text, {MediumText} from '../../../base/components/Text';

// Language
import message from '../../../core/msg/contacthistory';

// Sqlite db
import {getCountBluezoneByDays} from '../../../core/db/SqliteDb';
import configuration from '../../../configuration';

// Style
import styles from './styles/index.css';

const CURRENT_TIME = new Date().setHours(0, 0, 0, 0);
const NUMBER_DAY = 60;
const TIME_ONE_DAY = 24 * 60 * 60 * 1000;
const BEFORE_TIME = CURRENT_TIME - TIME_ONE_DAY * NUMBER_DAY;

class ContactHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.getDataByDaysSuccess = this.getDataByDaysSuccess.bind(this);
    this.getDataByDaysFail = this.getDataByDaysFail.bind(this);
    this.convertDate = this.convertDate.bind(this);
    this.getData = this.getData.bind(this);
    this.onChangeFAQ = this.onChangeFAQ.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    getCountBluezoneByDays(
      BEFORE_TIME,
      this.getDataByDaysSuccess,
      this.getDataByDaysFail,
    );
  }

  getDataByDaysSuccess(results) {
    const data = this.getData(results);
    this.setState({
      data: data,
    });
  }

  convertDate(time) {
    const date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${day}/${month}/${year}`;
  }

  getData(arr = []) {
    let arrayData = [];
    for (let i = 60; i <= NUMBER_DAY && i > 0; i--) {
      const timeDate = BEFORE_TIME + i * TIME_ONE_DAY;
      const localeDate = this.convertDate(timeDate);

      const result = arr.filter(item => item.dateStr === localeDate);
      if (result.length > 0) {
        arrayData.push(result[0]);
      } else {
        arrayData.push({numberContact: '0', dateStr: localeDate});
      }
    }
    return arrayData;
  }

  getDataByDaysFail(error) {
    const data = this.getData();
    this.setState({
      data: data,
    });
  }

  onChangeFAQ() {
    const {TurnContact, Language} = configuration;
    const params = TurnContact[Language];
    this.props.navigation.navigate('FAQScreen', {
      idFAQSelected: params.id,
      indexFAQSelected: params.index,
    });
  }

  setRef(ref) {
    this.flatListRef = ref;
  }

  renderItem({item}) {
    return (
      <View style={styles.item}>
        <Text style={styles.date} text={item.dateStr} />
        <MediumText style={styles.numberContact} text={item.numberContact} />
      </View>
    );
  }

  render() {
    const {intl} = this.props;
    const {data} = this.state;
    const {formatMessage} = intl;

    return (
      <SafeAreaView style={styles.warper}>
        <Header
          styleTitle={styles.titleHeader}
          title={formatMessage(message.header)}
          styleHeader={styles.header}
        />
        <View style={styles.contact}>
          <Text
            text={formatMessage(message.contact)}
            style={styles.textContact}
            onPress={this.onChangeFAQ}
          />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.detailHeader}>
            <MediumText
              style={styles.textHeader}
              text={formatMessage(message.date)}
            />
            <MediumText
              style={styles.textHeader}
              text={formatMessage(message.textContact)}
            />
          </View>
          <FlatList
            style={{flex: 1}}
            ref={this.setRef}
            data={data}
            keyExtractor={item => item.dateStr}
            renderItem={this.renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

ContactHistoryScreen.propTypes = {
  intl: intlShape.isRequired,
};

ContactHistoryScreen.defaultProps = {};

export default injectIntl(ContactHistoryScreen);
