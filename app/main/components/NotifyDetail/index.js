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
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';
import {injectIntl, intlShape} from 'react-intl';
import FastImage from 'react-native-fast-image';
import 'moment/locale/vi'; // without this line it didn't work

// Components
import Text, {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
import msg from '../../../msg/notify';
import configuration from '../../../Configuration';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    const {route} = this.props;
    const item = route && route.params.item;
    debugger;
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  onPress = () => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {PhoneNumber} = configuration;
    if (PhoneNumber) {
      Alert.alert(
        formatMessage(msg.notification),
        formatMessage(msg.registeredPhone),
      );
      return;
    }
    this.props.navigation.replace('Register');
  };

  formatNumberPhone = numberPhone => {
    return numberPhone.replace(/^(\d{4})\d*(\d{3})$/g, '$1***$2');
  };

  render() {
    const {route, intl} = this.props;
    const item = (route && route.params.item) || {};
    const uri =
      item.largeIcon && item.largeIcon.length > 0
        ? item.largeIcon
        : require('./styles/images/corona.png');
    const {formatMessage} = intl;
    const {Language, PhoneNumber} = configuration;

    return (
      <SafeAreaView style={styles.container}>
        <Header
          onBack={this.onBack}
          colorIcon={'#015cd0'}
          styleTitle={styles.textHeader}
          showBack
          title={formatMessage(msg.announcement)}
        />
        <ScrollView style={styles.wrapper}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <FastImage source={uri} style={styles.avatar} />
            <View style={styles.content}>
              <MediumText numberOfLines={1} style={styles.titleText}>
                {Language === 'vi' ? item.title : item.titleEn}
              </MediumText>
              <MediumText style={styles.colorDes}>
                {Language === 'vi'
                  ? `Thời gian: ${moment(Number(item.timestamp)).format(
                      'HH:mm',
                    )} Ngày: ${moment(Number(item.timestamp)).format(
                      'DD/MM/YYYY',
                    )}`
                  : `${moment(Number(item.timestamp)).format('HH:mm')} ${moment(
                      Number(item.timestamp),
                    ).format('DD/MM/YYYY')}`}
              </MediumText>
            </View>
          </View>
          <Text style={styles.textContent}>
            {Language === 'vi' ? item.bigText : item.bigTextEn}
          </Text>
          {item._group === 'MOBILE' ? (
            PhoneNumber ? (
              <Text style={styles.textPhoneNumber}>
                {formatMessage(msg.registeredPhone)}:{' '}
                {this.formatNumberPhone(PhoneNumber)}
              </Text>
            ) : (
              <View style={styles.declare}>
                <TouchableOpacity onPress={this.onPress} style={styles.button}>
                  <Text style={styles.textButton}>
                    {formatMessage(msg.declare)}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
