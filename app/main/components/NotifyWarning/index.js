/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 09:59
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
import {View, SafeAreaView} from 'react-native';
import moment from 'moment';
import {injectIntl, intlShape} from 'react-intl';
import 'moment/locale/vi'; // without this line it didn't work

// Components
import FastImage from 'react-native-fast-image';
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifyDoubt from './NotifyDoubt';
import NotifyPending from './NotifyPending';
import NotifySafe from './NotifySafe';
import NotifyInfected from './NotifyInfected';
import NotifyVerified from './NotifyVerified';
import Service from '../../../apis/service';
import {uploadHistoryF12, declaration} from '../../../apis/bluezone';

// Styles
import styles from './styles/index.css';
import msg from '../../../msg/home';
import configuration from '../../../Configuration';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: (props.route && props.route.params.state) || 'doubt',
      statusUpload: null,
    };
    this.bluezoneIds =
      (props.route && props.route.params.data.bluezoneIds) || [];
    this.onBack = this.onBack.bind(this);
    this.sendHistory = this.sendHistory.bind(this);
    this.onDeclaration = this.onDeclaration.bind(this);
    this.onSafe = this.onSafe.bind(this);
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  handleUpdateSuccess = () => {
    this.setState({
      statusUpload: 'success',
      status: 'pending',
    });
  };

  handleUpdateError = () => {
    this.setState({
      statusUpload: 'failed',
    });
  };

  async sendHistory() {
    this.setState({
      statusUpload: 'waiting',
    });
    const filePath = await Service.writeHistoryContact(this.bluezoneIds);
    uploadHistoryF12(
      filePath,
      3,
      this.handleUpdateSuccess,
      this.handleUpdateError,
    );
  }

  onDeclaration = (phoneNumber, name, address) => {
    // ...
    // declaration(); // ...
  };

  onSafe = () => {
    this.onBack();
  };

  render() {
    const {route, intl} = this.props;
    const {status, statusUpload} = this.state;
    const item = (route && route.params.data) || {};
    const {formatMessage} = intl;
    const {Language} = configuration;

    return (
      <SafeAreaView style={styles.container}>
        <Header
          onBack={this.onBack}
          colorIcon={'#015cd0'}
          styleTitle={styles.textHeader}
          showBack
          title={formatMessage(msg.warn)}
        />
        <View style={styles.wrapper}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={require('./styles/images/boyte.png')}
              style={styles.avatar}
            />
            <View style={styles.content}>
              <MediumText numberOfLines={1} style={styles.titleText}>
                {Language === 'vi' ? item.title : item.titleEn}
              </MediumText>
              <MediumText style={styles.colorDes}>
                {Language === 'vi'
                  ? `Thời gian: ${moment(item.timestamp).format(
                      'HH:mm',
                    )} Ngày: ${moment(item.timestamp).format('DD/MM/YYYY')}`
                  : `${moment(item.timestamp).format('HH:mm')} ${moment(
                      item.timestamp,
                    ).format('DD/MM/YYYY')}`}
              </MediumText>
            </View>
          </View>
          {/* Content */}
          {status === 'doubt' && <NotifyDoubt statusUpload={statusUpload} onPress={this.sendHistory} />}
          {status === 'pending' && <NotifyPending onPress={this.onSafe} />}
          {status === 'safe' && <NotifySafe onPress={this.onSafe} />}
          {status === 'infected' && (
            <NotifyInfected onPress={this.onDeclaration} />
          )}
          {status === 'verified' && (
            <NotifyVerified onPress={this.sendHistory} />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
