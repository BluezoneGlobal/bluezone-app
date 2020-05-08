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
import {View, SafeAreaView, StatusBar, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import Text, {MediumText} from '../../../base/components/Text';

// Language
import message from '../../../msg/auth';

// Apis
import configuration, {
  getConfigurationAPI,
  getConfigurationAsync,
  registerUser,
} from '../../../Configuration';

// Styles
import styles from './styles/index.css';
import {getTokenFirebase} from '../../../CloudMessaging';
import IconBluezone from './styles/images/IconBluezone';
import {LOGO_HEIGHT} from './styles/index.css';
import {blue_bluezone} from '../../../utils/color';

const TIMEOUT = 3000;

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStatusF: false,
      isFirstLoading: false,
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.registerFirebase = this.registerFirebase.bind(this);
    this.registerUserSuccess = this.registerUserSuccess.bind(this);
    this.registerUserError = this.registerUserError.bind(this);
  }

  async componentDidMount() {
    // Check trạng thái lần đầu tiên vào app.
    this.checkAuth();

    // Get thông tin Config.
    await getConfigurationAsync();

    // Gọi Api get config lên server.
    await getConfigurationAPI(this.success, this.error);
  }

  async checkAuth() {
    const isFirstLoading = await AsyncStorage.getItem('isFirstLoading');
    if (isFirstLoading === null) {
      this.setState({isFirstLoading: true});
      AsyncStorage.setItem('isFirstLoading', 'true');
    } else {
      this.setState({isStatusF: true});
    }
  }

  success() {
    this.registerFirebase();
  }

  error() {
    this.registerFirebase();
  }

  registerFirebase() {
    const {TokenFirebase} = configuration;
    if (TokenFirebase === '') {
      getTokenFirebase(
        TokenFirebase => {
          registerUser(
            TokenFirebase,
            this.registerUserSuccess,
            this.registerUserError,
          );
        },
        () => {
          this.props.setLoading('Home');
        },
      );
    } else {
      setTimeout(() => {
        this.props.setLoading('Home');
      }, TIMEOUT);
    }
  }

  registerUserSuccess(data) {
    this.props.setLoading('RegisterAuth');
  }

  registerUserError() {
    this.props.setLoading('Home');
  }

  render() {
    const {isStatusF, isFirstLoading} = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <IconBluezone width={LOGO_HEIGHT} height={LOGO_HEIGHT} />
        <View style={styles.body}>
          {!isStatusF && !isFirstLoading ? (
            <ActivityIndicator size="large" color={blue_bluezone} />
          ) : isStatusF ? (
            <>
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
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color={blue_bluezone} />
              <Text
                text={'Đang khởi tạo cho lần sử dụng đầu tiên'}
                style={styles.text}
              />
            </>
          )}
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
