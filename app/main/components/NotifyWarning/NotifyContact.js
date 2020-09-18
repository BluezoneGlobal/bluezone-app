/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 19:28
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
import FastImage from 'react-native-fast-image';

// Components
import {View, TouchableOpacity, Linking, Dimensions} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import FormInput from '../Declaration/components/Form';

// Api
import {
  retryDeclaration,
  retryUploadHistoryF12,
} from '../../../core/apis/bluezone';
import {DeclareInformation} from '../../../core/apis/errorCode';

// Core
import Service from '../../../core/apis/service';
import {readNotification} from '../../../core/announcement';
import configuration, {syncTokenFirebase} from '../../../configuration';
import {getTokenForDeclaration} from '../../../core/storage';

// Language
import verifyOtp from '../../../core/msg/verifyOtp';
import warning from '../../../core/msg/warning';
import register from '../../../core/msg/register';

// Styles
import * as fontSize from '../../../core/fontSize';
import styles from './styles/index.css';
import {
  ButtonClose,
  ButtonConfirm,
} from '../../../base/components/ButtonText/ButtonModal';
import ModalBase from '../../../base/components/ModalBase';

const visibleModal = {
  isVisiblePhoneValid: false,
  isVisibleStringValidation: false,
  isVisibleDeclareSuccess: false,
  isVisibleDeclareError: false,
  isVisibleSendHistoryError: false,
};

