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
import {injectIntl, intlShape} from "react-intl";
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

// Styles
import styles from './styles/index.css';
import msg from '../../../msg/home';
import configuration from "../../../Configuration";

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      status: 'infected',
    };
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const {route, intl} = this.props;
    const {status} = this.state;
    const item = (route && route.params.item) || {};
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
                {
                  Language === 'vi' ?
                      (
                          `Thời gian: ${moment(item.timestamp).format("HH:mm")} Ngày: ${moment(item.timestamp).format("DD/MM/YYYY")}`
                      ) : `${moment(item.timestamp).format("HH:mm")} ${moment(item.timestamp).format("DD/MM/YYYY")}`
                }
              </MediumText>
            </View>
          </View>
          {/* Content */}
          {status === 'doubt' && <NotifyDoubt />}
          {status === 'pending' && <NotifyPending />}
          {status === 'safe' && <NotifySafe />}
          {status === 'infected' && <NotifyInfected />}
          {status === 'verified' && <NotifyVerified />}
        </View>
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
