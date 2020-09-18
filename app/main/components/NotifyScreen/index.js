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
import {View, SafeAreaView, Dimensions} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

// Components
import FastImage from 'react-native-fast-image';
import Text, {MediumText} from '../../../base/components/Text';
import NotifySession from './NotifySession';

// Styles
import styles from './styles/index.css';

// Utils
import {getNotifyList} from '../../../core/db/SqliteDb';
import {
  readNotification,
  createPhoneNumberReminder,
} from '../../../core/announcement';
import message from '../../../core/msg/notify';
import configuration from '../../../configuration';
import {messageNotifyOTP, messageNotifyOTPSuccess} from '../../../core/data';
import {
  NOTIFICATION_TYPE,
  RESULT_VERIFY_TYPE,
} from '../../../const/notification';

export const notifyScreenTool = {};

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    const {height} = Dimensions.get('window');
    this.state = {
      notifications: [],
      height: height,
    };
    this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;
    Dimensions.addEventListener('change', this.handleDimensionsChange);
    this.initData();
    navigation.addListener('focus', () => {
      const {notifications} = this.state;
      this.initData(notifications && notifications.length);
    });

    // this.removeMessageListener = registerMessageHandler(notifyObj => {
    //   this.timeout = setTimeout(() => {
    //     this.getList();
    //   }, 3000);
    // });
    notifyScreenTool.getList = this.getList;
  }

  componentWillUnmount() {
    this.removeMessageListener && this.removeMessageListener();
    this.timeout && clearTimeout(this.timeout);
  }

  handleDimensionsChange(e) {
    const {height} = e.window;
    this.setState({height});
  }

  getList = () => {
    const {notifications} = this.state;
    if (notifications.length > 10) {
      this.initData(notifications.length + 1);
    } else {
      this.initData();
    }
  };

  initData = async count => {
    getNotifyList(
      null,
      items => {
        if (items.length > 0) {
          this.setState({notifications: items});
        } else {
          const {PhoneNumber, TokenFirebase, Language} = configuration;
          const data = PhoneNumber
            ? messageNotifyOTPSuccess
            : messageNotifyOTP(Language);
          // Todo: Check trường hợp đăng kí TokenFirebase thành công mới cho hiển thị thông báo đăng kí số điện thoại.
          TokenFirebase && createPhoneNumberReminder(data);
          this.initData();
        }
      },
      count,
    );
  };

  onGetDataFromDB = async (timespan, callback) => {
    getNotifyList(timespan, items => {
      callback();
      this.setState(prev => ({
        notifications: prev.notifications.concat(items),
      }));
    });
  };

  onPressWarning = item => {
    const {data: dataJson} = item;
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch (e) {
      data = {};
    }
    // const {hasSendHistory} = data;
    // let status = '';
    // if (hasSendHistory) {
    //   status = 'pending';
    // } else {
    //   status = 'doubt';
    // }
    this.props.navigation.navigate('NotifyWarning', {
      status: 'contact',
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

    const {Result} = data;
    let status = '';

    if (Result === RESULT_VERIFY_TYPE.CONTACT) {
      // status = TYPE_SCREEN_VERIFY[RESULT_VERIFY_TYPE.CONTACT];
      status = 'contact';
    } else if (Result === RESULT_VERIFY_TYPE.NO_CONTACT) {
      // status = TYPE_SCREEN_VERIFY[RESULT_VERIFY_TYPE.NO_CONTACT];
    }

    if (!status) {
      return;
    }

    status = status.toLowerCase();
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
    if (item.unRead !== 1) {
      readNotification(item.notifyId);
    }

    const {_group} = item;
    switch (_group) {
      case NOTIFICATION_TYPE.SEND_SHORT_NEWS:
      case 'SERVICE':
      case 'PERMISSION':
      case 'MOBILE':
        this.props.navigation.navigate('NotifyDetail', {item});
        // this.props.navigation.navigate('NotifyWarning', {
        //   status: 'contact',
        //   data: {
        //     ...item,
        //     group: item._group,
        //     data: data,
        //   },
        // });

        break;
      case NOTIFICATION_TYPE.SEND_HTML_NEWS:
        this.props.navigation.navigate('DetailNew', {
          item: {
            title: item.title,
            data: JSON.parse(item.data || {}),
          },
        });
        break;
      case NOTIFICATION_TYPE.SEND_URL_NEW:
        this.props.navigation.navigate('PageView', {
          item: {
            title: item.title,
            data: JSON.parse(item.data || {}),
          },
        });
        break;
      case 'CONFIG':
        // Không xử lý
        break;
      case NOTIFICATION_TYPE.FIND_F12:
        this.onPressWarning(item);
        break;
      case NOTIFICATION_TYPE.CONFIRMED_F12:
        this.onPressVerify(item);
        break;
    }
  };

  render() {
    const {intl} = this.props;
    const {notifications, height} = this.state;
    const {formatMessage} = intl;
    const dataNtf = {
      items: notifications,
      callback: {
        onPress: this.onPressNotification,
      },
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MediumText style={styles.textHeader}>
            {formatMessage(message.announcement)}
          </MediumText>
        </View>
        {notifications.length > 0 ? (
          <View style={styles.wrapper}>
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
