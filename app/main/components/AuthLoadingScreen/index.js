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
import {injectIntl, intlShape} from 'react-intl';

// Components
import {View, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import {MediumText} from '../../../base/components/Text';

// Language
import message from '../../../msg/auth';

// Apis
import configuration, {
  getConfigurationAPI,
  getConfigurationAsync,
} from '../../../Configuration';

// Styles
import styles from './styles/index.css';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.setNavigate = this.setNavigate.bind(this);
  }

  async componentDidMount() {
    await getConfigurationAsync();
    await getConfigurationAPI(this.success, this.error);
  }

  success() {
    setTimeout(() => {
      this.props.setLoading(this.setNavigate());
    }, 2000);
  }

  error() {
    setTimeout(() => {
      this.props.setLoading(this.setNavigate());
    }, 2000);
  }

  setNavigate() {
    const {Register_Phone, FirstOTP} = configuration;
    if (Register_Phone === 'FirstOTP' && FirstOTP === null) {
      AsyncStorage.setItem('FirstOTP', 'true');
      return 'Register';
    }

    return 'Home';
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <FastImage
          source={require('./styles/images/bluezone.png')}
          style={styles.logo}
        />
        <View style={styles.body}>
          <FastImage
            source={require('./styles/images/success.png')}
            style={styles.icon_success}
          />
          <MediumText
            text={formatMessage(message.label1)}
            style={styles.text}
          />
          <MediumText
            text={formatMessage(message.label2)}
            style={styles.text}
          />
        </View>
      </SafeAreaView>
    );
  }
}

AuthLoadingScreen.propTypes = {
  intl: intlShape.isRequired,
  setLoading: PropTypes.func,
};

export default injectIntl(AuthLoadingScreen);
