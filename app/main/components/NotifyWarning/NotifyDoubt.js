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
import {View} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Language
import message from '../../../msg/warning';

// Styles
import styles from './styles/index.css';
import FastImage from 'react-native-fast-image';
import * as fontSize from '../../../utils/fontSize';

class NotifyDoubt extends React.Component {
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
            source={require('./styles/images/waring.png')}
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
              {formatMessage(message.doubtContent1)}
            </MediumText>
            <MediumText
              style={{
                fontSize: fontSize.large,
                lineHeight: 29,
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              {formatMessage(message.doubtContent2)}
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
              textAlign: 'center',
              paddingHorizontal: 21,
            }}>
            {formatMessage(message.doubtTutorial)}
          </Text>
          <View />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: fontSize.small, color: '#ff0000'}}>
            {formatMessage(message.uploadMsg)}
          </Text>
          <ButtonIconText
            onPress={this.onPress}
            text={formatMessage(message.uploadText)}
            source={require('./styles/images/send.png')}
            styleBtn={styles.buttonSend}
            styleText={{fontSize: fontSize.normal}}
            styleIcon={styles.buttonIcon}
          />
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
