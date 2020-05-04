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

// Components
import {ScrollView, TouchableOpacity, View, VirtualizedList} from 'react-native';
import FastImage from 'react-native-fast-image';
import Text from '../../../base/components/Text';
import {MediumText} from '../../../base/components/Text';

// Styles
import styles from './styles/index.css';

class NotifySession extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
  }

  getTime = (time) => {
    const toDay = moment().startOf('day');
    const startOfToday = toDay.valueOf();
    const prevToday = toDay.subtract(1, 'days').valueOf();
    const nextToday = toDay.add(1, 'days').valueOf();
    if(prevToday <= time && time < startOfToday) {
      return 'Hôm qua';
    }else if(startOfToday <= time && time < nextToday) {
      return moment(time).format("HH:mm");
    }
    return moment(item.timestamp).format("DD/MM/YYYY");
  };

  renderItem = ({item}) => {
      const {data} = this.props;
    const _callback = () => {
      data.callback.onPress(item);
    };
    const textTime = this.getTime(item.timestamp);
    return (
      <TouchableOpacity onPress={_callback} style={[styles.NotifyContainer]}>
        <View style={styles.notifyWrapper}>
          <FastImage
            source={require('./styles/images/boyte.png')}
            style={styles.avatar}
          />
          <View style={styles.content}>
            <MediumText numberOfLines={1} style={styles.titleText}>
              {item.title}
            </MediumText>
            {item.unRead === 'true' ? (
              <MediumText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.desTextUnread}>
                {item.text}
              </MediumText>
            ) : (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.desText}>
                {item.text}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.timer}>
          <Text style={item.unRead ? styles.textTimerUnread : styles.textTimer}>
            {textTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

    keyExtractor = item => item;

    getItemCount = data => (data ? data.length : 0);

    getItem = (data, index) => data[index];

    handleOnScroll = event => {
        debugger;
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

export default NotifySession;
