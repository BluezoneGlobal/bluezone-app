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
import {View, SafeAreaView, StatusBar, ActivityIndicator} from 'react-native';

// Components
import Text from '../../../base/components/Text';

// Language
import message from '../../../core/msg/auth';
import {
  syncResourceLanguage,
  initResourceLanguage,
} from '../../../core/language';

// Apis
import {initConfiguration, syncConfiguration} from '../../../configuration';

// Styles
import styles from './styles/index.css';
import {retrySyncTokenFirebase} from '../../../configuration';
import IconBluezone from './styles/images/IconBluezone';
import {LOGO_HEIGHT} from './styles/index.css';
import {blue_bluezone} from '../../../core/color';

// DB
import {initDatabase} from '../../../core/db/SqliteDb';
import {getIsFirstLoading} from '../../../core/storage';

const PROCESS_WORK_TIMEOUT = 5000;

// TODO Can thuc hien doi text theo trang thai goi API that trong components nay. VD: Dang khoi tao cau hinh, Dang khoi tao resource....
class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: null,
      renderLevel: true,
      isFirstLoading: false,
    };

    this.checkAuth = this.checkAuth.bind(this);
    this.finishedAPI = this.finishedAPI.bind(this);
    this.doFinishedWorks = this.doFinishedWorks.bind(this);
    this.initConfigurationFinally = this.initConfigurationFinally.bind(this);
    this.initResourceLanguageFinally = this.initResourceLanguageFinally.bind(
      this,
    );

    this.finishedWorks = 0;
    this.works = {
      initResourceLanguage: false,
      syncResourceLanguage: false,
      initConfiguration: false,
      syncConfiguration: false,
      retrySyncTokenFirebase: false,
    };
  }

  componentDidMount() {
    // Check trạng thái lần đầu tiên vào app.
    this.checkAuth();

    // 1. Dong bo resource
    // Khoi tao resource language san co duoi client
    initResourceLanguage(() => {
      this.finishedAPI('initResourceLanguage', true);
      this.initResourceLanguageFinally();
    }).then(() => {});

    // 2. Dong bo cau hinh
    // Khoi tao configuration
    initConfiguration(
      () => {
        this.finishedAPI('initConfiguration', true);
        this.initConfigurationFinally();
      },
      () => {
        this.finishedAPI('initConfiguration', false);
        this.initConfigurationFinally();
      },
    ).then(() => {});

    // 4. Khởi tạo db.
    initDatabase();

    // Dam bao luon chuyen vao giao dien tiep theo sau 5s tranh bi treo o man nay.
    this.finishedWorksTimer = setTimeout(
      this.doFinishedWorks,
      PROCESS_WORK_TIMEOUT,
    );
  }

  async checkAuth() {
    const isFirstLoading = await getIsFirstLoading();
    this.setState({isFirstLoading});
  }

  initConfigurationFinally() {
    // Kiem tra, dong bo config moi nhat neu co
    syncConfiguration(
      () => this.finishedAPI('syncConfiguration', true),
      () => this.finishedAPI('syncConfiguration', false),
    );
    // 3. Dong bo token firebase
    // this.registerFirebase();
    retrySyncTokenFirebase(
      () => this.finishedAPI('retrySyncTokenFirebase', true),
      () => this.finishedAPI('retrySyncTokenFirebase', false),
    );
  }

  initResourceLanguageFinally() {
    // Kiem tra, dong bo resource moi nhat neu co
    syncResourceLanguage(
      () => this.finishedAPI('syncResourceLanguage', true),
      () => this.finishedAPI('syncResourceLanguage', false),
    );
  }

  doFinishedWorks() {
    const {onFinished, name} = this.props;
    onFinished(name, {}, !this.works.retrySyncTokenFirebase);
  }

  finishedAPI(work, status) {
    this.finishedWorks++;
    this.works[work] = status;
    if (this.finishedWorks >= 5) {
      clearTimeout(this.finishedWorksTimer);
      this.doFinishedWorks();
    }
  }

  render() {
    const {isFirstLoading} = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.modalFlash}>
          <IconBluezone width={LOGO_HEIGHT} height={LOGO_HEIGHT} />
          <View style={styles.body}>
            <ActivityIndicator size="large" color={blue_bluezone} />
            <Text
              text={formatMessage(
                isFirstLoading
                  ? message.titleFirstLoading
                  : message.titleLoading,
              )}
              style={styles.text}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

LoadingScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
  isFirstLoading: PropTypes.bool,
  name: PropTypes.string,
};

LoadingScreen.defaultProps = {
  onFinished: () => {},
  isFirstLoading: false,
  name: '',
};

export default injectIntl(LoadingScreen);
