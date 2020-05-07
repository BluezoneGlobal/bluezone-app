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

// Styles
import styles from './styles/index.css';
import configuration from '../../../Configuration';
import message from '../../../msg/notify';

class NotifySession extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
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

    return (
      <TouchableOpacity onPress={_callback} style={[styles.NotifyContainer]}>
        <View style={styles.notifyWrapper}>
          <FastImage source={uri} style={styles.avatar} />
          <View style={styles.content}>
            <MediumText numberOfLines={1} style={styles.titleText}>
              {Language === 'vi' ? item.title : item.titleEn}
            </MediumText>
            {item.unRead ? (
              <MediumText numberOfLines={1} style={styles.desTextUnread}>
                {Language === 'vi' ? item.text : item.textEn}
              </MediumText>
            ) : (
              <Text numberOfLines={1} style={styles.desText}>
                {Language === 'vi' ? item.text : item.textEn}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.timer}>
          <MediumText numberOfLines={1} style={styles.titleText} text={' '} />
          <Text style={item.unRead ? styles.textTimerUnread : styles.textTimer}>
            {textTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  keyExtractor = item => item.notifyId;

  getItemCount = data => (data ? data.length : 0);

  getItem = (data, index) => data[index];

  handleOnScroll = event => {
    const {onGet} = this.props;
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 100
    ) {
      this.index = this.index + 1;
      onGet(this.index);
    }
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
