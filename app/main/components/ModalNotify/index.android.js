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
import {
  DeviceEventEmitter,
  Platform,
  View,
  AppState,
  Linking,
} from 'react-native';
import {BluetoothStatus} from 'react-native-bluetooth-status';
import SystemSetting from 'react-native-system-setting';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import RNSettings from 'react-native-settings';
import SendIntentAndroid from 'react-native-send-intent';
import * as PropTypes from 'prop-types';

// Components
import ButtonText from '../../../base/components/ButtonText';
import Text, {MediumText} from '../../../base/components/Text';
import ModalBase from './ModalBase';

// Language
import message from '../../../msg/home';
import {injectIntl, intlShape} from 'react-intl';
import {messageNotifyOTP} from './data';

// Api
import {getCheckVersions} from '../../../apis/bluezone';
import getStatusUpdate from '../../../utils/getStatusUpdate';

// Styles
import styles from './styles/index.css';
import configuration, {
  getUserCodeAsync,
  createNotifyPermisson,
  removeNotifyPermisson,
  checkNotifyOfDay,
  setStatusNotifyRegister,
} from '../../../Configuration';
import {replaceNotify} from '../../../db/SqliteDb';
import {navigationRef} from '../../../../RootNavigation';
import Flash from '../AuthLoadingScreen/Flash';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiblePermissionLocationDenied: false,
      isVisibleLocation: false,
      isVisiblePermissionWriteDenied: false,
      isVisiblePermissionLocationBlocked: false,
      isVisiblePermissionWriteBlocked: false,

      // isVisibleBluetooth: false,
      isModalUpdate: false,
      forceUpdate: false,
      isVisibleFlash: false,
      isVisibleBLE: false,
    };

    this.requestPermissionLocation = this.requestPermissionLocation.bind(this);
    this.requestPermissionWrite = this.requestPermissionWrite.bind(this);
    this.onTurnOnLocation = this.onTurnOnLocation.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.checkBluetoothState = this.checkBluetoothState.bind(this);
    this.checkGeolocationState = this.checkGeolocationState.bind(this);
    this.onCheckUpdate = this.onCheckUpdate.bind(this);
    this.onStartBluetooth = this.onStartBluetooth.bind(this);
    this.onStartLocation = this.onStartLocation.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);
    this.onStartWrite = this.onStartWrite.bind(this);
    this.onStartPermissionLocation = this.onStartPermissionLocation.bind(this);
    this.onStartWriteBlock = this.onStartWriteBlock.bind(this);
    this.isWizardCheckPermissionWriteFinished = this.isWizardCheckPermissionWriteFinished.bind(
      this,
    );
    this.isWizardCheckPermissionLocationBlockFinished = this.isWizardCheckPermissionLocationBlockFinished.bind(
      this,
    );
    this.setLoadingModalFlash = this.setLoadingModalFlash.bind(this);
    this.setNotifyRegister = this.setNotifyRegister.bind(this);
    this.setStatusBluetooth = this.setStatusBluetooth.bind(this);

    this.numberOfCheckLocationPermission = 0;
    this.numberOfCheckWritePermission = 0;
    this.isPermissionLocationRequesting = false;
    this.isPermissionWriteRequesting = false;
    this.statusLocation = '';
    this.statusWrite = '';

    this.timer = null;
  }

  async componentDidMount() {
    // TODO cần xử lý đảm bảo không có yêu cầu bắt buộc cập nhật phiên bản mới thì mới thực thi tiếp các phần dưới.
    // Check Update App
    this.onCheckUpdate();

    // this.checkBluetoothState();

    BluetoothStatus.addListener(this.setStatusBluetooth);

    AppState.addEventListener('change', this.handleAppStateChange);

    // TODO both DeviceEventEmitterand NativeAppEventEmitter are deprecated, you should use NativeEventEmitter instead.
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this.handleGPSProviderEvent,
    );

    this.timer = setTimeout(this.requestPermissionLocation, 500);
  }

  componentWillUnmount() {
    this.numberOfCheckLocationPermission = 0;
    BluetoothStatus.removeListener();
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearTimeout(this.timer);
  }

  // Kịch bản kiểm tra quyền truy cập bộ nhớ đã hòan thành?
  isWizardCheckPermissionWriteFinished() {
    return (
      // Hoàn thành khi người dùng cấp quyền
      this.statusWrite === 'granted' ||
      // Hoàn thành khi người dùng từ chối quyền vĩnh viễn + đang không mở modal giải thích việc cần cấp quyền
      (this.statusWrite === 'blocked' &&
        !this.state.isVisiblePermissionWriteDenied) ||
      // Hoàn thành khi người dùng từ chối quyền 2 lần (sau khi đã mở modal giải thích việc cần cấp quyền)
      (this.statusWrite === 'denied' && this.numberOfCheckWritePermission >= 2)
    );
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
        !this.state.isVisiblePermissionLocationBlocked &&
        // Và chưa bắt đầu request quyền ổ đĩa
        this.statusWrite === ''
      ) {
        // Thì thực hiện request quyền ổ đĩa
        this.requestPermissionWrite();
      }

      const navigations = navigationRef.current.getRootState();
      if (
        this.statusWrite !== '' &&
        this.state.isVisibleLocation === false &&
        this.state.isVisibleBLE === false &&
        this.state.isVisibleBLE === false &&
        navigations.routes.length === 1 &&
        navigations.routes[0].name === 'Home' &&
        navigations.routes[0].state.index === 0
      ) {
        this.setState({isVisibleFlash: true});
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
    if (this.isPermissionWriteRequesting) {
      return;
    }
    this.isPermissionWriteRequesting = true;
    requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      statuses => {
        this.isPermissionWriteRequesting = false;
        const permissionWrite =
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
        switch (permissionWrite) {
          case 'denied':
            if (this.numberOfCheckWritePermission === 0) {
              this.setState({isVisiblePermissionWriteDenied: true});
            }
            this.numberOfCheckWritePermission++;
            break;
          case 'blocked':
            if (this.numberOfCheckWritePermission === 0) {
              this.setState({isVisiblePermissionWriteBlocked: true});
            }
            this.numberOfCheckWritePermission++;
            break;
        }
        this.statusWrite = permissionWrite;

        // Điều kiện này chỉ để đảm bảo kịch bản xin quyền vị trí đã kết thúc thì mới làm việc tiếp theo
        if (this.isWizardCheckPermissionLocationBlockFinished()) {
          // Điều kiện này chỉ để đảm bảo kịch bản xin quyền bộ nhớ đã kết thúc thì mới làm việc tiếp theo
          if (this.isWizardCheckPermissionWriteFinished()) {
            getUserCodeAsync();
            if (
              this.statusWrite !== 'granted' ||
              this.statusLocation !== 'granted'
            ) {
              createNotifyPermisson();
            } else {
              removeNotifyPermisson();
            }
          }
        }

        if (this.statusLocation === 'granted') {
          this.checkGeolocationState();
        }

        this.setNotifyRegister();
        this.checkBluetoothState();
      },
    );
  }

  handleGPSProviderEvent = e => {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      this.setState({isVisibleLocation: true});
    }
  };

  async checkBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    this.setStatusBluetooth(isEnabled);
  }

  checkGeolocationState() {
    Geolocation.getCurrentPosition(
      () => {
        this.setState({isVisibleLocation: false});
      },
      error => {
        if (error.code === 2) {
          this.setState({isVisibleLocation: true});
        }
      },
    );
  }

  onStartLocation() {
    this.setState({isVisiblePermissionLocationDenied: false}, () => {
      if (this.statusLocation === 'blocked') {
        SendIntentAndroid.openSettings('android.settings.SETTINGS');
        return;
      }
      if (this.numberOfCheckLocationPermission < 2) {
        this.requestPermissionLocation();
      }
    });
  }

  onTurnOnLocation() {
    this.setState({isVisibleLocation: false}, () => {
      SystemSetting.switchLocation(() => {
        console.log('switch location successfully');
      });
    });
  }

  setStatusBluetooth(status) {
    this.props.onChangeBlue(status);
    this.setState({isVisibleBLE: !status});
  }

  onCheckUpdate() {
    getCheckVersions(
      response => {
        const statusUpdate = getStatusUpdate(
          response.VersionAndroid,
          response.forceUpdateAndroid,
          response.recommendedUpdateAndroid,
        );
        this.urlUpdate = response.LinkShareAndroid;
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

  onStartBluetooth() {
    SystemSetting.switchBluetooth(() => {
      console.log('switch bluetooth successfully');
    });
  }

  onUpdate = () => {
    this.setState({isModalUpdate: false, forceUpdate: false}, () => {
      this.urlUpdate && Linking.openURL(this.urlUpdate);
    });
  };

  onCancelUpdate = () => {
    this.setState({isModalUpdate: false, forceUpdate: false});
  };

  onStartWrite() {
    this.setState({isVisiblePermissionWriteDenied: false}, () => {
      if (this.statusWrite === 'blocked') {
        SendIntentAndroid.openSettings('android.settings.SETTINGS');
        return;
      }
      if (this.numberOfCheckWritePermission < 2) {
        this.requestPermissionWrite();
      }
    });
  }

  onStartPermissionLocation() {
    this.setState({isVisiblePermissionLocationBlocked: false}, () => {
      SendIntentAndroid.openSettings('android.settings.SETTINGS');
    });
  }

  onStartWriteBlock() {
    this.setState({isVisiblePermissionWriteBlocked: false}, () => {
      SendIntentAndroid.openSettings('android.settings.SETTINGS');
    });
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
      isVisiblePermissionLocationDenied,
      isVisibleLocation,
      isModalUpdate,
      forceUpdate,
      isVisiblePermissionWriteDenied,
      isVisiblePermissionLocationBlocked,
      isVisiblePermissionWriteBlocked,
      isVisibleFlash,
      isVisibleBLE,
    } = this.state;
    const {formatMessage} = intl;
    const {
      NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT_en,
      NOTIFI_LOCATION_ANDROID_TEXT,
      NOTIFI_LOCATION_ANDROID_TEXT_en,
      NOTIFI_PERMISSION_WRITE_FILE_TEXT,
      NOTIFI_PERMISSION_WRITE_FILE_TEXT_en,
      NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT_en,
      NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT,
      NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT_en,
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
    const _NOTIFI_PERMISSION_WRITE_FILE_TEXT = en
      ? NOTIFI_PERMISSION_WRITE_FILE_TEXT_en
      : NOTIFI_PERMISSION_WRITE_FILE_TEXT;
    const _NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT = en
      ? NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT_en
      : NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT;
    const _NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT = en
      ? NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT_en
      : NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT;
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
        />
        <ModalBase
          isVisible={isVisibleLocation}
          content={_NOTIFI_LOCATION_ANDROID_TEXT}
          onPress={this.onTurnOnLocation}
          btnText={formatMessage(message.openSettingLocation)}
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
            <Flash setLoadingModalFlash={this.setLoadingModalFlash} />
          </View>
        </Modal>

        <ModalBase
          isVisible={isVisibleBLE}
          content={_NOTIFI_BLUETOOTH_ANDROID_TEXT}
          onPress={this.onStartBluetooth}
        />
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
              <Text style={styles.textCenter}>
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
        <ModalBase
          isVisible={isVisiblePermissionWriteDenied}
          content={_NOTIFI_PERMISSION_WRITE_FILE_TEXT}
          onPress={this.onStartWrite}
        />
        <ModalBase
          isVisible={isVisiblePermissionWriteBlocked}
          content={_NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT}
          onPress={this.onStartWriteBlock}
          btnText={formatMessage(message.openSettingIOFile)}
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
