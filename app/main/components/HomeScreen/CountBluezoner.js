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
import {Platform, TouchableOpacity, View} from 'react-native';
import * as PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

// Components
import Text from '../../../base/components/Text';

// Language
import message from '../../../msg/home';

// Apis
import Service from '../../../apis/service';

// Styles
import style from './styles/index.css';
import {heightPercentageToDP} from '../../../utils/dimension';
import {injectIntl, intlShape} from 'react-intl';

const SCANNING_HEIGHT = heightPercentageToDP((152 / 720) * 100);

const TIMEOUT = 30000;
export let logBluezone = [];

class CountBluezoner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      blueTooth: false,
      countBlueZone: 0,
      newAmount: 0,
      showModalInvite: false,
      showModalWrite: false,
      scanning: true,
    };

    this.mapDevice = {};
    // this.logs = [];
    this.onScan = this.onScan.bind(this);
    this.watchScan = this.watchScan.bind(this);
  }

  componentDidMount() {
    logBluezone = [];
    this.scanBLEListener = Service.addListenerScanBLE(this.onScan);
    if (Platform.OS !== 'ios') {
      this.scanBlueToothListener = Service.addListenerScanBlueTooth(
        this.onScan,
      );
    }
    this.timeoutScanning = setTimeout(() => {
      this.setState({scanning: false});
    }, 15000);
  }

  componentWillUnmount() {
    this.scanBLEListener && this.scanBLEListener.remove();
    this.scanBlueToothListener && this.scanBlueToothListener.remove();
    const keys = Object.keys(this.mapDevice);
    for (var i = 0; i < keys.length; i++) {
      clearTimeout(this.mapDevice[keys[i]].timmer);
      delete this.mapDevice[keys[i]];
    }
    clearTimeout(this.timeoutScanning);
  }

  onScan({id, name = '', address = '', rssi, platform, typeScan}) {
    const logs = logBluezone;
    const keyMap = id && id.length > 0 ? id : name + '@' + address;

    if (this.mapDevice[keyMap]) {
      // Xóa timmer cũ
      clearTimeout(this.mapDevice[keyMap].timmer);
      delete this.mapDevice[keyMap];
    } else {
      if (keyMap === id) {
        this.setState(prevState => {
          return {
            countBlueZone: prevState.countBlueZone + 1,
          };
        });
      }
    }

    let hasDevice = false;
    // TODO Admin: không rõ mục đích của biến này "typeList",
    // let typeList;
    let indexDevice;
    for (let i = 0; i < logs.length; i++) {
      if (
        logs[i].userId === id &&
        logs[i].name === name &&
        logs[i].address === address
      ) {
        hasDevice = true;
        indexDevice = i;
      }
    }

    if (!hasDevice) {
      // Thêm vào danh sách
      logs.push({
        id: keyMap,
        userId: id,
        name,
        address,
        rssi,
        platform,
        typeScan,
      });
    } else {
      // Sửa lại danh sách
      logs[indexDevice].rssi = rssi;
    }

    // Thêm timmer
    const timmer = setTimeout(() => {
      delete this.mapDevice[keyMap];
      // Xóa khỏi danh sách thiết bị
      for (let i = 0; i < logs.length; i++) {
        if (
          logs[i].userId === id &&
          logs[i].name === name &&
          logs[i].address === address
        ) {
          logs.splice(i, 1);
        }
      }

      if (keyMap === id) {
        this.setState(prevState => {
          return {
            countBlueZone: prevState.countBlueZone - 1,
          };
        });
      }
    }, TIMEOUT);

    this.mapDevice[keyMap] = {
      timmer,
      time: new Date().getTime(),
    };
  }

  watchScan() {
    this.props.navigation.navigate('WatchScan', {logs: [...logBluezone]});
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;

    const {scanning, countBlueZone} = this.state;
    const {blueTooth} = this.props;
    return (
      <TouchableOpacity style={style.circleScan} onPress={this.watchScan}>
        <View style={style.circleSnail}>
          {countBlueZone === 0 && blueTooth && scanning ? (
            <Progress.CircleSnail
              size={SCANNING_HEIGHT}
              color={'#015cd0'}
              duration={800}
              progress={0.9}
              thickness={4}
            />
          ) : (
            <View style={style.numberBluezone} />
          )}
        </View>

        {blueTooth && countBlueZone === 0 && scanning ? (
          <Text style={style.textBlue}>{formatMessage(message.scanning)}</Text>
        ) : (
          <>
            <Text style={style.textBlueNumber}>
              {blueTooth ? countBlueZone : '_'}
            </Text>
            <Text style={style.textBlue}>
              {countBlueZone > 1
                ? formatMessage(message.bluezoners)
                : formatMessage(message.bluezoner)}
            </Text>
            <Text style={style.textBlue}>{formatMessage(message.around)}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }
}

CountBluezoner.propTypes = {
  intl: intlShape.isRequired,
};

CountBluezoner.defaultProps = {};

CountBluezoner.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(CountBluezoner);
