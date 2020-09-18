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
import {
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

// Components
import ButtonIconText from '../../../base/components/ButtonIconText';
import Text from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';
import Header from '../../../base/components/Header';

// Apis
import {AddDeclareInformation} from '../../../core/apis/bluezone';
import {RegisterInfomation} from '../../../core/apis/errorCode';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import {blue_bluezone} from '../../../core/color';
import configuration from '../../../configuration';

import message from '../../../core/msg/registerInformation';
import Modal from 'react-native-modal';
import {
  ButtonClose,
  ButtonConfirm,
} from '../../../base/components/ButtonText/ButtonModal';
import ModalBase from '../../../base/components/ModalBase';

const visibleModal = {
  isProcessing: false,
  isVisibleWrongFullName: false,
  isVisibleWrongAddress: false,
  isVisibleVerifyError: false,
};

class RegisterInformationScreen extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    let _state = {};
    Object.assign(_state, visibleModal, {
      fullName: '',
      address: '',
      isSelected: true,
      isShowKeyboard: false,
      codeString: '',
    });
    this.state = _state;

    this.onChangeText = this.onChangeText.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onChangeNavigate = this.onChangeNavigate.bind(this);
    this.onChangCheckBox = this.onChangCheckBox.bind(this);
    this.doFinishedWorks = this.doFinishedWorks.bind(this);
    this.onAddDeclareInfoSuccess = this.onAddDeclareInfoSuccess.bind(this);
    this.onAddDeclareInfoError = this.onAddDeclareInfoError.bind(this);
    this.setFullnameRef = this.setFullnameRef.bind(this);
    this.setAddressRef = this.setAddressRef.bind(this);
    this.onCloseAlertWrongFullnamePress = this.onCloseAlertWrongFullnamePress.bind(
      this,
    );
    this.onResetModal = this.onResetModal.bind(this);
    this.onLinkingRules = this.onLinkingRules.bind(this);
  }

  onChangeText(value, name) {
    this.setState({[name]: value});
  }

  doFinishedWorks(gotoMainScreen = false) {
    const {name, onFinished} = this.props;

    // Chạy theo winza
    if (onFinished) {
      onFinished(name, {}, gotoMainScreen);
      return;
    }

    this.props.navigation.goBack();
    return true;
  }

  onPress() {
    const {TokenFirebase, PhoneNumber} = configuration;
    const {fullName, address} = this.state;

    if (fullName.length < 3) {
      this.setState({isVisibleWrongFullName: true});
      return;
    }

    if (address.length === 0) {
      this.setState({isVisibleWrongAddress: true});
      return;
    }

    this.setState({isProcessing: true}, () => {
      AddDeclareInformation(
        PhoneNumber,
        TokenFirebase,
        fullName,
        address,
        this.onAddDeclareInfoSuccess,
        this.onAddDeclareInfoError,
      );
    });
  }

  onAddDeclareInfoSuccess() {
    this.onResetModal(this.doFinishedWorks);
  }

  onAddDeclareInfoError(response) {
    const {data} = response;
    const Status = data.Status || '0';

    if (RegisterInfomation.ADDRESS_KHONG_HOP_LE === Status) {
      this.onResetModalTimeout(() =>
        this.setState({
          isProcessing: false,
          isVisibleWrongAddress: true,
          codeString: Status,
        }),
      );
    } else if (RegisterInfomation.FULLNAME_KHONG_HOP_LE === Status) {
      this.onResetModalTimeout(() =>
        this.setState({
          isProcessing: false,
          isVisibleWrongFullName: true,
          codeString: Status,
        }),
      );
    } else {
      this.onResetModalTimeout(() =>
        this.setState({
          isProcessing: false,
          isVisibleVerifyError: true,
          codeString: Status,
        }),
      );
    }
  }

  onCloseAlertWrongFullnamePress() {
    this.onResetModal(() => {
      this.fullnameRef && this.fullnameRef.focus();
    });
  }

  onCloseAlertWrongAddressPress() {
    this.onResetModal(() => {
      this.addressRef && this.addressRef.focus();
    });
  }

  onResetModalTimeout = callback => {
    this.setState(visibleModal, () => {
      setTimeout(callback, 800);
    });
  };

  onResetModal(callback) {
    this.setState(visibleModal, callback);
  }

  onCloseModal() {
    this.onResetModal();
  }

  onChangeNavigate() {
    this.doFinishedWorks(true);
  }

  onChangCheckBox() {
    const {isSelected} = this.state;
    this.setState({isSelected: !isSelected});
  }

  setFullnameRef(ref) {
    this.fullnameRef = ref;
  }

  setAddressRef(ref) {
    this.addressRef = ref;
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
    const {intl} = this.props;
    const {
      codeString,
      isProcessing,
      isVisibleWrongFullName,
      isVisibleWrongAddress,
      isVisibleVerifyError,
    } = this.state;
    const {formatMessage} = intl;

    return (
      <>
        <Modal isVisible={isProcessing} style={styles.center}>
          <ActivityIndicator size="large" color={'#ffffff'} />
        </Modal>

        {/* Fullname bạnnhập không hợp lệ*/}
        <ModalBase
          isVisibleModal={isVisibleWrongFullName}
          title={formatMessage(message.errorTitle)}
          description={`${formatMessage(message.fullNameEnterNotValid)}`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(message.btnTryAgain)}
              onPress={this.onCloseAlertWrongFullnamePress}
            />
          </View>
        </ModalBase>

        {/* Địa chỉ nhập không hợp lệ */}
        <ModalBase
          isVisibleModal={isVisibleWrongAddress}
          title={formatMessage(message.errorTitle)}
          description={`${formatMessage(message.addressEnterNotValid)}`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(message.btnTryAgain)}
              onPress={this.onCloseAlertWrongAddressPress}
            />
          </View>
        </ModalBase>

        <ModalBase
          isVisibleModal={isVisibleVerifyError}
          title={`${formatMessage(message.error)}`}
          description={`${formatMessage(message.redo)}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(message.close)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>
      </>
    );
  }

  render() {
    const {intl} = this.props;
    const {fullName, address, isSelected} = this.state;
    const {formatMessage} = intl;
    const disabled = !(fullName && address);
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
              <Text style={styles.title}>{formatMessage(message.title)}</Text>
            </View>
            <View style={[styles.phone]}>
              <TextInput
                ref={this.setFullnameRef}
                autoFocus={true}
                style={[styles.textInput]}
                placeholderTextColor={'#b5b5b5'}
                allowFontScaling={false}
                placeholder={formatMessage(message.fullName)}
                onChangeText={value => this.onChangeText(value, 'fullName')}
              />
              <TextInput
                ref={this.setAddressRef}
                style={[styles.textInput]}
                placeholderTextColor={'#b5b5b5'}
                allowFontScaling={false}
                placeholder={formatMessage(message.address)}
                onChangeText={value => this.onChangeText(value, 'address')}
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
              onPress={this.onPress}
              text={formatMessage(message.send)}
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
          onPress={this.onChangeNavigate}
          styleText={styles.textInvite}
          styleBtn={styles.buttonInvite}
        />
        {this.renderModal()}
      </SafeAreaView>
    );
  }
}

RegisterInformationScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(RegisterInformationScreen);
