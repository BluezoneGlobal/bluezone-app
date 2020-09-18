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
import {View, StatusBar, AppState} from 'react-native';
import * as PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import {injectIntl, intlShape} from 'react-intl';

// Language
import message from '../../../core/msg/home';
import messageWarning from '../../../core/msg/warning';

// Components
import ModalNotify from './components/ModalNotify';
import Text, {MediumText, ThinText} from '../../../base/components/Text';
import Radar from './components/Radar';
import SwitchLanguage from './components/SwitchLanguage';
import UpdateVersion from '../UpdateVersion';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import style, {HEADER_BACKGROUND_HEIGHT} from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
// Logo
import LogoBluezone from '../../../core/logo/logo_bluezone';
import IconBTT from './styles/images/IconBTT';
import IconBYT from './styles/images/IconBYT';

// Core
import {checkRegisterNotificationOfDay} from '../../../core/notifyScheduler';
import {setStatusNotifyRegister} from '../../../configuration';
import {createNews} from '../../../core/announcement';
import {messageNotifyOTP} from '../../../core/data';
// import Home from "../MainScreen";

const modalStatusDefault = {
  stepSelected: 'updateVersion',
  isUpdateVersion: true,
  isPermission: false,
  isCheckRegisterPhone: false,
};

class HomeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, modalStatusDefault, {
      showModal: false,
      colorCircle: '#000000',
      textF: this.getTextByLevel(),
    });

    this.renderReminderModal = this.renderReminderModal.bind(this);
    this.setModalStatus = this.setModalStatus.bind(this);
    this.setNotifyRegister = this.setNotifyRegister.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.resetModalStatus = this.resetModalStatus.bind(this);
    this.onChangeNavigateIntroduce = this.onChangeNavigateIntroduce.bind(this);
    this.onWatchHistory = this.onWatchHistory.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.timer = setTimeout(() => {
      this.setState({showModal: true});
    }, 1000);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearTimeout(this.timer);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      const {stepSelected} = this.state;
      // if (stepSelected === 'updateVersion') {
      //   debugger;
      //   this.setModalStatus({isPermission: true});
      // }
    }
  }

  getTextByLevel = () => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return formatMessage(messageWarning.lableF);
  };

  setModalStatus(status) {
    let step = {};
    if (status.isPermission) {
      step = {stepSelected: 'isPermission'};
    }

    if (status.isCheckRegisterPhone) {
      step = {stepSelected: 'isCheckRegisterPhone'};
      this.setNotifyRegister();
    }

    // TODO can viet dang callback
    this.setState(Object.assign({}, this.state, status, step));
  }

  resetModalStatus() {
    this.setState(modalStatusDefault);
  }

  setNotifyRegister() {
    const {stepSelected} = this.state;
    const {language} = this.context;

    if (stepSelected === 'isCheckRegisterPhone') {
      return;
    }

    const checkNotify = checkRegisterNotificationOfDay();
    if (!checkNotify) {
      return;
    }

    setStatusNotifyRegister(new Date());
    createNews(messageNotifyOTP(language));
  }

  onChangeNavigateIntroduce() {
    this.props.navigation.navigate('Welcome');
  }

  onWatchHistory() {
    this.props.navigation.navigate('ContactHistory');
  }

  renderReminderModal() {
    const {navigation} = this.props;
    const {isUpdateVersion, isPermission, showModal} = this.state;

    if (!showModal) {
      return null;
    }

    return (
      <>
        {isUpdateVersion && (
          <UpdateVersion
            navigation={navigation}
            setModalStatus={this.setModalStatus}
          />
        )}
        {isPermission && <ModalNotify setModalStatus={this.setModalStatus} />}
      </>
    );
  }

  render() {
    const {intl, navigation} = this.props;
    const {colorCircle, textF} = this.state;
    const {formatMessage} = intl;

    return (
      <View style={style.container}>
        <StatusBar hidden={true} />
        <View style={style.background}>
          <View style={{backgroundColor: '#015cd0'}}>
            <View style={style.switchLanguage}>
              <View style={style.logo}>
                <LogoBluezone width={28.8} height={34.6} />
                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 8.8,
                    paddingRight: 14.6,
                  }}>
                  <MediumText
                    style={{
                      textAlign: 'right',
                      color: '#ffffff',
                      fontSize: fontSize.normal,
                      lineHeight: fontSize.normal * 0.4,
                      paddingTop: fontSize.normal * 0.6,
                    }}>
                    Bluezone{'\n'}
                    <ThinText
                      style={{
                        fontSize: fontSize.tiny,
                        color: '#ffffff',
                        fontWeight: '100',
                      }}>
                      .gov.vn
                    </ThinText>
                  </MediumText>
                </View>
                <View style={style.borderLogo} />
                <View style={{marginHorizontal: 14.6}}>
                  <IconBTT width={30} height={30} />
                </View>
                <View style={style.borderLogo} />
                <View style={{marginLeft: 14.6}}>
                  <IconBYT width={30} height={30} />
                </View>
              </View>
              <SwitchLanguage />
            </View>
            <FastImage
              source={require('./styles/images/Banner.png')}
              style={{height: HEADER_BACKGROUND_HEIGHT}}
              resizeMode={FastImage.resizeMode.contain}
              cacheControl={'immutable'}
            />
            <View style={[style.header]}>
              <Text style={style.textHeader}>
                {formatMessage(message.header)}
              </Text>
              <Text style={style.texthea}>
                {formatMessage(message.productLabel1)}
              </Text>
              <Text style={style.texthea}>
                <Text>{formatMessage(message.productLabel2)}</Text>
                <MediumText style={style.colorText}>
                  {formatMessage(message.productLabel3)}
                </MediumText>
              </Text>
            </View>
          </View>
          <Text style={[style.textF, {color: colorCircle}]} text={textF} />
          <View style={style.watchScan}>
            <Radar navigation={navigation} />
          </View>
          <View style={[style.button]}>
            <ButtonIconText
              onPress={this.onWatchHistory}
              text={formatMessage(message.historyButton)}
              source={require('./styles/images/icon_history.png')}
              styleBtn={style.buttonScan}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={style.buttonIcon}
            />
            <ButtonIconText
              onPress={this.onChangeNavigateIntroduce}
              text={formatMessage(message.utilities)}
              source={require('./styles/images/bluezoner.png')}
              styleBtn={style.buttonHistory}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={style.buttonIcon}
            />
          </View>
        </View>
        {this.renderReminderModal()}
      </View>
    );
  }
}

HomeTab.propTypes = {
  intl: intlShape.isRequired,
};

HomeTab.defaultProps = {};

HomeTab.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(HomeTab);
