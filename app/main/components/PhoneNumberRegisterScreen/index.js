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
import {injectIntl, intlShape} from 'react-intl';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';

// Components
import ButtonIconText from '../../../base/components/ButtonIconText';
import {
  ButtonConfirm,
  ButtonClose,
} from '../../../base/components/ButtonText/ButtonModal';
import Text from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';
import ModalBase from '../../../base/components/ModalBase';
import Header from '../../../base/components/Header';

// Apis
import {CreateAndSendOTPCode} from '../../../core/apis/bluezone';
import {CreateAndSendOTPCodeErrorCode} from '../../../core/apis/errorCode';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import message from '../../../core/msg/register';
import configuration from '../../../configuration';
import {creatScheduleRegisterNotification} from '../../../core/notifyScheduler';
import {blue_bluezone} from '../../../core/color';

const TIMEOUT_LOADING = 800;
const PHONE_NUMBER_REGEX = /^[\+]?[0-9]{9,15}\b/;

const visibleModal = {
  isProcessing: false,
  isVisibleRegisterError: false,
  isVisibleWrongPhoneNumber: false,
};

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    const _state = {};
    Object.assign(_state, visibleModal, {
      numberPhone: '',
      isSelected: true,
      isShowKeyboard: false,
    });
    this.state = _state;

    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.onRegisterPress = this.onRegisterPress.bind(this);
    this.stopProcessing = this.stopProcessing.bind(this);
    this.createAndSendOTPCode = this.createAndSendOTPCode.bind(this);
    this.createAndSendOTPCodeSuccess = this.createAndSendOTPCodeSuccess.bind(
      this,
    );
    this.createAndSendOTPCodeFailure = this.createAndSendOTPCodeFailure.bind(
      this,
    );
    this.alertFailure = this.alertFailure.bind(this);
    this.alertWrongPhoneNumber = this.alertWrongPhoneNumber.bind(this);
    this.alertRegisterPhoneNumberFailure = this.alertRegisterPhoneNumberFailure.bind(
      this,
    );
    this.onCloseScreenPress = this.onCloseScreenPress.bind(this);
    this.doFinishedWorks = this.doFinishedWorks.bind(this);
    this.onCloseAlertWrongPhoneNumberPress = this.onCloseAlertWrongPhoneNumberPress.bind(
      this,
    );
    this.onResetModal = this.onResetModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onChangCheckBox = this.onChangCheckBox.bind(this);
    this.onLinkingRules = this.onLinkingRules.bind(this);
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardDidShow(event) {
    this.setState({isShowKeyboard: true});
  }

  keyboardDidHide(event) {
    this.setState({isShowKeyboard: false});
  }

  doFinishedWorks(gotoMainScreen) {
    const {onFinished, name} = this.props;
    const {numberPhone} = this.state;

    // Trường hợp theo wizard
    if (onFinished) {
      onFinished(name, {phoneNumber: numberPhone}, gotoMainScreen);
      return;
    }

    if (gotoMainScreen) {
      this.props.navigation.goBack();
      return true;
    }

    this.props.navigation.replace('PhoneNumberVerifyOTPScreen', {
      phoneNumber: numberPhone,
    });
  }

  onPhoneNumberChange(value) {
    this.setState({numberPhone: value});
  }

  onCloseAlertWrongPhoneNumberPress() {
    this.onResetModal(() => {
      this.phoneNumberRef && this.phoneNumberRef.focus();
    });
    // TODO: Xu ly boi chon toan bo so dien thoai
  }

  onRegisterPress() {
    const {numberPhone} = this.state;
    if (PHONE_NUMBER_REGEX.test(numberPhone) === false) {
      this.alertWrongPhoneNumber();
    } else {
      this.setState(
        {isProcessing: true, isVisibleRegisterError: false},
        this.createAndSendOTPCode,
      );
    }
  }

  stopProcessing(callback) {
    this.setState({isProcessing: false}, callback);
  }

  createAndSendOTPCode() {
    const {numberPhone} = this.state;
    const {TokenFirebase} = configuration;

    CreateAndSendOTPCode(
      numberPhone,
      TokenFirebase,
      this.createAndSendOTPCodeSuccess,
      this.createAndSendOTPCodeFailure,
    );
  }

  createAndSendOTPCodeSuccess() {
    this.stopProcessing(() =>
      setTimeout(() => this.doFinishedWorks(false), TIMEOUT_LOADING),
    );
  }

  createAndSendOTPCodeFailure(response) {
    const Status = response?.data?.Status || '0';
    this.alertFailure(Status);
  }

  alertFailure(Status) {
    this.stopProcessing(() => {
      if (Status === CreateAndSendOTPCodeErrorCode.SO_DIEN_THOAI_KHONG_HOP_LE) {
        setTimeout(() => this.alertWrongPhoneNumber(Status), TIMEOUT_LOADING);
      } else {
        setTimeout(
          () => this.alertRegisterPhoneNumberFailure(Status),
          TIMEOUT_LOADING,
        );
      }
    });
  }

  alertWrongPhoneNumber(Status = '') {
    this.setState({isVisibleWrongPhoneNumber: true, codeString: Status});
  }

  alertRegisterPhoneNumberFailure(Status) {
    this.setState({isVisibleRegisterError: true, codeString: Status});
  }

  onCloseScreenPress() {
    // Lần đầu đăng ký token firebase thành công, vào màn hình đăng ký số điện thoại
    creatScheduleRegisterNotification();

    // Hoan thanh cong viec cua screen nay
    this.doFinishedWorks(true);
  }

  setPhoneNumberInputRef = element => {
    this.phoneNumberRef = element;
  };

  onResetModal(callback) {
    this.setState(visibleModal, callback);
  }

  onCloseModal() {
    this.onResetModal();
  }

  onChangCheckBox() {
    const {isSelected} = this.state;
    this.setState({isSelected: !isSelected});
  }

  onLinkingRules() {
    const {LinkRulesEn, LinkRulesVi, Language} = configuration;
    const LinkRules = Language === 'vi' ? LinkRulesVi : LinkRulesEn;
    if (!LinkRules) {
      return;
    }

    Linking.canOpenURL(LinkRules).then(supported => {
      if (supported) {
        Linking.openURL(LinkRules);
        return false;
      }
    });
  }

  renderModal() {
    const {
      isProcessing,
      isVisibleRegisterError,
      isVisibleWrongPhoneNumber,
      codeString,
    } = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <>
        <Modal isVisible={isProcessing} style={styles.center}>
          <ActivityIndicator size="large" color={'#ffffff'} />
        </Modal>
        <ModalBase
          isVisibleModal={isVisibleRegisterError}
          title={`${formatMessage(message.error)}`}
          description={`${formatMessage(message.redo)}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(message.skip)}
              onPress={this.onCloseModal}
            />
            <ButtonConfirm
              text={formatMessage(message.try)}
              onPress={this.onRegisterPress}
            />
          </View>
        </ModalBase>
        <ModalBase
          isVisibleModal={isVisibleWrongPhoneNumber}
          title={formatMessage(message.errorTitle)}
          description={`${formatMessage(
            message.phoneEnterNotValid,
          )}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(message.btnTryAgain)}
              onPress={this.onCloseAlertWrongPhoneNumberPress}
            />
          </View>
        </ModalBase>
      </>
    );
  }

  render() {
    const {intl} = this.props;
    const {numberPhone, isSelected, isShowKeyboard} = this.state;
    const {formatMessage} = intl;
    const disabled = numberPhone.length === 0;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Header
            title={formatMessage(message.titleHeader)}
            styleHeader={styles.header}
            colorIcon={blue_bluezone}
            styleTitle={{
              color: blue_bluezone,
              fontSize: fontSize.bigger,
            }}
            showBack={false}
          />
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            onLayout={() => {
              this.scrollView.scrollToEnd({animated: true});
            }}>
            <View style={[styles.layout1]}>
              <Text style={styles.text2}>{formatMessage(message.title)}</Text>
            </View>
            <View style={[styles.phone]}>
              <TextInput
                ref={this.setPhoneNumberInputRef}
                autoFocus={true}
                keyboardType={'phone-pad'}
                maxLength={15}
                style={[styles.textInput]}
                placeholderTextColor={'#b5b5b5'}
                allowFontScaling={false}
                placeholder={formatMessage(message.pleaseEnterYourPhone)}
                onChangeText={this.onPhoneNumberChange}
              />
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  onValueChange={this.onChangCheckBox}
                  style={styles.checkbox}
                  boxType={'square'}
                  lineWidth={true}
                  onCheckColor={'#015cd0'}
                  onTintColor={'#707070'}
                />
                <Text style={styles.textCheckBox}>
                  {formatMessage(message.textCheckbox1)}
                  <Text
                    style={styles.textCheckbox2}
                    onPress={this.onLinkingRules}>
                    {formatMessage(message.textCheckbox2)}
                  </Text>
                  {formatMessage(message.textCheckbox3)}
                </Text>
              </View>
            </View>
            <ButtonIconText
              disabled={disabled || !isSelected}
              onPress={this.onRegisterPress}
              text={formatMessage(message.next)}
              styleBtn={[
                styles.btnNext,
                disabled || !isSelected
                  ? styles.buttonDisable
                  : styles.buttonActive,
              ]}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.buttonIcon}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <ButtonText
          text={`${formatMessage(message.skip)}`}
          onPress={this.onCloseScreenPress}
          styleBtn={[styles.buttonInvite]}
          styleText={styles.textInvite}
        />
        {this.renderModal()}
      </SafeAreaView>
    );
  }
}

RegisterScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
};

RegisterScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(RegisterScreen);
