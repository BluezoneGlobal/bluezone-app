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
import 'react-native-get-random-values';
import * as PropTypes from 'prop-types';

// Components
import {
  SafeAreaView,
  StatusBar,
  BackHandler,
  View,
  Linking,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Error from './Error';
import Text, {MediumText} from '../../../base/components/Text';

// Utils
import configuration from '../../../Configuration';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../utils/fontSize';

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backButtonEnabled: null,
      version: DeviceInfo.getVersion(),
    };
    this.onGoBack = this.onGoBack.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onGoBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onGoBack);
  }

  setRef = ref => {
    this._bridge = ref;
  };

  onGoBack() {
    if (this.state.backButtonEnabled) {
      this._bridge.goBack();
      return true;
    }
  }

  onNavigationStateChange = navState => {
    if (navState.canGoBack !== this.state.backButtonEnabled) {
      this.setState({
        backButtonEnabled: navState.canGoBack,
      });
    }
  };

  renderError = () => <Error onPress={this.reload} />;

  reload() {
    if (this._bridge) {
      this._bridge.reload();
    }
  }

  render() {
    const {version} = this.state;
    const {language} = this.context;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={{paddingHorizontal: 20}}>
          <MediumText style={styles.title}>Bluezone phiên bản {version}</MediumText>
          <Text style={styles.date}>Ngày phát hành 05/5/2020.</Text>
          <Text />
          <Text style={styles.description}>
            Ứng dụng do Bộ Thông tin và Truyền thông, Bộ Y tế chủ trì, với sự
            tham gia phát triển của BKAV và cộng đồng CNTT. Ứng dụng giúp người
            dân tự theo dõi các tiếp xúc gần, giúp bảo vệ bản thân, bảo vệ cộng
            đồng, góp phần phòng, chống dịch bệnh.
          </Text>
          <Text />
          <Text style={styles.textContact}>
            Chi tiết xem tại:{' '}
            <Text
              style={styles.linkweb}
              onPress={() => Linking.openURL('www.bluezone.gov.vn')}>
              www.bluezone.gov.vn
            </Text>
          </Text>
          <Text />
          <Text style={styles.textContact}>
            Thông tin liên hệ:{' '}
            <Text
              style={styles.linkweb}
              onPress={() => Linking.openURL('mailto:lienhe@bluezone.gov.vn')}>
              lienhe@bluezone.gov.vn
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

InfoScreen.contextTypes = {
  language: PropTypes.string,
};

export default InfoScreen;
