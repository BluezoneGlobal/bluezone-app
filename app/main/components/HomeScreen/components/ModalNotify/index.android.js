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
import {DeviceEventEmitter, View, AppState} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import RNSettings from 'react-native-settings';
import * as PropTypes from 'prop-types';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

// Api
import Service from '../../../../../core/apis/service';
import {
  registerBluetoothStateListener,
  getBluetoothState,
  enableBluetooth,
} from '../../../../../core/bluetooth';

// Components
import ModalBase from './ModalNotify';

// Language
import message from '../../../../../core/msg/home';
import {injectIntl, intlShape} from 'react-intl';

// Styles
import configuration from '../../../../../configuration';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiblePermissionLocationDenied: false,
      isVisiblePermissionLocationBlocked: false,
      isVisibleLocation: false,
      isVisibleBLE: false,
    };

    this.requestPermissionLocation = this.requestPermissionLocation.bind(this);
    this.requestPermissionWrite = this.requestPermissionWrite.bind(this);
    this.onTurnOnLocation = this.onTurnOnLocation.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.checkBluetoothState = this.checkBluetoothState.bind(this);
    this.checkGeolocationState = this.checkGeolocationState.bind(this);
    this.onStartBluetooth = this.onStartBluetooth.bind(this);
    this.onStartLocation = this.onStartLocation.bind(this); // BluetoothStatus.addListener(i => {
    //   alert(i);
    // });
    this.onStartPermissionLocation = this.onStartPermissionLocation.bind(this);
    this.isWizardCheckPermissionLocationBlockFinished = this.isWizardCheckPermissionLocationBlockFinished.bind(
      this,
    );
    this.setStatusBluetooth = this.setStatusBluetooth.bind(this);

    this.numberOfCheckLocationPermission = 0;
    this.isPermissionLocationRequesting = false;
    this.statusLocation = '';

    this.timer = null;
    this.isVisibleGeolocation = true;
  }

  async componentDidMount() {
    // this.checkBluetoothState();
    registerBluetoothStateListener(this.setStatusBluetooth);

    AppState.addEventListener('change', this.handleAppStateChange);

    // TODO both DeviceEventEmitter and NativeAppEventEmitter are deprecated, you should use NativeEventEmitter instead.
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this.handleGPSProviderEvent,
    );

    this.timer = setTimeout(this.requestPermissionLocation, 500);
  }

  componentWillUnmount() {
    this.numberOfCheckLocationPermission = 0;
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearTimeout(this.timer);
  }

  // Kịch bản kiểm tra quyền truy cập vị trí đã hòan thành?
  isWizardCheckPermissionLocationBlockFinished() {
    return (
      // Hoàn thành khi người dùng cấp quyền
      this.statusLocation === 'granted' ||
      // Hoàn thành khi người dùng từ chối quyền vĩnh viễn + đang không mở modal giải thích việc cần cấp quyền
      (this.statusLocation === 'blocked' &&
        !this.state.isVisiblePermissionLocationBlocked) ||
      // Hoàn thành khi người dùng từ chối quyền 2 lần (sau khi đã mở modal giải thích việc cần cấp quyền)
      (this.statusLocation === 'denied' &&
        this.numberOfCheckLocationPermission >= 2)
    );
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      // this.checkBluetoothState();

      if (this.statusLocation === 'granted') {
        this.checkGeolocationState();
      }

      if (
        // Nếu trước đó là winzard request quyền vị trí và bị từ chối vĩnh viễn
        this.statusLocation === 'blocked' &&
        // và modal giải thích quyền vị trí đã đóng
        !this.state.isVisiblePermissionLocationBlocked
      ) {
        // Thì thực hiện request quyền ổ đĩa
        this.requestPermissionWrite();
      }
    }
  }

  requestPermissionLocation() {
    if (this.isPermissionLocationRequesting) {
      return;
    }
    this.isPermissionLocationRequesting = true;
    requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then(
      statuses => {
        this.isPermissionLocationRequesting = false;
        const permissionLocation =
          statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

        switch (permissionLocation) {
          case 'denied':
            if (this.numberOfCheckLocationPermission === 0) {
              this.setState({isVisiblePermissionLocationDenied: true});
            }
            this.numberOfCheckLocationPermission++;
            break;
          case 'blocked':
            if (this.numberOfCheckLocationPermission === 0) {
              this.setState({isVisiblePermissionLocationBlocked: true});
            }
            this.numberOfCheckLocationPermission++;
            break;
        }

        this.statusLocation = permissionLocation;

        // Điều kiện này chỉ để đảm bảo là bước cuối thì mới thực hiện các việc liên quan
        if (
          this.statusLocation === 'granted' ||
          (this.statusLocation === 'blocked' &&
            !this.state.isVisiblePermissionLocationBlocked) ||
          (this.statusLocation === 'denied' &&
            this.numberOfCheckLocationPermission >= 2)
        ) {
          this.requestPermissionWrite();
        }
      },
    );
  }

  requestPermissionWrite() {
    if (this.statusLocation === 'granted') {
      this.checkGeolocationState();
    }
  }

  handleGPSProviderEvent = e => {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      this.isVisibleGeolocation = false;
      this.isVisibleBLE && this.setState({isVisibleLocation: true});
    } else {
      this.checkBluetoothState();
      this.isVisibleGeolocation = true;
    }
  };

  async checkBluetoothState() {
    const isEnabled = await getBluetoothState();
    this.setStatusBluetooth(isEnabled);
  }

  checkGeolocationState() {
    Geolocation.getCurrentPosition(
      () => {
        this.state.isVisibleLocation &&
          this.setState({isVisibleLocation: false});
      },
      error => {
        if (error.code === 2) {
          !this.state.isVisibleLocation &&
            this.setState({isVisibleLocation: true});
        }
      },
    );
  }

  onStartLocation() {
    this.setState({isVisiblePermissionLocationDenied: false}, () => {
      if (this.statusLocation === 'blocked') {
        Service.androidOpenSettings('android.settings.SETTINGS');
        return;
      }
      if (this.numberOfCheckLocationPermission < 2) {
        this.requestPermissionLocation();
      }
    });
  }

  onTurnOnLocation() {
    this.setState({isVisibleLocation: false}, () => {
      setTimeout(() => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(() => {
            this.setState({isVisibleLocation: false});
          })
          .catch(() => {
            // this.setState({isVisibleLocation: true });
          });
      }, 200);
    });
  }

  setStatusBluetooth(status) {
    this.isVisibleBLE = status;
    (this.isVisibleGeolocation || this.isVisibleBLE) &&
      this.setState({isVisibleBLE: !status});

    if (this.isVisibleBLE && !this.isVisibleGeolocation) {
      this.checkGeolocationState();
    }

    if (status) {
      this.props.setModalStatus({
        isCheckRegisterPhone: true,
      });
    }
  }

  onStartBluetooth() {
    enableBluetooth();
  }

  onStartPermissionLocation() {
    this.setState({isVisiblePermissionLocationBlocked: false}, () => {
      Service.androidOpenSettings('android.settings.SETTINGS');
    });
  }

  render() {
    const {language} = this.context;
    const {intl} = this.props;
    const {
      isVisiblePermissionLocationDenied,
      isVisibleLocation,
      isVisiblePermissionLocationBlocked,
      isVisibleBLE,
    } = this.state;
    const {formatMessage} = intl;
    const {
      NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT_en,
      NOTIFI_LOCATION_ANDROID_TEXT,
      NOTIFI_LOCATION_ANDROID_TEXT_en,
      NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT_en,
      NOTIFI_BLUETOOTH_ANDROID_TEXT,
      NOTIFI_BLUETOOTH_ANDROID_TEXT_en,
    } = configuration;

    const en = language && language !== 'vi';
    const _NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT = en
      ? NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT_en
      : NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT;
    const _NOTIFI_LOCATION_ANDROID_TEXT = en
      ? NOTIFI_LOCATION_ANDROID_TEXT_en
      : NOTIFI_LOCATION_ANDROID_TEXT;
    const _NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT = en
      ? NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT_en
      : NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT;
    const _NOTIFI_BLUETOOTH_ANDROID_TEXT = en
      ? NOTIFI_BLUETOOTH_ANDROID_TEXT_en
      : NOTIFI_BLUETOOTH_ANDROID_TEXT;

    return (
      <View>
        <ModalBase
          isVisible={isVisiblePermissionLocationBlocked}
          content={_NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT}
          onPress={this.onStartPermissionLocation}
          btnText={formatMessage(message.openSettingLocation)}
        />
        <ModalBase
          isVisible={isVisiblePermissionLocationDenied}
          content={_NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT}
          onPress={this.onStartLocation}
          btnText={formatMessage(message.permissionLocation)}
        />
        <ModalBase
          isVisible={isVisibleLocation}
          content={_NOTIFI_LOCATION_ANDROID_TEXT}
          onPress={this.onTurnOnLocation}
          btnText={formatMessage(message.openSettingLocation)}
        />
        <ModalBase
          isVisible={isVisibleBLE}
          content={_NOTIFI_BLUETOOTH_ANDROID_TEXT}
          onPress={this.onStartBluetooth}
          btnText={formatMessage(message.openSettingBluetooth)}
        />
      </View>
    );
  }
}

ModalNotify.propTypes = {
  intl: intlShape.isRequired,
};

ModalNotify.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(ModalNotify);
