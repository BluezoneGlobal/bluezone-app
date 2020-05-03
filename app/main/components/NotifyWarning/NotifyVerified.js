/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 19:28
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
import {View} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
import FastImage from 'react-native-fast-image';
import * as fontSize from '../../../utils/fontSize';

class NotifyDoubt extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        {/* Khối thông tin */}
        <View style={{alignItems: 'center'}}>
          <FastImage
            style={{
              width: 58,
              height: 59,
            }}
            source={require('./styles/images/safe.png')}
          />
          <View
            style={{
              alignItems: 'center',
              marginTop: 18,
            }}>
            <MediumText
              style={{
                fontSize: fontSize.large,
                lineHeight: 29,
                color: '#00000069',
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              Bạn CÓ THỂ đã tiếp xúc với F0 Trong lịch sử tiếp xúc của bạn có F0
            </MediumText>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 11,
            borderColor: '#ececec',
            paddingVertical: 15,
          }}>
          <Text
            style={{
              fontSize: fontSize.small,
              lineHeight: 29,
              color: '#00000069',
              textAlign: 'center',
              paddingHorizontal: 21,
            }}>
            Đừng lo lắng, có thể có sự trùng lặp ngẫu nhiên bạn hãy gửi lịch sử
            tiếp xúc của bạn để hệ thống xác minh
          </Text>
          <View />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: fontSize.small, color: '#2b77d8'}}>
            Đã xác minh bạn an toàn
          </Text>
          <ButtonIconText
            onPress={this.watchSend}
            text={'Gửi lịch sử tiếp xúc '}
            source={require('./styles/images/send.png')}
            styleBtn={styles.buttonSendActive}
            styleText={{fontSize: fontSize.normal}}
            styleIcon={styles.buttonIcon}
          />
        </View>
      </View>
    );
  }
}

export default NotifyDoubt;
