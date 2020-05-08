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
  Dimensions,
} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

// Components
import FastImage from 'react-native-fast-image';
import Text, {MediumText} from '../../../base/components/Text';
// import Header from '../../../base/components/Header';
import NotifySession from './NotifySession';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
// import InviteScreen from "../InviteScreen";

// Utils
import {getNotifications, replaceNotify} from '../../../../app/db/SqliteDb';
import message from '../../../msg/notify';
import {messageNotifyOTP} from '../ModalNotify/data';

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    const {height} = Dimensions.get('window');
    this.state = {
      notifications: [],
      height: height,
    };
    this.index = 0;
    this.onBack = this.onBack.bind(this);
    this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleDimensionsChange);
    this.initData();
    this.props.navigation.addListener('focus', () => {
      // do something
      this.initData();
    });
    this.props.navigation.addListener('tabPress', () => {
      this.initData();
    });
  }

  handleDimensionsChange(e) {
    const {height} = e.window;
    this.setState({height});
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
    const {data: dataJson} = item;
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (e) {
      data = {};
    }
    const {hasSendHistory} = data;
    let status;
    if (hasSendHistory) {
      status = 'pending';
    } else {
      status = 'doubt';
    }
    this.props.navigation.navigate('NotifyWarning', {
      status,
      data: {
        ...item,
        group: item._group,
        data: data,
      },
    });
  };

  onPressVerify = item => {
    const {data: dataJson} = item;
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (e) {
      data = {};
    }

    const {result} = data;
    let status;

    // if (result === 'INFECTED') {
    //   status = 'infected';
    // } else if (result === 'SAFE') {
    //   status = 'safe';
    // }

    status = result.toLowerCase();
    this.props.navigation.navigate('NotifyWarning', {
      status,
      data: {
        ...item,
        group: item._group,
        data: data,
      },
    });
  };

  onPressNotification = item => {
    const {data: dataJson} = item;
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (e) {
      data = {};
    }

    replaceNotify(
      {
        data: {
          ...item,
          data: data,
          unRead: 1,
          group: item._group,
        },
      },
      '',
      false,
    );

    const {_group} = item;
    switch (_group.toUpperCase()) {
      case 'INFO':
      case 'SERVICE':
      case 'PERMISSION':
      case 'MOBILE':
        this.props.navigation.navigate('NotifyDetail', {item});
        break;
      case 'CONFIG':
        // Không xử lý
        break;
      case 'WARN':
        this.onPressWarning(item);
        break;
      case 'VERIFY':
        this.onPressVerify(item);
        break;
    }
  };

  render() {
    const {route, intl} = this.props;
    const {notifications, height} = this.state;
    const {formatMessage} = intl;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const dataNtf = {
      items: notifications,
      callback: {
        onPress: this.onPressNotification,
      },
    };

    debugger;

    return (
      <SafeAreaView style={styles.container}>
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
        ) : (
          <View style={[styles.listEmptyContainer, {height: height - 135}]}>
            <FastImage
              source={require('./styles/images/ic_list.png')}
              style={styles.empty}
            />
            <Text style={styles.listEmptyText}>
              {formatMessage(message.noList)}
            </Text>
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
