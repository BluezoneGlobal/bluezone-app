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
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  Dimensions,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
// import DeviceInfo from 'react-native-device-info';
// import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

// Components
import Modal from 'react-native-modal';
import ButtonText from '../../../base/components/ButtonText';
import ModalNotify from '../ModalNotify';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';
import NumberAnimate from '../../../base/components/NumberAnimate';

// Apis
import {getBluezonerAmount} from '../../../apis/bluezone';
import Service from '../../../apis/service';

// Config
import configuration /*, {getUserCodeAsync}*/ from '../../../Configuration';
import {
  hasModalNotify,
  textDefault,
  NOTIFY_INVITE_NUMBER,
} from '../../../utils/notifyConfiguration';

// Styles
import style from './styles/index.css';
import * as fontSize from '../../../utils/fontSize';
import styles from '../ModalNotify/styles/index.css';

const TIMEOUT = 30000;

const setHeight = 3.445;
const oldAmountKey = 'oldAmount';
const setHeight1 = 2.4;

class HomeTab extends React.Component {
  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      showModal: false,
      blueTooth: false,
      countShield: 0,
      width: width,
      height: height,
      newAmount: 0,
      showModalInvite: false,
      showModalWrite: false,
    };

    this.mapDevice = {};
    this.logs = [];
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
    this.onGetAmountSuccess = this.onGetAmountSuccess.bind(this);
    this.onScan = this.onScan.bind(this);
    this.watchScan = this.watchScan.bind(this);
    this.watchHistory = this.watchHistory.bind(this);
    this.considerNotify = this.considerNotify.bind(this);
    this.onCalcuTimesOpenApp = this.onCalcuTimesOpenApp.bind(this);
    this.onNotifyOpen = this.onNotifyOpen.bind(this);

    // this.isPermissionWriteBlock = 0;
  }

  async componentDidMount() {
    Dimensions.addEventListener('change', this.handleDimensionsChange);
    AppState.addEventListener('change', this.handleAppStateChange);

    this.scanBLEListener = Service.addListenerScanBLE(this.onScan);
    if (Platform.OS !== 'ios') {
      this.scanBlueToothListener = Service.addListenerScanBlueTooth(
        this.onScan,
      );
    }

    const oldAmount = await AsyncStorage.getItem(oldAmountKey);
    this.setNewAmount(oldAmount);

    getBluezonerAmount(this.onGetAmountSuccess);

    const timesOpenApp = await this.onCalcuTimesOpenApp();
    const firstTimeOpenAsyn = await AsyncStorage.getItem('firstTimeOpen');
    this.considerNotify(timesOpenApp, Number.parseInt(firstTimeOpenAsyn, 10));

    PushNotification.configure({
      onNotification: this.onNotifyOpen,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  setNewAmount(oldAmount) {
    if (oldAmount) {
      this.setState(prev => {
        return {
          newAmount: oldAmount,
        };
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.scanBLEListener && this.scanBLEListener.remove();
    this.scanBlueToothListener && this.scanBlueToothListener.remove();
    // this.demensions.remove();
    const keys = Object.keys(this.mapDevice);
    for (var i = 0; i < keys.length; i++) {
      clearTimeout(this.mapDevice[keys[i]].timmer);
      delete this.mapDevice[keys[i]];
    }
  }

  async onCalcuTimesOpenApp() {
    const timesOpenAsync = await AsyncStorage.getItem('timesOpenApp');
    let timesOpenApp = timesOpenAsync ? Number.parseInt(timesOpenAsync, 10) : 0;

    AsyncStorage.setItem('timesOpenApp', (timesOpenApp + 1).toString());

    return timesOpenApp + 1;
  }

  onNotifyOpen(notify) {
    if (notify.number === NOTIFY_INVITE_NUMBER) {
      this.props.navigation.jumpTo('Invite');
    }
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      getBluezonerAmount(this.onGetAmountSuccess);
    }
  }

  handleDimensionsChange(e) {
    const {width, height} = e.window;
    this.setState({width, height});
  }

  async onGetAmountSuccess(amount) {
    const {newAmount} = this.state;
    if (newAmount !== amount.toString() && !isNaN(parseInt(amount, 10))) {
      this.setState({newAmount: amount});
      AsyncStorage.setItem(oldAmountKey, amount.toString());
    }
  }

  onScan({id, name = '', address = '', rssi, platform, typeScan}) {
    const logs = this.logs;
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
        // typeList = logs[i].type;
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

  watchScan() {
    this.props.navigation.navigate('WatchScan', {logs: [...this.logs]});
  }

  watchHistory() {
    this.props.navigation.navigate('HistoryScan');
  }

  onChangeBlue = blueTooth => {
    this.setState({blueTooth: blueTooth});
  };

  considerNotify(timesOpenApp, firstTimeOpen) {
    const notifys = configuration.Notifications;
    if (notifys.length === 0) {
      return;
    }

    for (let i = 0; i < notifys.length; i++) {
      const openModal = hasModalNotify(notifys[i], timesOpenApp, firstTimeOpen);
      if (openModal) {
        this.setState({
          showModalInvite: true,
          titleModal: notifys[i].title,
          messageModal: notifys[i].message || textDefault.message,
          buttonText: notifys[i].buttonText || textDefault.buttonText,
        });
        return;
      }
    }
  }

  onInvite = () => {
    this.props.navigation.jumpTo('Invite');
    this.setState({showModalInvite: false});
  };

  render() {
    const {
      countShield,
      width,
      blueTooth,
      height,
      newAmount,
      showModalInvite,
      titleModal,
      messageModal,
      buttonText,
      // showModalWrite,
    } = this.state;
    console.log(showModalInvite);
    // const currentVersion = DeviceInfo.getVersion();
    return (
      <View style={style.container}>
        <StatusBar hidden={true} />
        <ScrollView
          style={style.background}
          contentContainerStyle={style.scrollView}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require('./styles/images/Banner.png')}
            style={{width: width, height: height / setHeight1}}>
            {/*<Text style={style.textBeta}>{currentVersion}</Text>*/}
            <View style={[style.header, {paddingTop: height / setHeight}]}>
              <Text style={style.textHeader}>
                Bảo vệ mình, bảo vệ cộng đồng
              </Text>
              <Text style={style.texthea}>
                Ứng dụng cảnh báo nếu bạn đã tiếp xúc gần
              </Text>
              <Text style={style.texthea}>
                <Text>người nhiễm </Text>
                <MediumText style={style.colorText}>COVID-19</MediumText>
              </Text>
            </View>
          </ImageBackground>
          <View style={style.watchScan}>
            <TouchableOpacity
              onPress={this.watchScan}
              style={[style.numberBluezone, style.marginRight23]}>
              <Text style={style.textBlueNumber}>
                {blueTooth ? countShield : '_'}
              </Text>
              <Text style={style.textBlue}>Bluezoner</Text>
              <Text style={style.textBlue}>quanh bạn</Text>
            </TouchableOpacity>
            <View style={style.numberBluezone}>
              <NumberAnimate amount={newAmount} />
              <Text style={style.textBlue}>Cộng đồng</Text>
              <Text style={style.textBlue}>Bluezoner</Text>
            </View>
          </View>
          <View style={[style.button, {height: height / setHeight}]}>
            <ButtonIconText
              onPress={this.watchScan}
              text={'Quét xung quanh'}
              source={require('./styles/images/icon_scan.png')}
              styleBtn={style.buttonScan}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={style.buttonIcon}
            />
            <ButtonIconText
              onPress={this.watchHistory}
              text={' Lịch sử tiếp xúc '}
              source={require('./styles/images/icon_history.png')}
              styleBtn={style.buttonHistory}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={style.buttonIcon}
            />
          </View>
        </ScrollView>
        <ModalNotify onChangeBlue={this.onChangeBlue} />
        <Modal
          isVisible={showModalInvite}
          style={style.modal}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}>
          <View style={styles.container}>
            <View style={styles.textDiv}>
              {titleModal && (
                <MediumText style={styles.textTitle}>{titleModal}</MediumText>
              )}
              <Text style={style.center}>{messageModal}</Text>
            </View>
            <ButtonText
              text={buttonText}
              onPress={this.onInvite}
              styleBtn={style.buttonInvite}
              styleText={style.textInvite}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

HomeTab.defaultProps = {};

export default HomeTab;
