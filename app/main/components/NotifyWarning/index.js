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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Components
import FastImage from 'react-native-fast-image';
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifyContact from './NotifyContact';

// Styles
import styles from './styles/index.css';
import home from '../../../core/msg/home';
import configuration from '../../../configuration';
import bluezoneIcon from '../NotifyDetail/styles/images/corona.png';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    const {route} = props;
    this.state = {
      status: route.params.status || 'doubt',
    };
    this.notifyId = route && route.params.data.notifyId;
  }

  render() {
    const {route, intl} = this.props;
    const {status, declare} = this.state;
    const item = (route && route.params.data) || {};
    const {formatMessage} = intl;
    const {Language} = configuration;
    const notifyObj = route.params.data;

    const iconURI = notifyObj.largeIcon;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <KeyboardAwareScrollView
          style={styles.container}
          enableAutomaticScroll={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <Header
            colorIcon={status === 'infected' ? '#ff0000' : '#015cd0'}
            styleTitle={[
              styles.textHeader,
              {color: status === 'infected' ? '#ff0000' : '#015cd0'},
            ]}
            title={formatMessage(home.warn)}
          />
          <View style={styles.wrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FastImage
                source={iconURI ? {uri: iconURI} : bluezoneIcon}
                style={styles.avatar}
              />
              <View style={styles.content}>
                <MediumText numberOfLines={1} style={styles.titleText}>
                  {Language === 'vi' ? item.title : item.titleEn}
                </MediumText>
                <MediumText style={styles.colorDes}>
                  {` ${moment(item.timestamp).format('DD/MM/YYYY')} - ${moment(
                    item.timestamp,
                  ).format('HH:mm')}`}
                </MediumText>
              </View>
            </View>
            {/* Xác minh thấy có tiếp xúc */}
            {status === 'contact' && (
              <NotifyContact
                notifyObj={notifyObj}
                declare={declare}
                onBack={this.onBack}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
