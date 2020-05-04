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

// Components
import {ScrollView, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Text from '../../../base/components/Text';
import {MediumText} from '../../../base/components/Text';

// Styles
import styles from './styles/index.css';

class NotifySession extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItemNotify = (item, callback) => {
    const _callback = () => {
      callback.onPress(item);
    };
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
            {item.unRead ? (
              <MediumText numberOfLines={1} style={styles.desTextUnread}>
                {item.description}
              </MediumText>
            ) : (
              <Text numberOfLines={1} style={styles.desText}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.timer}>
          <MediumText numberOfLines={1} style={styles.titleText} />
          <Text style={item.unRead ? styles.textTimerUnread : styles.textTimer}>
            {item.timer}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <ScrollView>
        {data.items.map(item => {
          return this.renderItemNotify(item, data.callback);
        })}
      </ScrollView>
    );
  }
}

export default NotifySession;
