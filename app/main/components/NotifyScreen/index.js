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
import * as PropTypes from 'prop-types';
import {View, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {close, open} from '../../../db/SqliteDb';

// Components
import Text, {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifySection from './NotifySession';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
// import InviteScreen from "../InviteScreen";

// Utils
import {getNotifications} from '../../../../app/db/SqliteDb';
import message from "../../../msg/trace";
import {injectIntl, intlShape} from 'react-intl';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
    this.index = 0;
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    this.initData();
    this.focusListener = this.props.navigation.addListener('tabPress', () => {
      this.initData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
    close();
  }

  initData = async () => {
    getNotifications(this.index, items => {
      this.setState({notifications: items});
    });
  };

  onGetDataFromDB = async (index) => {
    getNotifications(index, items => {
      this.setState(prev => ({
        notifications: prev.notifications.concat(items),
      }));
    });
  };

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  onPressWarning = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyWarning', {item});
  };

  onPressNotification = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyDetail', {item});
  };

  render() {
    const {route, intl} = this.props;
    const {notifications} = this.state;
    const {formatMessage} = intl;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const dataNtf = {
      items: notifications,
      callback: {
        onPress: this.onPressNotification,
      },
    };

    return (
      <SafeAreaView style={styles.container}>
        {header ? (
          <Header
            onBack={this.onBack}
            colorIcon={'#015cd0'}
            styleTitle={styles.textHeader}
            showBack
            title={'Thông báo'}
          />
        ) : (
          <View>
            <View style={styles.header}>
              <MediumText style={styles.textHeader}>Thông báo</MediumText>
            </View>
            <>
              <View style={styles.wrapper}>
                <NotifySection
                  title={'Thông báo'}
                  data={dataNtf}
                  styleTitle={styles.titleNtf}
                  styleTextTitle={styles.textTitleNtf}
                />
              </View>
            </>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
