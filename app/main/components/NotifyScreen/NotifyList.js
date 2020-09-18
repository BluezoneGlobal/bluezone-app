/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 10:11
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
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import {injectIntl, intlShape} from 'react-intl';

// Components
import {TouchableOpacity, View, VirtualizedList} from 'react-native';
import FastImage from 'react-native-fast-image';
import Text from '../../../base/components/Text';
import {MediumText} from '../../../base/components/Text';

import {NOTIFICATION_TYPE} from '../../../const/notification';

// Styles
import styles from './styles/index.css';
import configuration from '../../../configuration';
import message from '../../../core/msg/notify';

class NotifySession extends React.Component {
  constructor(props) {
    super(props);
    this.lastTimestamp = 0;
    this.processGetDB = false;
    this.offset = 0;
    this.timeRequestLast = 0;
  }

  getTime = time => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const toDay = moment().startOf('day');
    const startOfToday = toDay.valueOf();
    const prevToday = toDay.subtract(1, 'days').valueOf();
    const nextToday = toDay.add(1, 'days').valueOf();
    if (prevToday <= time && time < startOfToday) {
      return formatMessage(message.yesterday);
    } else if (startOfToday <= time && time < nextToday) {
      return moment(time).format('HH:mm');
    }
    return moment(time).format('DD/MM');
  };

  renderItem = ({item}) => {
    const {data} = this.props;
    const _callback = () => {
      data.callback.onPress(item);
    };
    const uri =
      item.largeIcon && item.largeIcon.length > 0
        ? {uri: item.largeIcon}
        : require('./styles/images/corona.png');
    const textTime = this.getTime(item.timestamp);
    const {Language} = configuration;

    const title =
      (Language === 'vi' ? item.title : item.titleEn) ||
      item.title ||
      item.titleEn;
    const text =
      (Language === 'vi' ? item.text : item.textEn) || item.text || item.textEn;
    const TextDisplay = !item.unRead ? MediumText : Text;

    const isTypeNotifyNew =
      item._group === NOTIFICATION_TYPE.SEND_URL_NEW ||
      item._group === NOTIFICATION_TYPE.SEND_HTML_NEWS;

    return (
      <TouchableOpacity onPress={_callback} style={styles.NotifyContainer}>
        <View style={styles.notifyWrapper}>
          <View style={styles.backgroundAvatar}>
            <FastImage source={uri} style={styles.avatar} />
          </View>
          <View style={styles.content}>
            <TextDisplay
              numberOfLines={isTypeNotifyNew ? 2 : 1}
              style={[
                !item.unRead ? styles.titleTextUnread : styles.titleText,
                isTypeNotifyNew && {marginRight: 40},
              ]}>
              {isTypeNotifyNew ? text : title}
            </TextDisplay>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <TextDisplay
                numberOfLines={isTypeNotifyNew ? 1 : 2}
                style={[
                  {flex: 1, marginRight: 18},
                  !item.unRead ? styles.desTextUnread : styles.desText,
                  isTypeNotifyNew && {color: '#015cd0'},
                ]}>
                {isTypeNotifyNew ? title : text}
              </TextDisplay>
              <TextDisplay
                style={[
                  !item.unRead ? styles.textTimerUnread : styles.textTimer,
                ]}>
                {textTime}
              </TextDisplay>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  keyExtractor = item => item.notifyId;

  getItemCount = data => (data ? data.length : 0);

  getItem = (data, index) => data[index];

  handleOnScroll = event => {
    const {onGet, data} = this.props;
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
      this.lastTimestamp = data.items[data.items.length - 1].timestamp - 1;
      this.processGetDB = true;
      this.timeRequestLast = timeNow;
      onGet(this.lastTimestamp, this.callback);
    }
  };

  callback = () => {
    this.processGetDB = false;
  };

  render() {
    const {data} = this.props;
    return (
      <VirtualizedList
        onScroll={this.handleOnScroll}
        data={data.items}
        initialNumToRender={4}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        getItemCount={this.getItemCount}
        getItem={this.getItem}
      />
    );
  }
}

NotifySession.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifySession);