class NotifyContact extends React.Component {
  constructor(props) {
    super(props);
    let _state = {};
    Object.assign(_state, visibleModal, {
      codeString: '',
      level: props.notifyObj.data.TypeSubjectFind,
    });
    this.state = _state;
    this.notifyId = props.notifyObj.notifyId;

    this.getTextByLevel = this.getTextByLevel.bind(this);
    this.onPress = this.onPress.bind(this);
    this.setStatusInfo = this.setStatusInfo.bind(this);
    this.onDeclare = this.onDeclare.bind(this);
    this.declarationSuccess = this.declarationSuccess.bind(this);
    this.declarationError = this.declarationError.bind(this);
    this.errorDeclaration = this.errorDeclaration.bind(this);
    this.onUploadHistory = this.onUploadHistory.bind(this);
    this.errorUploadHistoryF12 = this.errorUploadHistoryF12.bind(this);
    this.uploadHistoryFail = this.uploadHistoryFail.bind(this);
    this.handleOpenDeclare = this.handleOpenDeclare.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleInfo = this.handleInfo.bind(this);
    this.onResetModal = this.onResetModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  getTextByLevel(level) {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return formatMessage(warning.lableF);
  }

  async onPress(phoneNumber, name, address, uploadHistory) {
    const vnf_regex = /^[\+]?[0-9]{9,15}\b/g;
    if (!vnf_regex.test(phoneNumber)) {
      this.setState({isVisiblePhoneValid: true});
      return;
    }

    if (this.state.statusInfo === 'waiting') {
      return;
    }
    this.setStatusInfo('waiting');
    this.phoneNumber = phoneNumber;
    this.name = name;
    this.address = address;
    if (uploadHistory) {
      this.onUploadHistory(() => {
        this.onDeclare(phoneNumber, name, address);
      }, this.uploadHistoryFail);
    } else {
      this.onDeclare(phoneNumber, name, address);
    }
  }

  setStatusInfo(status, callback) {
    this.setState({statusInfo: status}, callback);
  }

  async onDeclare(phoneNumber, name, address) {
    const {intl, notifyObj} = this.props;
    const {formatMessage} = intl;
    const notifyId = notifyObj.notifyId;
    const token = await getTokenForDeclaration();
    if (!token) {
      this.setState({statusInfo: 'error', isVisibleStringValidation: true});
      return;
    }
    const InfoJson = {
      PhoneNumber: phoneNumber,
      FullName: name,
      Address: address,
    };
    const bluezoneInfo = await Service.getBluezoneIdInfo(
      notifyObj.data.Numberdays,
    );
    this.InfoJson = InfoJson;
    this.bluezoneInfo = bluezoneInfo;
    this.token = token;
    this.notifyId = notifyId;
    syncTokenFirebase(async () => {
      await retryDeclaration(
        notifyId,
        bluezoneInfo,
        token,
        JSON.stringify(InfoJson),
        this.declarationSuccess,
        this.declarationError,
      );
    }, this.declarationError);
  }

  declarationSuccess() {
    const {notifyObj, onBack} = this.props;
    this.setState({statusInfo: 'success', isVisibleDeclareSuccess: true});

    if (!notifyObj.data) {
      notifyObj.data = {
        FindGUID: this.notifyId,
      };
    }

    readNotification(this.notifyId);

    onBack();
  }

  declarationError(response) {
    const Status = response.data.Status || '0';
    this.errorDeclaration(Status);
  }

  errorDeclaration = codeString => {
    this.setState({
      statusInfo: 'error',
      codeString: codeString,
      isVisibleDeclareError: true,
    });
  };

  onUploadHistory(success, failure) {
    const {notifyObj} = this.props;
    const notifyId = notifyObj.notifyId;
    syncTokenFirebase(async () => {
      retryUploadHistoryF12(notifyObj.data.Numberdays, notifyId, success, failure);
    }, failure);
  }

  errorUploadHistoryF12(codeString) {
    this.setState({
      statusInfo: 'error',
      codeString: codeString,
      isVisibleSendHistoryError: true,
    });
  }

  uploadHistoryFail(response) {
    const Status = response.body.Status || '0';

    if (
      Status === DeclareInformation.TOKEN_FIREBASE_KHONG_HOP_LE &&
      !this.tryAgainUpload
    ) {
      this.tryAgainUpload = true;
      this.onUploadHistory(() => {
        this.onDeclare(this.phoneNumber, this.name, this.address);
      }, this.uploadHistoryFail);
    } else {
      this.errorUploadHistoryF12(Status);
    }
  }

  handleOpenDeclare() {
    const SupportUrl = configuration.SupportUrl;
    if (!SupportUrl) {
      return;
    }

    Linking.canOpenURL(SupportUrl).then(supported => {
      if (supported) {
        Linking.openURL(SupportUrl);
        return false;
      }
    });
  }

  handleCall() {
    const SupportPhoneNumber = configuration.SupportPhoneNumber;
    if (!SupportPhoneNumber) {
      return;
    }

    Linking.canOpenURL(SupportPhoneNumber).then(supported => {
      if (supported) {
        Linking.openURL(`tel:${SupportPhoneNumber}`);
        return false;
      }
    });
  }

  handleMessage() {
    const SupportPhoneNumber = configuration.SupportPhoneNumber;
    if (!SupportPhoneNumber) {
      return;
    }

    Linking.canOpenURL(SupportPhoneNumber).then(supported => {
      if (supported) {
        Linking.openURL(`sms:${SupportPhoneNumber}`);
        return false;
      }
    });
  }

  handleInfo() {
    Linking.openURL('https://www.bluezone.gov.vn/');
  }

  onResetModal(callback) {
    this.setState(visibleModal, callback);
  }

  onCloseModal() {
    this.onResetModal();
  }

  renderModal() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {
      codeString,
      isVisiblePhoneValid,
      isVisibleStringValidation,
      isVisibleDeclareSuccess,
      isVisibleDeclareError,
      isVisibleSendHistoryError,
    } = this.state;
    return (
      <>
        {/* Số điện thoại không hợp lệ */}
        <ModalBase
          isVisibleModal={isVisiblePhoneValid}
          title={formatMessage(register.errorTitle)}
          description={formatMessage(register.phoneEnterNotValid)}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(verifyOtp.dong)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Lỗi không tìm thấy chuỗi xác thực */}
        <ModalBase
          isVisibleModal={isVisibleStringValidation}
          title={formatMessage(warning.titleDeclareErrorToken)}
          description={formatMessage(warning.declareErrorToken)}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(verifyOtp.dong)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Khai báo thành công */}
        <ModalBase
          isVisibleModal={isVisibleDeclareSuccess}
          title={formatMessage(warning.titleDeclareSuccess)}
          description={formatMessage(warning.declareSuccess)}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(verifyOtp.dong)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Khai báo thất bại */}
        <ModalBase
          isVisibleModal={isVisibleDeclareError}
          title={formatMessage(warning.titleDeclareError)}
          description={`${formatMessage(
            warning.declareSError,
          )}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(verifyOtp.dong)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Có lỗi xảy ra khi thực hiện Gửi lịch sử tiếp xúc. */}
        <ModalBase
          isVisibleModal={isVisibleSendHistoryError}
          title={formatMessage(verifyOtp.titleSendHistoryError)}
          description={`${formatMessage(
            verifyOtp.sendHistoryError,
          )}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(verifyOtp.agree)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>
      </>
    );
  }

  render() {
    const {intl, notifyObj} = this.props;
    const {statusInfo, level} = this.state;
    const {formatMessage} = intl;
    const {language} = this.context;
    const {height} = Dimensions.get('window');
    const bigText =
      (language === 'vi' ? notifyObj.bigText : notifyObj.bigTextEn) ||
      formatMessage(warning.doubtTutorial);
    return (
      <View>
        <View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgba(255, 162, 0, 0.15)',
              borderRadius: 11,
              paddingHorizontal: 17,
              paddingVertical: 18,
              marginTop: 20,
              marginBottom: 15,
            }}>
            <FastImage
              style={{
                width: 58,
                height: 59,
              }}
              source={require('./styles/images/waring.png')}
            />
            <View
              style={{
                alignItems: 'center',
                paddingLeft: 15,
                flex: 1,
              }}>
              <MediumText
                style={{
                  fontSize: fontSize.fontSize16,
                }}>
                {this.getTextByLevel(level)}
              </MediumText>
            </View>
          </View>
          <Text
            style={{
              fontSize: fontSize.normal,
              lineHeight: 25,
            }}>
            {bigText}
          </Text>
          {/*<Text*/}
          {/*  style={{*/}
          {/*    fontSize: fontSize.normal,*/}
          {/*    lineHeight: 25,*/}
          {/*  }}>*/}
          {/*  {bigText}*/}
          {/*</Text>*/}
          {/*<Text*/}
          {/*  style={{*/}
          {/*    fontSize: fontSize.normal,*/}
          {/*    lineHeight: 25,*/}
          {/*  }}>*/}
          {/*  {bigText}*/}
          {/*</Text>*/}
          <FormInput
            statusInfo={statusInfo}
            notifyObj={notifyObj}
            onSubmit={this.onPress}
          />
        </View>
        <View style={{alignItems: 'center', marginBottom: 0.046 * height}}>
          <Text style={{fontSize: fontSize.small, color: '#2b77d8'}}>
            {formatMessage(warning.contact)}
          </Text>
          <View
            style={{
              justifyContent: 'space-around',
              flexDirection: 'row',
              paddingVertical: 18,
            }}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingHorizontal: 20}}
              onPress={this.handleOpenDeclare}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_add.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.declaration)}
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignItems: 'center', marginHorizontal: 20}}
              onPress={this.handleCall}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_phone.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.call)}
              </MediumText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignItems: 'center', marginHorizontal: 20}}
              onPress={this.handleMessage}>
              <FastImage
                style={{
                  width: 34,
                  height: 34,
                }}
                source={require('./styles/images/icon_chat.png')}
              />
              <MediumText
                style={{
                  fontSize: fontSize.smallest,
                  color: '#585858',
                  marginTop: 6,
                }}>
                {formatMessage(warning.message)}
              </MediumText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.handleInfo}>
            <Text
              style={{
                fontSize: fontSize.smallest,
                color: '#2b77d8',
                textDecorationLine: 'underline',
              }}>
              {formatMessage(warning.information)}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
      </View>
    );
  }
}

NotifyContact.propTypes = {
  intl: intlShape.isRequired,
};

NotifyContact.defaultProps = {};

NotifyContact.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(NotifyContact);
