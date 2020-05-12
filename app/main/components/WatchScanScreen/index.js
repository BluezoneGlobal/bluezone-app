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
import 'moment/locale/vi';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {injectIntl, intlShape} from 'react-intl';
import * as Progress from 'react-native-progress';

// Components
import Header from '../../../base/components/Header';
import Text, {MediumText} from '../../../base/components/Text';
import CountBlueZoner from '../../../base/components/CountBlueZoner';

// Language
import message from '../../../msg/trace';

// Config
import configuration from '../../../Configuration';

// Styles
import styles from './styles/index.css';

// Api
import Service from '../../../apis/service';

class WatchScanScreen extends React.Component {
  constructor(props) {
    super(props);
    const {logs, mapDevice} = this.creatLog();
    this.state = {
      logs: logs || [],
      statusLoadding: true,
      bzId: '',
    };
    this.mapDevice = mapDevice || {};
  }

  async componentDidMount() {
    this.createListener();
    this.timeountLoading = setTimeout(() => {
      this.setState({statusLoadding: false});
    }, 15000);
    const bzId = await Service.getBluezoneIdFirst6Char();
    this.setState({bzId: bzId});
  }

  componentWillUnmount() {
    this.removeListener();
    const keys = Object.keys(this.mapDevice);
    for (var i = 0; i < keys.length; i++) {
      clearTimeout(this.mapDevice[keys[i]].timmer);
      delete this.mapDevice[keys[i]];
    }
    clearTimeout(this.timeountLoading);
  }

  createListener = () => {
    this.scanBLEListener = Service.addListenerScanBLE(this.onScan);
    if (Platform.OS !== 'ios') {
      this.scanBlueToothListener = Service.addListenerScanBlueTooth(
        this.onScan,
      );
    }
    this.bluezoneIdChange = Service.addListenerBluezoneIdChange(
      this.onBluezoneIdChange,
    );
  };

  removeListener = () => {
    this.scanBLEListener && this.scanBLEListener.remove();
    this.scanBlueToothListener && this.scanBlueToothListener.remove();
    this.bluezoneIdChange && this.bluezoneIdChange.remove();
  };

  creatLog = () => {
    const {TimeShowLog} = configuration;
    const {route} = this.props;
    const logsNavigation = (route && route.params.logs) || [];
    const logs = [];
    const mapDevice = {};

    logsNavigation.forEach(log => {
      if (!log.userId) {
        return;
      }

      const keyMap =
        log.userId && log.userId.length > 0
          ? log.userId
          : log.name + '@' + log.address;
      logs.push({
        id: keyMap,
        // timestamp: moment().format("DD/MM/YYYY HH:mm:ss"),
        userId: log.userId,
        name: log.name,
        address: log.address,
        platform: log.platform,
        type: this.getTypeRSSI(log.rssi),
        rssi: log.rssi,
      });

      // Create timmer
      const timmer = setTimeout(() => {
        delete this.mapDevice[keyMap];
        this.setState(prevState => {
          const logsTemp = prevState.logs;
          for (let i = 0; i < logsTemp.length; i++) {
            if (
              logsTemp[i].userId === log.userId &&
              logsTemp[i].name === log.name &&
              logsTemp[i].address === log.address
            ) {
              logsTemp.splice(i, 1);
            }
          }

          return {
            logs: [...logsTemp],
          };
        });
      }, TimeShowLog);

      mapDevice[keyMap] = {
        timmer,
        time: new Date().getTime(),
      };
    });

    return {
      logs,
      mapDevice,
    };
  };

  onBack = () => {
    this.props.navigation.goBack();
    return true;
  };

  getTypeRSSI = rssi => {
    const {RssiThreshold} = configuration;
    return rssi && rssi >= RssiThreshold ? 1 : 0;
  };

  onBluezoneIdChange = bzId => {
    if (bzId !== this.state.bzId) {
      this.setState({bzId: bzId});
    }
  };

