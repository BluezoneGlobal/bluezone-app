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
import {Platform, TouchableOpacity} from 'react-native';
import * as PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

// Components
import Dot from './Dot';

// Apis
import Service from '../../../../../core/apis/service';

// Styles
import style from '../../styles/index.css';
import {injectIntl, intlShape} from 'react-intl';

// Data
import radar from './data/radar';
import {weakDots, normalDots, strongDots} from './data/dot';
import {getRandomArr, getRandomDotIndex} from './data';
import {dev} from '../../../../../core/apis/server';

// Const
const TIMEOUT = 30000;
export let logBlueZone = [];

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.mapDevice = {};
    this.onScan = this.onScan.bind(this);
    this.onRadarAnimationFinish = this.onRadarAnimationFinish.bind(this);
    this.setDotRef = this.setDotRef.bind(this);
    this.setWeakDotRef = this.setWeakDotRef.bind(this);
    this.setNormalDotRef = this.setNormalDotRef.bind(this);
    this.setStrongDotRef = this.setStrongDotRef.bind(this);
    this.setRadarRef = this.setRadarRef.bind(this);
    this.radarRef = {play: () => {}};

    this.dotRefArr = {
      weak: [],
      normal: [],
      strong: [],
    };
    this.currentDots = getRandomDotIndex(0);
    this.blueZoners = {};
  }

  componentDidMount() {
    logBlueZone = [];
    this.scanBLEListener = Service.addListenerScanBLE(this.onScan);
    if (Platform.OS === 'android') {
      this.scanBluetoothListener = Service.addListenerScanBluetooth(
        this.onScan,
      );
    }
  }

  componentWillUnmount() {
    this.scanBLEListener && this.scanBLEListener.remove();
    this.scanBluetoothListener && this.scanBluetoothListener.remove();
    const keys = Object.keys(this.mapDevice);
    for (let i = 0; i < keys.length; i++) {
      clearTimeout(this.mapDevice[keys[i]].timer);
      delete this.mapDevice[keys[i]];
    }
  }

  onScan({id, name = '', address = '', rssi = 0, platform, typeScan}) {
    const keyMap = id && id.length > 0 ? id : name + '@' + address;
    console.log('rssi', rssi);
    if (this.mapDevice[keyMap]) {
      // Xóa timer cũ
      clearTimeout(this.mapDevice[keyMap].timer);
      delete this.mapDevice[keyMap];
    } else {
      if (keyMap === id) {
        this.blueZoners[id] = rssi;
      }
    }

    let hasDevice = false;
    let indexDevice;
    for (let i = 0; i < logBlueZone.length; i++) {
      if (
        logBlueZone[i].userId === id &&
        logBlueZone[i].name === name &&
        logBlueZone[i].address === address
      ) {
        hasDevice = true;
        indexDevice = i;
      }
    }

    if (!hasDevice) {
      // Thêm vào danh sách
      logBlueZone.push({
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
      logBlueZone[indexDevice].rssi = rssi;
    }

    // Thêm timer
    const timer = setTimeout(() => {
      delete this.mapDevice[keyMap];
      // Xóa khỏi danh sách thiết bị
      for (let i = 0; i < logBlueZone.length; i++) {
        if (
          logBlueZone[i].userId === id &&
          logBlueZone[i].name === name &&
          logBlueZone[i].address === address
        ) {
          logBlueZone.splice(i, 1);
        }
      }

      if (keyMap === id) {
        delete this.blueZoners[id];
      }
    }, TIMEOUT);

    this.mapDevice[keyMap] = {
      timer,
      time: new Date().getTime(),
    };
  }

  onRadarAnimationFinish() {
    const dotArr = Object.values(this.blueZoners);
    this.currentDots = getRandomDotIndex(dotArr);

    // Play tat ca cac Dot moi se hien trong vong quet nay
    const dotTypes = Object.keys(this.currentDots);
    for (let j = 0; j < dotTypes.length; j++) {
      const type = dotTypes[j];
      for (let i = 0; i < this.currentDots[type].length; i++) {
        const newDotIndex = this.currentDots[type][i];
        this.dotRefArr[type][newDotIndex] &&
          this.dotRefArr[type][newDotIndex].play();
      }
    }
    // Play radar
    this.radarRef.play();
  }

  setDotRef(type, dotIndex, ref) {
    this.dotRefArr[type][dotIndex] = ref;
  }

  setWeakDotRef(dotIndex, ref) {
    this.setDotRef('weak', dotIndex, ref);
  }

  setNormalDotRef(dotIndex, ref) {
    this.setDotRef('normal', dotIndex, ref);
  }

  setStrongDotRef(dotIndex, ref) {
    this.setDotRef('strong', dotIndex, ref);
  }

  setRadarRef(ref) {
    this.radarRef = ref;
  }

  onOpenScanScreen = () => {
    dev && this.props.navigation.navigate('WatchScan');
  };

  render() {
    return (
      <TouchableOpacity
        style={style.circleScan}
        activeOpacity={1}
        onPress={this.onOpenScanScreen}>
        <LottieView
          ref={this.setRadarRef}
          loop={false}
          source={radar}
          onAnimationFinish={this.onRadarAnimationFinish}
          autoPlay
          renderMode="HARDWARE"
        />
        {strongDots.map((dot, index) => {
          return (
            <Dot
              key={dot.nm}
              dot={dot}
              dotIndex={index}
              ref={ref => this.setStrongDotRef(index, ref)}
            />
          );
        })}
        {normalDots.map((dot, index) => {
          return (
            <Dot
              key={dot.nm}
              dot={dot}
              dotIndex={index}
              ref={ref => this.setNormalDotRef(index, ref)}
            />
          );
        })}
        {weakDots.map((dot, index) => {
          return (
            <Dot
              key={dot.nm}
              dot={dot}
              dotIndex={index}
              ref={ref => this.setWeakDotRef(index, ref)}
            />
          );
        })}
      </TouchableOpacity>
    );
  }
}

Index.propTypes = {
  intl: intlShape.isRequired,
};

Index.defaultProps = {};

Index.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(Index);
