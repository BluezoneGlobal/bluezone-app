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
import {View, TouchableOpacity, Linking, Dimensions} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import FormInput from '../Declaration/components/Form';

// Language
import message from '../../../core/msg/warning';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import configuration from '../../../configuration';
import warning from '../../../core/msg/warning';

class NotifyInfected extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress = (phone, name, address) => {
    this.props.onSendPhoneNumberPress && this.props.onSendPhoneNumberPress(phone, name, address);
  };

  handleOpenDeclare = () => {
    const SupportUrl = configuration.SupportUrl;
    if (!SupportUrl) {
      return;
    }

    Linking.canOpenURL(SupportUrl).then(supported => {
      if (supported) {
        Linking.openURL(SupportUrl);
        return false;
      }
    });
  };

  handleCall = () => {
    const SupportPhoneNumber = configuration.SupportPhoneNumber;
    if (!SupportPhoneNumber) {
      return;
    }

    Linking.canOpenURL(SupportPhoneNumber).then(supported => {
      if (supported) {
        Linking.openURL(`tel:${SupportPhoneNumber}`);
        return false;
      }
    });
  };

  handleMessage = () => {
    const SupportPhoneNumber = configuration.SupportPhoneNumber;
    if (!SupportPhoneNumber) {
      return;
    }

    Linking.canOpenURL(SupportPhoneNumber).then(supported => {
      if (supported) {
        Linking.openURL(`sms:${SupportPhoneNumber}`);
        return false;
      }
    });
  };

  handleInfo = () => {
    Linking.openURL('https://www.bluezone.gov.vn/');
  };

  render() {
    const {intl, statusInfo, notifyObj} = this.props;
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
              backgroundColor: 'rgba(255, 162, 0, 0.15)',
              borderRadius: 11,
              paddingHorizontal: 17,
              paddingVertical: 18,
              marginBottom: 0.026 * height,
            }}>
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
                paddingLeft: 15,
                flex: 1,
              }}>
              <MediumText
                style={{
                  fontSize: fontSize.fontSize16,
                  lineHeight: 22,
                }}>
                {formatMessage(message.dangerContent)}
              </MediumText>
            </View>
          </View>
          <FormInput
            statusInfo={statusInfo}
            notifyObj={notifyObj}
            onSubmit={this.onPress}
          />
        </View>
        <View style={{alignItems: 'center', marginBottom: 0.046 * height}}>
          <Text style={{fontSize: fontSize.small, color: '#2b77d8'}}>
            {formatMessage(message.contact)}
          </Text>
          <View
            style={{
              justifyContent: 'space-around',
              flexDirection: 'row',
              paddingVertical: 18,
            }}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingHorizontal: 20}}
              onPress={this.handleOpenDeclare}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_add.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.declaration)}
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignItems: 'center', marginHorizontal: 20}}
              onPress={this.handleCall}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_phone.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.call)}
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignItems: 'center', marginHorizontal: 20}}
              onPress={this.handleMessage}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_chat.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.message)}
              </MediumText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.handleInfo}>
            <Text
              style={{
                fontSize: fontSize.smallest,
                color: '#2b77d8',
                textDecorationLine: 'underline',
              }}>
              {formatMessage(message.information)}
            </Text>
          </TouchableOpacity>
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
