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
import {BluetoothStatus} from 'react-native-bluetooth-status';
import * as PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigation} from '@react-navigation/compat';

// Components
import Modal from 'react-native-modal';
import {View, AppState, Linking, Platform} from 'react-native';
import ModalBase from './ModalBase';
import Text, {MediumText} from '../../../base/components/Text';
import AuthLoadingScreen from '../AuthLoadingScreen';
import ButtonText from '../../../base/components/ButtonText';
import {getCheckVersions} from '../../../apis/bluezone';
import getStatusUpdate from '../../../utils/getStatusUpdate';
import {navigate, navigationRef} from '../../../../RootNavigation';

import {
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions';
import configuration, {
  getUserCodeAsync,
  checkNotifyOfDay,
  setStatusNotifyRegister,
} from '../../../Configuration';

// Language
import message from '../../../msg/home';
import {injectIntl, intlShape} from 'react-intl';
import {messageNotifyOTP} from './data';

// Styles
import styles from './styles/index.css';
import PushNotification from 'react-native-push-notification';
import {replaceNotify} from '../../../db/SqliteDb';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiblePermissionBLE: false,
      isVisibleBLE: false,
      isModalUpdate: false,
      forceUpdate: false,
      isVisiblePermissionNotify: false,
      isVisibleFlash: false,
    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onChangeBluetooth = this.onChangeBluetooth.bind(this);
    this.onCheckUpdate = this.onCheckUpdate.bind(this);
    this.onTurnOnPermissionBLE = this.onTurnOnPermissionBLE.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);
    this.checkRequestMultiple = this.checkRequestMultiple.bind(this);
    this.onTurnOnBLE = this.onTurnOnBLE.bind(this);
    this.onTurnOnNotify = this.onTurnOnNotify.bind(this);
    this.checkRequestNotifications = this.checkRequestNotifications.bind(this);
    this.setStatusBluetooth = this.setStatusBluetooth.bind(this);
    this.setLoadingModalFlash = this.setLoadingModalFlash.bind(this);
    this.setNotifyRegister = this.setNotifyRegister.bind(this);

    this.isPermissionBluetooth = false;
    this.vesionIOS = parseInt(Platform.Version, 10);
    this.statusPermissionNotify = '';
    this.timer = null;
  }

  componentDidMount() {
    // Check Version
    this.onCheckUpdate();

    getUserCodeAsync();

    // BluetoothStatus
    BluetoothStatus.addListener(this.setStatusBluetooth);

    AppState.addEventListener('change', this.handleAppStateChange);

    this.timer = setTimeout(this.checkRequestMultiple, 500);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearTimeout(this.timer);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      this.onCheckUpdate();
      if (this.statusPermissionBluetooth === 'granted') {
        this.onChangeBluetooth();
      }

      if (this.statusPermissionBluetooth === 'blocked') {
        this.checkRequestMultiple();
      }

      const navigations = navigationRef.current.getRootState();
      if (
        this.statusPermissionNotify !== '' &&
        this.state.isVisiblePermissionNotify === false &&
        navigations.routes.length === 1 &&
        navigations.routes[0].name === 'Home'
      ) {
        this.onCheckUpdate();
        this.setState({isVisibleFlash: true});
      }
    }
  }

  checkRequestMultiple() {
    requestMultiple([PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL]).then(statuses => {
      const permissionBluetooth =
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];
      // Check trang thai khi từ background sang foreground thì sẽ không hiển thi popup cài đặt nữa, chỉ cho hiển thị vào lúc lần đầu.

      this.statusPermissionBluetooth = permissionBluetooth;
      console.log('checkRequestMultiple', permissionBluetooth);
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
      console.log('requestNotifications', status, settings);
      this.statusPermissionNotify = status;
      switch (status) {
        case 'denied':
          break;
        case 'blocked':
          this.setState({isVisiblePermissionNotify: true});
          break;
        case 'granted':
          this.onChangeBluetooth();
          this.setNotifyRegister();
          break;
      }
    });
  }

  async onChangeBluetooth() {
    const isEnabled = await BluetoothStatus.state();
    this.setStatusBluetooth(isEnabled);
  }

  setStatusBluetooth(status) {
    this.props.onChangeBlue(status);
    if (this.vesionIOS < 13) {
      this.setState({isVisibleBLE: !status});
    }
  }

  onCheckUpdate() {
    getCheckVersions(
      response => {
        const statusUpdate = getStatusUpdate(
          response.VersionIOS,
          response.forceUpdateIOS,
          response.recommendedUpdateIOS,
        );
        this.urlUpdate = response.LinkShareIOS;
        if (statusUpdate !== 0) {
          this.urlUpdate &&
            this.urlUpdate.length > 0 &&
            this.setState({
              isModalUpdate: true,
              forceUpdate: statusUpdate === 1,
            });
        }
      },
      () => {},
    );
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
    this.setState({isVisibleBLE: false});
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

  onUpdate() {
    this.setState({isModalUpdate: false, forceUpdate: false}, () => {
      this.urlUpdate && Linking.openURL(this.urlUpdate);
    });
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

  onCancelUpdate() {
    this.setState({isModalUpdate: false, forceUpdate: false});
  }

  setLoadingModalFlash() {
    this.setState({isVisibleFlash: false});
  }

  setNotifyRegister() {
    const checkNotify = checkNotifyOfDay();
    if (!checkNotify) {
      return;
    }
    const {language} = this.context;
    setStatusNotifyRegister(new Date().getTime().toString());
    replaceNotify(messageNotifyOTP, language);
  }

  render() {
    const {language} = this.context;
    const {intl} = this.props;

    const {
      isVisiblePermissionBLE,
      isVisibleBLE,
      isModalUpdate,
      forceUpdate,
      isVisiblePermissionNotify,
      isVisibleFlash,
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
        />
        <ModalBase
          isVisible={isVisibleBLE}
          content={_NOTIFI_BLE_IOS_TEXT}
          onPress={this.onTurnOnBLE}
        />
        <ModalBase
          isVisible={isVisiblePermissionNotify}
          content={_NOTIFI_PERMISSION_TEXT}
          onPress={this.onTurnOnNotify}
        />
        <Modal
          isVisible={isVisibleFlash}
          style={{justifyContent: 'flex-end', margin: 0}}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={800}
          animationOutTiming={800}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          swipeDirection={['up', 'left', 'right', 'down']}>
          <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <AuthLoadingScreen setLoading={this.setLoadingModalFlash} />
          </View>
        </Modal>
        <Modal
          isVisible={isModalUpdate}
          style={styles.modal}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}>
          <View style={styles.container}>
            <View style={styles.textDiv}>
              <MediumText style={styles.textTitle}>
                {formatMessage(message.hasNewVersion)}
              </MediumText>
              <Text style={styles.textCenterIOS}>
                {formatMessage(message.updateVersion)}
              </Text>
            </View>
            <View style={styles.flexRow}>
              {!forceUpdate && (
                <ButtonText
                  text={formatMessage(message.Cancel)}
                  onPress={this.onCancelUpdate}
                  styleText={styles.colorText}
                  styleBtn={styles.buttonCancel}
                />
              )}
              <ButtonText
                text={formatMessage(message.Ok)}
                onPress={this.onUpdate}
                styleText={styles.colorText}
                styleBtn={styles.flex}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

ModalNotify.propTypes = {
  intl: intlShape.isRequired,
};

ModalNotify.contextTypes = {
  language: PropTypes.object,
};

export default withNavigation(injectIntl(ModalNotify));
