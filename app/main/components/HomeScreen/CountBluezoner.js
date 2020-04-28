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
import {Platform} from 'react-native';

// Components
import Text from '../../../base/components/Text';

// Apis
import Service from '../../../apis/service';

// Styles
import style from './styles/index.css';

const TIMEOUT = 30000;
export const logBluezone = [];

class CountBluezoner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      blueTooth: false,
      countShield: 0,
      newAmount: 0,
      showModalInvite: false,
      showModalWrite: false,
    };

    this.mapDevice = {};
    // this.logs = [];
    this.onScan = this.onScan.bind(this);

    // this.isPermissionWriteBlock = 0;
  }

  componentDidMount() {
    this.scanBLEListener = Service.addListenerScanBLE(this.onScan);
    if (Platform.OS !== 'ios') {
      this.scanBlueToothListener = Service.addListenerScanBlueTooth(
        this.onScan,
      );
    }
  }

  componentWillUnmount() {
    this.scanBLEListener && this.scanBLEListener.remove();
    this.scanBlueToothListener && this.scanBlueToothListener.remove();
    const keys = Object.keys(this.mapDevice);
    for (var i = 0; i < keys.length; i++) {
      clearTimeout(this.mapDevice[keys[i]].timmer);
      delete this.mapDevice[keys[i]];
    }
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
            countShield: prevState.countShield + 1,
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
            countShield: prevState.countShield - 1,
          };
        });
      }
    }, TIMEOUT);

    this.mapDevice[keyMap] = {
      timmer,
      time: new Date().getTime(),
    };
  }

  render() {
    const {countShield} = this.state;
    const {blueTooth} = this.props;
    return (
      <Text style={style.textBlueNumber}>{blueTooth ? countShield : '_'}</Text>
    );
  }
}

CountBluezoner.defaultProps = {};

export default CountBluezoner;
