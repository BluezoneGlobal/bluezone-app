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
import PropTypes from 'prop-types';

// Components
import {View, SafeAreaView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {MediumText} from '../../../base/components/Text';

// Apis
import {
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
  }

  async componentDidMount() {
    await getConfigurationAsync();
    await getConfigurationAPI(this.success, this.error);
  }

  success() {
    this.props.setLoading();
  }

  error() {
    this.props.setLoading();
  }

  render() {
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
          <MediumText text={'Chưa phát hiện'} style={styles.text} />
          <MediumText text={'F0 nào tiếp xúc với bạn'} style={styles.text} />
        </View>
      </SafeAreaView>
    );
  }
}

AuthLoadingScreen.propTypes = {
  setLoading: PropTypes.func,
};

export default AuthLoadingScreen;
