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
import {injectIntl, intlShape} from 'react-intl';
import * as PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

// Components
import {View, TouchableOpacity} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import FormInput from '../Declaration/Form';

// Language
import message from '../../../msg/warning';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../utils/fontSize';

class NotifyInfected extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
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
                fontSize: fontSize.large,
                lineHeight: 29,
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              {formatMessage(message.dangerContent)}
            </MediumText>
          </View>
        </View>
        <FormInput onPress={this.onPress} />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: fontSize.small, color: '#2b77d8'}}>
            {formatMessage(message.contact)}
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
                {formatMessage(message.declaration)}
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
                {formatMessage(message.call)}
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
                {formatMessage(message.message)}
              </MediumText>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: fontSize.small,
              color: '#2b77d8',
              textDecorationLine: 'underline',
            }}>
            {formatMessage(message.information)}
          </Text>
        </View>
      </View>
    );
  }
}

NotifyInfected.propTypes = {
  intl: intlShape.isRequired,
};

NotifyInfected.defaultProps = {};

NotifyInfected.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(NotifyInfected);
