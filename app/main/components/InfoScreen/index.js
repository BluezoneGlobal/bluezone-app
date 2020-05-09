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
import {SafeAreaView, StatusBar, View, Linking, TouchableOpacity} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Text, {MediumText} from '../../../base/components/Text';

// Styles
import styles, {LOGO_HEIGHT} from './styles/index.css';
import {injectIntl, intlShape} from 'react-intl';
import message from '../../../msg/info';

// Logo
import LogoBluezone from '../../../utils/logo/logo_bluezone';
import IconBYT from '../HomeScreen/styles/images/IconBYT';
import IconBTT from '../HomeScreen/styles/images/IconBTT';
import style from '../HomeScreen/styles/index.css';

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
            <IconBTT height={LOGO_HEIGHT} width={LOGO_HEIGHT} />
            <View style={styles.borderLogo} />
            <IconBYT height={LOGO_HEIGHT} width={LOGO_HEIGHT} />
          </View>
          <View style={styles.body}>
            <View />
            <View>
              <MediumText style={styles.title}>
                {formatMessage(message.title)} {version}
              </MediumText>
              <Text style={styles.date}>
                {formatMessage(message.dateRelease)} 10/05/2020.
              </Text>
            </View>
            <View style={styles.viewDep}>
              <Text style={styles.description}>
                {formatMessage(message.description)}
              </Text>
            </View>
            <View>
              <Text style={styles.textContact}>
                {formatMessage(message.detail)}
              </Text>
              <TouchableOpacity style={{flexDirection: 'column'}} onPress={() => Linking.openURL('https://www.bluezone.gov.vn')}>
                <Text style={styles.linkweb}>
                  {formatMessage(message.linkDetail)}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
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
            <View />
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
