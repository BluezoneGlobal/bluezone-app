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
import {Dimensions} from 'react-native';

// Components
import {View} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Language
import message from '../../../core/msg/warning';

// Styles
import styles from './styles/index.css';
import FastImage from 'react-native-fast-image';
import * as fontSize from '../../../core/fontSize';

class NotifyDoubt extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onSendPhoneNumberPress && this.props.onSendPhoneNumberPress();
  };

  render() {
    const {intl, statusUpload, notifyObj} = this.props;
    const {formatMessage} = intl;
    const {language} = this.context;

    const bigText =
      (language === 'vi' ? notifyObj.bigText : notifyObj.bigTextEn) ||
      formatMessage(message.doubtTutorial);
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
              backgroundColor: '#fef3de',
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
              source={require('./styles/images/waring.png')}
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
                {formatMessage(message.doubtContent1)}
              </MediumText>
            </View>
          </View>
          <Text
            style={{
              fontSize: fontSize.normal,
              lineHeight: 25,
              marginTop: 0.026 * height,
            }}>
            {bigText}
          </Text>
        </View>
        <View style={{alignItems: 'center', marginBottom: (0.126 * height)}}>
          <ButtonIconText
            onPress={this.onPress}
            text={
              statusUpload === 'waiting'
                ? formatMessage(message.waitingUploadText)
                : formatMessage(message.sendHistory)
            }
            source={require('./styles/images/send.png')}
            styleBtn={styles.buttonSend}
            styleText={{fontSize: fontSize.normal}}
            styleIcon={styles.buttonIcon}
          />
          <Text style={{fontSize: fontSize.fontSize14, color: '#ff0000', marginTop: 26, lineHeight: 25}}>
            {formatMessage(message.uploadMsg)}
          </Text>
        </View>
      </View>
    );
  }
}

NotifyDoubt.propTypes = {
  intl: intlShape.isRequired,
};

NotifyDoubt.defaultProps = {};

NotifyDoubt.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(NotifyDoubt);
