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
import {View, TextInput} from 'react-native';
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
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              Chúc mừng bạn! Bluezone đã kiểm tra xác nhận bạn không tiếp xúc
              với F0
            </MediumText>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text style={{fontSize: fontSize.small, lineHeight: 25}}>
            Đăng ký số điện thoại để được hỗ trợ tốt hơn
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: '#dddddd',
              borderWidth: 1,
              marginTop: 5,
              width: '100%',
              borderRadius: 3,
              paddingHorizontal: 12,
              fontFamily: 'OpenSans-Regular',
              fontSize: fontSize.small,
            }}
            // onChangeText={}
            placeholder={'Điện thoại'}
            placeholderTextColor={''}
            value={''}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: '#dddddd',
              borderWidth: 1,
              marginTop: 13,
              width: '100%',
              borderRadius: 3,
              paddingHorizontal: 12,
              fontFamily: 'OpenSans-Regular',
              fontSize: fontSize.small,
            }}
            // onChangeText={}
            placeholder={'Họ tên'}
            placeholderTextColor={''}
            value={''}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <ButtonIconText
            onPress={this.watchSend}
            text={'Tiếp tục'}
            styleBtn={styles.buttonSend}
            styleText={{fontSize: fontSize.normal}}
            styleIcon={styles.buttonIcon}
          />
        </View>
      </View>
    );
  }
}

export default NotifyDoubt;
