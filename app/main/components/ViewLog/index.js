/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/1/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import * as PropTypes from 'prop-types';

// Components
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

import Text from '../../../base/components/Text';

import log from '../../../core/log';

import Header from '../../../base/components/Header';
import styles from './styles/index.css';

class ViewLogScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLog: [],
      dataString: '',
    };
    this.lastTimestamp = 0;
    this.processGetDB = false;
    this.timeRequestLast = 0;
  }

  componentDidMount() {
    this.onGet();
  }

  onGet = timestampGet => {
    const {dataLog} = this.state;
    log.get(
      timestampGet,
      dataGet => {
        const n = dataLog.concat(dataGet);
        const s = n.map(({timestamp, key, data}) => {
          return `${this.formatDate(timestamp)}: ${key}${
            data ? `\n${data}` : ''
          }\n------------------------------------------------------------------`;
        });
        this.setState({
          dataString: s.join('\n'),
          dataLog: n,
        });
        this.processGetDB = false;
      },
      () => {
        this.processGetDB = false;
      },
    );
  };

  handleOnScroll = event => {
    const {dataLog} = this.state;
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const currentOffset = contentOffset.y;
    const isScrollDown = currentOffset > this.offset;
    this.offset = currentOffset;
    const timeNow = new Date().getTime();
    if (
      this.processGetDB ||
      !isScrollDown ||
      timeNow < this.timeRequestLast + 200
    ) {
      return;
    }
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      this.lastTimestamp = dataLog[dataLog.length - 1].timestamp;
      this.processGetDB = true;
      this.timeRequestLast = timeNow;
      this.onGet(this.lastTimestamp);
    }
  };

  formatDate = m => {
    if (!m) {
      return 'Not time';
    }
    const n = new Date(m);
    return (
      n.getUTCFullYear() +
      '/' +
      (n.getUTCMonth() + 1) +
      '/' +
      n.getUTCDate() +
      ' ' +
      n.getHours() +
      ':' +
      n.getMinutes() +
      ':' +
      n.getSeconds()
    );
  };

  copyLog = () => {
    Clipboard.setString(JSON.stringify(this.state.data));
  };

  render() {
    const {dataString} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          styleTitle={styles.titleHeader}
          styleHeader={styles.header}
          title={'View Log'}
        />
        <ScrollView onScroll={this.handleOnScroll}>
          <TouchableOpacity onPress={this.copyLog}>
            <Text>COPY</Text>
          </TouchableOpacity>
          <Text style={{color: '#000000'}}>{dataString}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

ViewLogScreen.propTypes = {
  intl: intlShape.isRequired,
};

ViewLogScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(ViewLogScreen);
