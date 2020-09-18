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

import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withNavigation} from '@react-navigation/compat';

// Components
import {View, AppState, Linking, Platform} from 'react-native';
import ModalBase from './ModalNotify';

import {
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions';
import configuration from '../../../../../configuration';
import {
  registerBluetoothStateListener,
  getBluetoothState,
} from '../../../../../core/bluetooth';

// Language
import {injectIntl, intlShape} from 'react-intl';
import message from '../../../../../core/msg/home';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiblePermissionBLE: false,
      isVisibleBLE: false,
      isVisiblePermissionNotify: false,
    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onChangeBluetooth = this.onChangeBluetooth.bind(this);
    this.onTurnOnPermissionBLE = this.onTurnOnPermissionBLE.bind(this);
    this.checkRequestMultiple = this.checkRequestMultiple.bind(this);
    this.onTurnOnBLE = this.onTurnOnBLE.bind(this);
    this.onTurnOnNotify = this.onTurnOnNotify.bind(this);
    this.checkRequestNotifications = this.checkRequestNotifications.bind(this);
    this.setStatusBluetooth = this.setStatusBluetooth.bind(this);

    this.isPermissionBluetooth = false;
    this.checkBLT = false;
    this.timer = null;
    this.vesionIOS = parseInt(Platform.Version, 10);
  }

  componentDidMount() {
    // BluetoothStatus
    registerBluetoothStateListener(this.setStatusBluetooth);

    AppState.addEventListener('change', this.handleAppStateChange);

    this.timer = setTimeout(this.checkRequestMultiple, 500);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange);
    clearTimeout(this.timer);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      if (this.statusPermissionBluetooth === 'granted' || this.statusPermissionBluetooth === 'unavailable') {
        this.checkBLT = false;
        this.onChangeBluetooth();
      }

      if (this.statusPermissionBluetooth === 'blocked') {
        this.checkRequestMultiple();
      }
    }
  }

  checkRequestMultiple() {
    requestMultiple([PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL]).then(statuses => {
      const permissionBluetooth =
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];
      // Check trang thai khi từ background sang foreground thì sẽ không hiển thi popup cài đặt nữa, chỉ cho hiển thị vào lúc lần đầu.

      this.statusPermissionBluetooth = permissionBluetooth;
      switch (permissionBluetooth) {
        case 'blocked':
          if (!this.isPermissionBluetooth) {
            this.setState({isVisiblePermissionBLE: true});
            this.isPermissionBluetooth = true;
          }
          break;
        case 'unavailable':
          this.checkRequestNotifications();
          break;
        case 'granted':
          this.checkRequestNotifications();
          break;
      }
    });
  }

  checkRequestNotifications() {
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
      switch (status) {
        case 'denied':
          break;
        case 'blocked':
          this.setState({isVisiblePermissionNotify: true});
          break;
        case 'granted':
          this.checkBLT = true;
          this.onChangeBluetooth();
          break;
      }
    });
  }

  async onChangeBluetooth() {
    const isEnabled = await getBluetoothState();
    this.setStatusBluetooth(isEnabled);
  }

  setStatusBluetooth(status) {
    console.log('setStatusBluetooth', status);
    if (this.vesionIOS < 13 || (!this.checkBLT && this.vesionIOS > 12)) {
      this.setState({isVisibleBLE: !status});
    }

    if (status && this.checkBLT) {
      this.checkBLT = false;
      this.props.setModalStatus({
        isCheckRegisterPhone: true,
      });
    }
  }

  onTurnOnPermissionBLE() {
    this.setState({isVisiblePermissionBLE: false});
    Linking.canOpenURL('app-settings:')
      .then(supported => {
        if (!supported) {
          console.log("Can't handle settings url");
        } else {
          return Linking.openURL('app-settings:');
        }
      })
      .catch(err => console.error('An error occurred', err));
  }

  onTurnOnBLE() {
    // this.setState({isVisibleBLE: false});
    Linking.canOpenURL('App-prefs:root=Bluetooth')
      .then(supported => {
        if (!supported) {
          console.log("Can't handle settings url");
        } else {
          return Linking.openURL('App-prefs:root=Bluetooth');
        }
      })
      .catch(err => console.error('An error occurred', err));
  }

  onTurnOnNotify() {
    this.setState({isVisiblePermissionNotify: false});
    Linking.canOpenURL('app-settings://')
      .then(supported => {
        if (!supported) {
          console.log("Can't handle settings url");
        } else {
          return Linking.openURL('app-settings://');
        }
      })
      .catch(err => console.error('An error occurred', err));
  }

  render() {
    const {language} = this.context;
    const {intl} = this.props;

    const {
      isVisiblePermissionBLE,
      isVisibleBLE,
      isVisiblePermissionNotify,
    } = this.state;
    const {formatMessage} = intl;

    const {
      NOTIFI_BLE_IOS_TEXT,
      NOTIFI_BLE_IOS_TEXT_en,
      NOTIFI_PERMISSION_BLE_IOS_TEXT,
      NOTIFI_PERMISSION_BLE_IOS_TEXT_en,
      NOTIFI_PERMISSION_TEXT,
      NOTIFI_PERMISSION_TEXT_en,
    } = configuration;

    const en = language && language !== 'vi';
    const _NOTIFI_BLE_IOS_TEXT = en
      ? NOTIFI_BLE_IOS_TEXT_en
      : NOTIFI_BLE_IOS_TEXT;
    const _NOTIFI_PERMISSION_BLE_IOS_TEXT = en
      ? NOTIFI_PERMISSION_BLE_IOS_TEXT_en
      : NOTIFI_PERMISSION_BLE_IOS_TEXT;
    const _NOTIFI_PERMISSION_TEXT = en
      ? NOTIFI_PERMISSION_TEXT_en
      : NOTIFI_PERMISSION_TEXT;

    return (
      <View>
        <ModalBase
          isVisible={isVisiblePermissionBLE}
          content={_NOTIFI_PERMISSION_BLE_IOS_TEXT}
          onPress={this.onTurnOnPermissionBLE}
          btnText={formatMessage(message.openSettingPermissionBlueTooth)}
        />
        <ModalBase
          isVisible={isVisibleBLE}
          content={_NOTIFI_BLE_IOS_TEXT}
          onPress={this.onTurnOnBLE}
          btnText={formatMessage(message.openSettingBluetooth)}
        />
        <ModalBase
          isVisible={isVisiblePermissionNotify}
          content={_NOTIFI_PERMISSION_TEXT}
          onPress={this.onTurnOnNotify}
          btnText={formatMessage(message.permissionNotify)}
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

export default withNavigation(injectIntl(ModalNotify));