  onScan = ({id, name = '', address = '', rssi, platform, typeScan}) => {
    if (!id) {
      return;
    }

    const {TimeShowLog} = configuration;
    const {logs} = this.state;

    const keyMap = id && id.length > 0 ? id : name + '@' + address;
    const typeRSSI = this.getTypeRSSI(rssi);

    if (this.mapDevice[keyMap]) {
      // Xóa timmer cũ
      clearTimeout(this.mapDevice[keyMap].timmer);
      delete this.mapDevice[keyMap];
    }

    let hasDevice = false;
    let typeList;
    let indexDevice;
    for (let i = 0; i < logs.length; i++) {
      if (
        logs[i].userId === id &&
        logs[i].name === name &&
        logs[i].address === address
      ) {
        hasDevice = true;
        indexDevice = i;
        typeList = logs[i].type;
      }
    }

    if (!hasDevice) {
      // Thêm vào danh sách
      this.setState(prevState => {
        return {
          logs: [
            ...prevState.logs,
            {
              id: keyMap,
              userId: id,
              name: name,
              address: address,
              platform,
              type: typeRSSI,
              typeScan,
              rssi: rssi,
            },
          ],
        };
      });
    } else if (hasDevice && typeList !== typeRSSI) {
      // Sửa lại danh sách
      logs[indexDevice].type = typeRSSI;
      logs[indexDevice].rssi = rssi;
      this.setState(prevState => {
        return {
          logs: [...logs],
        };
      });
    }

    // Thêm timmer
    const timmer = setTimeout(() => {
      delete this.mapDevice[keyMap];
      // Xóa khỏi danh sách thiết bị
      this.setState(prevState => {
        const logsTemp = prevState.logs;
        for (let i = 0; i < logsTemp.length; i++) {
          if (
            logsTemp[i].userId === id &&
            logsTemp[i].name === name &&
            logsTemp[i].address === address
          ) {
            logsTemp.splice(i, 1);
          }
        }

        return {
          logs: [...logsTemp],
        };
      });
    }, TimeShowLog);

    this.mapDevice[keyMap] = {
      timmer,
      time: new Date().getTime(),
    };
  };

  onInvite = () => {
    this.props.navigation.navigate('Invite', {header: true});
  };

  buttonInvite = userId => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    if (userId) {
      return (
        <View style={styles.inviteButtonContainer}>
          <FastImage
            source={require('./styles/images/bluezoner.png')}
            style={styles.buttonInvite}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={styles.inviteButtonContainer}
        onPress={this.onInvite}>
        <View style={styles.inviteButton}>
          <Text style={styles.inviteText}>{formatMessage(message.invite)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderItemLog = item => {
    const content = item.userId
      ? `${Service.getFirst6Char(item.userId)}`
      : `${item.name}`;
    return (
      <View key={item.id} style={styles.listItemContainer}>
        <Text numberOfLines={1} style={styles.contentScan}>
          {content}
        </Text>
        {this.buttonInvite(item.userId)}
      </View>
    );
  };

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {logs, statusLoadding, bzId} = this.state;

    const itemsLogNear = [];
    const itemsLogDiff = [];

    logs.forEach(log => {
      if (log.type === 1) {
        itemsLogNear.push(log);
      } else {
        itemsLogDiff.push(log);
      }
    });

    let countBlueZone = 0;
    logs.forEach(log => {
      if (log.userId && log.userId.length > 0) {
        countBlueZone++;
      }
    });

    return (
      <SafeAreaView style={styles.container}>
        <Header
          onBack={this.onBack}
          styleTitle={styles.titleHeader}
          styleHeader={styles.header}
          colorIcon="#015CD0"
          showBack
          title={formatMessage(message.header)}
        />
        <ScrollView>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <CountBlueZoner countBlueZone={countBlueZone} />
            </View>
          </View>

          <Text style={styles.infoItemDesc}>
            {countBlueZone > 1
              ? formatMessage(message.bluezoners)
              : formatMessage(message.bluezoner)}
          </Text>
          <View style={styles.listContainer}>
            <View style={styles.listHeaderContainer}>
              <MediumText style={styles.textListHeader}>
                {formatMessage(message.nearYou)}
              </MediumText>
              <MediumText style={styles.textListHeaderValue}>
                {itemsLogNear.length}
              </MediumText>
            </View>
            {itemsLogNear.length > 0 ? (
              <View style={styles.listBodyContainer}>
                {itemsLogNear.map(item => {
                  return this.renderItemLog(item);
                })}
              </View>
            ) : statusLoadding ? (
              <View style={styles.listEmptyContainer}>
                <Progress.CircleSnail
                  size={64}
                  color={'#015cd0'}
                  duration={800}
                  progress={0.9}
                  thickness={4}
                />
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
          <View style={styles.listContainer}>
            <View style={styles.listHeaderContainer}>
              <MediumText style={styles.textListHeader}>
                {formatMessage(message.around)}
              </MediumText>
              <MediumText style={styles.textListHeaderValue}>
                {itemsLogDiff.length}
              </MediumText>
            </View>
            {itemsLogDiff.length > 0 ? (
              <View style={styles.listBodyContainer}>
                {itemsLogDiff.map(item => {
                  return this.renderItemLog(item);
                })}
              </View>
            ) : statusLoadding ? (
              <View style={styles.listEmptyContainer}>
                <Progress.CircleSnail
                  size={64}
                  color={'#015cd0'}
                  duration={800}
                  progress={0.9}
                  thickness={4}
                />
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
          <View style={styles.listHeaderContainer}>
            <MediumText style={styles.textListHeader}>
              {formatMessage(message.myBluezoneId)}
            </MediumText>
            <MediumText style={styles.textUserCode}>{bzId}</MediumText>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

WatchScanScreen.propTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object,
};

WatchScanScreen.defaultProps = {};

export default injectIntl(WatchScanScreen);
