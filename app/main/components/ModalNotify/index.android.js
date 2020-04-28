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
import LinkingSettings from 'react-native-linking-settings';

// Components
import ButtonText from '../../../base/components/ButtonText';
import Text, {MediumText} from '../../../base/components/Text';
import ModalBase from './ModalBase';

// Api
import {getCheckVersions} from '../../../apis/bluezone';
import getStatusUpdate from '../../../utils/getStatusUpdate';

// Styles
import styles from './styles/index.css';
import configuration, {
  getUserCodeAsync,
  createNotifyPermisson,
  removeNotifyPermisson,
} from '../../../Configuration';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiblePermissionLocation: false,
      isVisibleLocation: false,
      isVisiblePermissionWriteFile: false,
      isVisiblePermissionLocationBlock: false,
      isVisiblePermissionWriteBlock: false,

      // isVisibleBluetooth: false,
      isModalUpdate: false,
      forceUpdate: false,
    };

    this.requestPermissionLocation = this.requestPermissionLocation.bind(this);
    this.onTurnOnLocation = this.onTurnOnLocation.bind(this);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.onChangeBluetooth = this.onChangeBluetooth.bind(this);
    this.onCheckGeolocation = this.onCheckGeolocation.bind(this);
    this.onCheckUpdate = this.onCheckUpdate.bind(this);
    this.onStartBluetooth = this.onStartBluetooth.bind(this);
    this.onStartLocation = this.onStartLocation.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);
    this.requestPermissionWrite = this.requestPermissionWrite.bind(this);
    this.onStartWrite = this.onStartWrite.bind(this);
    this.onStartPermissionLocation = this.onStartPermissionLocation.bind(this);
    this.onStartWriteBlock = this.onStartWriteBlock.bind(this);

    this.isPermissionLocationBlock = 0;
    this.isPermissionLocationRequesting = false;
    this.isPermissionWriteBlock = 0;
    this.isPermissionWriteRequesting = false;
    this.statusLocation = '';
    this.statusWrite = '';
  }

  async componentDidMount() {
    // Check Update App
    this.onCheckUpdate();

    // Check bật định vị
    setTimeout(() => {
      this.requestPermissionLocation();
    }, 100);

    // BluetoothStatus
    this.onChangeBluetooth();

    BluetoothStatus.addListener(listener => {
      this.props.onChangeBlue(listener);
      // this.setState({isVisibleBluetooth: !listener});
    });

    AppState.addEventListener('change', this.handleAppStateChange);
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this._handleGPSProviderEvent,
    );
  }

  componentWillUnmount() {
    this.isPermissionLocationBlock = 0;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      this.onChangeBluetooth();

      if (this.statusLocation === 'granted') {
        this.onCheckGeolocation();
      }

      // Nếu trước đó là vừa request quyền vị trí và bị block + modal giải thích quyền vị trí đã đóng + chưa bắt đầu request quyền ổ đĩa => thực hiện request quyền ổ đĩa
      if (
        this.statusLocation === 'blocked' &&
        !this.state.isVisiblePermissionLocationBlock &&
        this.statusWrite === ''
      ) {
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
            if (this.isPermissionLocationBlock === 0) {
              this.setState({isVisiblePermissionLocation: true});
            }
            this.isPermissionLocationBlock++;
            break;
          case 'blocked':
            if (this.isPermissionLocationBlock === 0) {
              this.setState({isVisiblePermissionLocationBlock: true});
            }
            this.isPermissionLocationBlock++;
            break;
        }

        this.statusLocation = permissionLocation;

        // Điều kiện này chỉ để đảm bảo là bước cuối thì mới thực hiện các việc liên quan
        if (
          this.statusLocation === 'granted' ||
          (this.statusLocation === 'blocked' &&
            this.isPermissionLocationBlock >= 2) || // => xử lý trong sự kiện từ background sang foreground
          (this.statusLocation === 'denied' &&
            this.isPermissionLocationBlock >= 2)
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
            if (this.isPermissionWriteBlock === 0) {
              this.setState({isVisiblePermissionWriteFile: true});
            }
            this.isPermissionWriteBlock++;
            break;
          case 'blocked':
            if (this.isPermissionWriteBlock === 0) {
              this.setState({isVisiblePermissionWriteBlock: true});
            }
            this.isPermissionWriteBlock++;
            break;
          case 'granted':
            if (
              this.statusWrite === 'granted' ||
              this.statusLocation === 'granted'
            ) {
              removeNotifyPermisson();
            }
            break;
        }
        this.statusWrite = permissionWrite;

        // Điều kiện này chỉ để đảm bảo là bước cuối thì mới thực hiện các việc liên quan
        if (
          this.statusWrite === 'granted' ||
          this.statusLocation === 'blocked' ||
          (this.statusWrite === 'denied' && this.isPermissionWriteBlock >= 2)
        ) {
          getUserCodeAsync();
        }

        if (this.statusLocation === 'granted') {
          this.onCheckGeolocation();
        }

        if (
          this.isPermissionWriteBlock >= 2 &&
          (this.statusWrite !== 'granted' || this.statusLocation !== 'granted')
        ) {
          createNotifyPermisson();
        }
      },
    );
  }

  _handleGPSProviderEvent = e => {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      this.setState({isVisibleLocation: true});
    }
  };

  async onChangeBluetooth() {
    const isEnabled = await BluetoothStatus.state();
    // this.setState({isVisibleBluetooth: !isEnabled});
    this.props.onChangeBlue(isEnabled);
  }

  onCheckGeolocation() {
    // this.setState({isVisibleLocation: false});
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
    this.setState({isVisiblePermissionLocation: false}, () => {
      this.timeOutPermissionLocation = setTimeout(() => {
        if (this.statusLocation === 'blocked') {
          Linking.openSettings();
          return;
        }
        if (this.isPermissionLocationBlock < 2) {
          this.requestPermissionLocation();
        }
        clearTimeout(this.timeOutPermissionLocation);
      }, 300);
    });
  }

  onTurnOnLocation() {
    this.setState({isVisibleLocation: false}, () => {
      this.timeOutVisibleLocation = setTimeout(() => {
        SystemSetting.switchLocation(() => {
          console.log('switch location successfully');
        });
        clearTimeout(this.timeOutVisibleLocation);
      }, 300);
    });
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
    if (Platform.OS === 'android') {
      SystemSetting.switchBluetooth(() => {
        console.log('switch bluetooth successfully');
      });
    } else {
      Linking.canOpenURL('app-settings://prefs:root=General&path=Bluetooth')
        .then(supported => {
          if (!supported) {
            console.log("Can't handle settings url");
          } else {
            return Linking.openURL('app-settings:');
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
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
    this.setState({isVisiblePermissionWriteFile: false}, () => {
      this.timeOutVisiblePermissionWriteFile = setTimeout(() => {
        if (this.statusWrite === 'blocked') {
          LinkingSettings.openSettings('SETTINGS');
          return;
        }
        if (this.isPermissionWriteBlock < 2) {
          this.requestPermissionWrite();
        }
        clearTimeout(this.timeOutVisiblePermissionWriteFile);
      }, 300);
    });
  }

  onStartPermissionLocation() {
    this.setState({isVisiblePermissionLocationBlock: false});
    Linking.sendIntent('android.settings.SETTINGS');
  }

  onStartWriteBlock() {
    this.setState({isVisiblePermissionWriteBlock: false});
    Linking.sendIntent('android.settings.SETTINGS');
  }

  render() {
    const {
      // isVisibleBluetooth,
      isVisiblePermissionLocation,
      isVisibleLocation,
      isModalUpdate,
      forceUpdate,
      isVisiblePermissionWriteFile,
      isVisiblePermissionLocationBlock,
      isVisiblePermissionWriteBlock,
    } = this.state;
    const {
      NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT,
      NOTIFI_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_WRITE_FILE_TEXT,
      NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT,
      NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT,
      // NOTIFI_BLUETOOTH_ANDROID_TEXT,
    } = configuration;
    return (
      <View>
        <ModalBase
          isVisible={isVisiblePermissionLocationBlock}
          content={NOTIFI_PERMISSION_BLOCK_LOCATION_ANDROID_TEXT}
          onPress={this.onStartPermissionLocation}
          btnText={'Đến cài đặt Bật vị trí'}
        />
        <ModalBase
          isVisible={isVisiblePermissionLocation}
          content={NOTIFI_PERMISSION_LOCATION_ANDROID_TEXT}
          onPress={this.onStartLocation}
        />
        <ModalBase
          isVisible={isVisibleLocation}
          content={NOTIFI_LOCATION_ANDROID_TEXT}
          onPress={this.onTurnOnLocation}
          btnText={'Đến cài đặt Bật vị trí'}
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
                Đã có phiên bản mới
              </MediumText>
              <Text style={styles.textCenter}>
                Bạn hãy cập nhật phiên bản mới để sử dụng các tính năng mới nhất
              </Text>
            </View>
            <View style={styles.flexRow}>
              {!forceUpdate && (
                <ButtonText
                  text={'Bỏ qua'}
                  onPress={this.onCancelUpdate}
                  styleText={styles.colorText}
                  styleBtn={styles.buttonCancel}
                />
              )}
              <ButtonText
                text={'Cập nhật'}
                onPress={this.onUpdate}
                styleText={styles.colorText}
                styleBtn={styles.flex}
              />
            </View>
          </View>
        </Modal>
        <ModalBase
          isVisible={isVisiblePermissionWriteFile}
          content={NOTIFI_PERMISSION_WRITE_FILE_TEXT}
          onPress={this.onStartWrite}
        />
        <ModalBase
          isVisible={isVisiblePermissionWriteBlock}
          content={NOTIFI_PERMISSION_WRITE_FILE_BLOCK_TEXT}
          onPress={this.onStartWriteBlock}
          btnText={'Đến cài đặt Bật lưu trữ'}
        />
      </View>
    );
  }
}

export default ModalNotify;
