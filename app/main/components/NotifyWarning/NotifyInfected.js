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
import {TextInput, View, TouchableOpacity} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
import FastImage from 'react-native-fast-image';
import * as fontSize from '../../../utils/fontSize';
import FormInput from '../Declaration/Form';

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
            source={require('./styles/images/infected.png')}
          />
          <View
            style={{
              alignItems: 'center',
              marginTop: 18,
            }}>
            <MediumText
              style={{
                fontSize: fontSize.larger,
                lineHeight: 29,
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              Bạn có tiếp xúc với F0
            </MediumText>
          </View>
        </View>
        <FormInput />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: fontSize.small, color: '#2b77d8'}}>
            Hoặc liên lạc trực tiếp với chúng tôi
          </Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingVertical: 18,
            }}>
            <TouchableOpacity style={{alignItems: 'center', flex: 1}}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_add.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.small,
                  color: '#585858',
                  marginTop: 6,
                }}>
                Khai báo y tế
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_phone.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.small,
                  color: '#585858',
                  marginTop: 6,
                }}>
                Gọi điện
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center', flex: 1}}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_chat.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.small,
                  color: '#585858',
                  marginTop: 6,
                }}>
                Nhắn tin
              </MediumText>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: fontSize.small,
              color: '#2b77d8',
              textDecorationLine: 'underline',
            }}>
            Tìm hiểu thêm: những việc cần làm ngay
          </Text>
        </View>
      </View>
    );
  }
}

export default NotifyDoubt;
