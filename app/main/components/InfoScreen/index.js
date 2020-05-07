/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
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

// Components
import {SafeAreaView, StatusBar, View, Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';

import Text, {MediumText} from '../../../base/components/Text';

// Styles
import styles from './styles/index.css';
import {injectIntl, intlShape} from 'react-intl';
import message from '../../../msg/info';

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: DeviceInfo.getVersion(),
    };
  }

  render() {
    const {version} = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={{flex: 1}}>
          <View style={styles.containerLogo}>
            <FastImage
              source={require('./styles/images/icon_bluezone.png')}
              style={styles.iconLogo}
            />
          </View>
          <View style={styles.body}>
            <MediumText style={styles.title}>
              {formatMessage(message.title)} {version}
            </MediumText>
            <Text style={styles.date}>
              {formatMessage(message.dateRelease)} 05/5/2020.
            </Text>
            <Text />
            <Text style={styles.description}>
              {formatMessage(message.description)}
            </Text>
            <Text />
            <View style={styles.textBottom}>
              <Text style={styles.textContact}>
                {formatMessage(message.detail)}
              </Text>
              <Text
                style={styles.linkweb}
                onPress={() => Linking.openURL('www.bluezone.gov.vn')}>
                {formatMessage(message.linkDetail)}
              </Text>
              <Text />
              <Text style={styles.textContact}>
                {formatMessage(message.infoDetail)}
              </Text>
              <Text
                style={styles.linkweb}
                onPress={() =>
                  Linking.openURL('mailto:lienhe@bluezone.gov.vn')
                }>
                {formatMessage(message.email)}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

InfoScreen.propTypes = {
  intl: intlShape.isRequired,
};

InfoScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(InfoScreen);
