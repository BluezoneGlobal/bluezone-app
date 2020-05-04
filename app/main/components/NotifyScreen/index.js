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
  ActivityIndicator,
} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

// Components
import Text, {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifySession from './NotifySession';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
// import InviteScreen from "../InviteScreen";

// Utils
import {getNotifications} from '../../../../app/db/SqliteDb';
import message from '../../../msg/trace';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      statusLoadding: true,
    };
    this.index = 0;
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    this.initData();
    this.props.navigation.addListener('tabPress', () => {
      this.initData();
    });
    this.timeOutLoadingBluezoner = setTimeout(() => {
      this.setState({statusLoadding: false});
    }, 15000);
  }

  initData = async () => {
    getNotifications(this.index, items => {
      this.setState({notifications: items});
    });
  };

  onGetDataFromDB = async index => {
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
    console.log('cuongntg123', item);
    this.props.navigation.navigate('NotifyDetail', {item});
  };

  render() {
    const {route, intl} = this.props;
    const {notifications, statusLoadding} = this.state;
    console.log('Notify - ', notifications);
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
            title={formatMessage(message.announcement)}
          />
        ) : (
          <View>
            <View style={styles.header}>
              <MediumText style={styles.textHeader}>
                {formatMessage(message.announcement)}
              </MediumText>
            </View>
            {notifications.length > 0 ? (
              <View style={styles.wrapper}>
                {/*<NotifySession*/}
                {/*  title={'Cảnh báo'}*/}
                {/*  data={dataWar}*/}
                {/*  styleTitle={styles.titleWar}*/}
                {/*  styleTextTitle={styles.textTitleWar}*/}
                {/*/>*/}
                <NotifySession
                  title={formatMessage(message.announcement)}
                  data={dataNtf}
                  styleTitle={styles.titleNtf}
                  styleTextTitle={styles.textTitleNtf}
                  onGet={this.onGetDataFromDB}
                />
              </View>
            ) : statusLoadding ? (
              <View style={styles.listEmptyContainer}>
                <ActivityIndicator size="large" color="#015CD0" />
              </View>
            ) : (
              <View style={styles.listEmptyContainer}>
                <View style={styles.listEmptyCircle}>
                  <View style={styles.circle} />
                </View>
                <Text style={styles.listEmptyText}>
                  {formatMessage(message.noList)}
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

NotifyScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NotifyScreen);
