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
import * as PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

// Components
import {View, TextInput, Dimensions} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Language
import message from '../../../core/msg/warning';

// Styles
import styles from './styles/index.css';
import FastImage from 'react-native-fast-image';
import * as fontSize from '../../../core/fontSize';

class NotifySafe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }

  onPress = () => {
    this.props.onSendPhoneNumberPress && this.props.onSendPhoneNumberPress(this.state.phone);
  };

  onChangePhone = phone => {
    this.setState({phone});
  };

  render() {
    const {intl} = this.props;
    const {phone} = this.state;
    const {formatMessage} = intl;
    const {height} = Dimensions.get('window');
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 0.036 * height,
        }}>
        <View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgba(17, 154, 1, 0.15)',
              borderRadius: 11,
              paddingHorizontal: 17,
              paddingVertical: 18,
            }}>
            <FastImage
              style={{
                width: 58,
                height: 59,
                backgroundColor: '#fff',
                borderRadius: 29,
              }}
              source={require('./styles/images/safe.png')}
            />
            <View
              style={{
                alignItems: 'center',
                paddingLeft: 15,
                flex: 1,
              }}>
              <MediumText
                style={{
                  fontSize: fontSize.fontSize16,
                  lineHeight: 22,
                }}>
                {formatMessage(message.safeContent)}
              </MediumText>
            </View>
          </View>
          <View style={{marginTop: 0.026 * height}}>
            <Text style={{fontSize: fontSize.normal, lineHeight: 25}}>
              {formatMessage(message.safeTutorial)}
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: '#dddddd',
                borderWidth: 1,
                marginTop: 15,
                width: '100%',
                borderRadius: 3,
                paddingHorizontal: 12,
                fontFamily: 'OpenSans-Regular',
                fontSize: fontSize.small,
                color: '#000000',
              }}
              onChangeText={this.onChangePhone}
              placeholder={formatMessage(message.phoneNumber)}
              placeholderTextColor={'#b5b5b5'}
              keyboardType={'numeric'}
              value={phone}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', marginBottom: 0.126 * height}}>
          <ButtonIconText
            onPress={this.onPress}
            text={formatMessage(message.send)}
            styleBtn={styles.buttonSend}
            styleText={{fontSize: fontSize.normal}}
            styleIcon={styles.buttonIcon}
          />
        </View>
      </View>
    );
  }
}

NotifySafe.propTypes = {
  intl: intlShape.isRequired,
};

NotifySafe.defaultProps = {};

NotifySafe.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(NotifySafe);
