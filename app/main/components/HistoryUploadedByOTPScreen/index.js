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
import {SafeAreaView, View, TextInput, Keyboard, Animated} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import Text from '../../../base/components/Text';
import ModalBase from '../../../base/components/ModalBase';
import {
  ButtonConfirm,
  ButtonClose,
} from '../../../base/components/ButtonText/ButtonModal';

// Utils
import message from '../../../core/msg/verifyOtp';

// Api
import {uploadHistoryF01ByOTP} from '../../../core/apis/bluezone';
import {ReportHistoryConfirmDeclareErrorCode} from '../../../core/apis/errorCode';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import {syncTokenFirebase} from '../../../configuration';

const visibleModal = {
  isVisibleHistorySuccess: false,
  isVisibleOTPInvalid: false,
  isVisibleOTPExpired: false,
  isVisibleHistoryError: false,
};

class HistoryUploadedByOTPScreen extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    const _state = {};
    Object.assign(_state, visibleModal, {
      disabled: true,
      otp: '',
      statusUpload: null,
      codeString: '',
    });
    this.state = _state;
    this.keyboardHeight = new Animated.Value(0);

    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
    this.stopUpload = this.stopUpload.bind(this);
    this.uploadHistory = this.uploadHistory.bind(this);
    this.uploadHistorySuccess = this.uploadHistorySuccess.bind(this);
    this.uploadHistoryFailure = this.uploadHistoryFailure.bind(this);
    this.alertOTPInvalid = this.alertOTPInvalid.bind(this);
    this.alertOTPExpired = this.alertOTPExpired.bind(this);
    this.errorSendHistory = this.errorSendHistory.bind(this);
    this.onResetModal = this.onResetModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onCloseModalHistorySuccess = this.onCloseModalHistorySuccess.bind(
      this,
    );
  }

  componentDidMount() {
    this.ref.focus();
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
    Animated.timing(this.keyboardHeight, {
      duration: 50,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardDidHide(event) {
    Animated.timing(this.keyboardHeight, {
      duration: 50,
      toValue: 0,
    }).start();
  }

  onChangeText(value) {
    this.setState({otp: value, disabled: !(value.length === 6)});
  }

  async onConfirmPress() {
    const {statusUpload} = this.state;

    if (statusUpload === 'waiting') {
      return;
    }

    this.setState({
      statusUpload: 'waiting',
    });

    syncTokenFirebase(this.uploadHistory, this.uploadHistory);
  }

  stopUpload(callback) {
    this.setState({statusUpload: 'error'}, callback);
  }

  async uploadHistory() {
    const {otp} = this.state;
    uploadHistoryF01ByOTP(
      null,
      otp,
      data => {
        this.uploadHistorySuccess(data);
      },
      err => {
        this.uploadHistoryFailure(err);
      },
    );
  }

  uploadHistorySuccess() {
    this.setState({
      statusUpload: 'success',
      isVisibleHistorySuccess: true,
    });
  }

  async uploadHistoryFailure(response) {
    const {data} = response;
    const Status = data.Status;

    if (
      Status &&
      Status === ReportHistoryConfirmDeclareErrorCode.OTP_KHONG_HOP_LE
    ) {
      this.stopUpload(() => {
        this.alertOTPInvalid(Status);
      });
      return;
    }

    if (Status && Status === ReportHistoryConfirmDeclareErrorCode.OTP_HET_HAN) {
      this.stopUpload(() => {
        this.alertOTPExpired(Status);
      });
      return;
    }

    if (
      Status &&
      Status ===
        ReportHistoryConfirmDeclareErrorCode.TOKEN_FIREBASE_KHONG_HOP_LE &&
      !this.isTryAgain
    ) {
      this.isTryAgain = true;
      await this.uploadHistory();
      return;
    }

    this.errorSendHistory(Status);
  }

  alertOTPInvalid(Status) {
    this.setState({isVisibleOTPInvalid: true, codeString: Status});
  }

  alertOTPExpired(Status) {
    this.setState({isVisibleOTPExpired: true, codeString: Status});
  }

  errorSendHistory(Status) {
    this.setState({
      statusUpload: 'error',
      isVisibleHistoryError: true,
      codeString: Status,
    });
  }

  onResetModal(callback) {
    this.setState(visibleModal, callback);
  }

  onCloseModal() {
    this.onResetModal();
  }

  onCloseModalHistorySuccess() {
    this.onResetModal(() => {
      setTimeout(() => {
        this.props.navigation.goBack();
        return true;
      }, 200);
    });
  }

  renderModal() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {
      codeString,
      isVisibleHistorySuccess,
      isVisibleOTPInvalid,
      isVisibleOTPExpired,
      isVisibleHistoryError,
    } = this.state;
    return (
      <>
        {/* Gửi lịch sử thành công */}
        <ModalBase
          isVisibleModal={isVisibleHistorySuccess}
          title={formatMessage(message.titleSendHistorySuccess)}
          description={formatMessage(message.sendHistorySuccess)}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(message.dong)}
              onPress={this.onCloseModalHistorySuccess}
            />
          </View>
        </ModalBase>

        {/* Nhập mã OTP không đúng */}
        <ModalBase
          isVisibleModal={isVisibleOTPInvalid}
          title={formatMessage(message.titleSendHistoryError)}
          description={`${formatMessage(message.otpIncorrect)}`}>
          <View style={styles.modalFooter}>
            <ButtonConfirm
              text={formatMessage(message.retype)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Nhập mã OTP hết hạn */}
        <ModalBase
          isVisibleModal={isVisibleOTPExpired}
          title={formatMessage(message.titleSendHistoryError)}
          description={`${formatMessage(message.otpExpired)}`}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(message.dong)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>

        {/* Có lỗi xảy ra */}
        <ModalBase
          isVisibleModal={isVisibleHistoryError}
          title={formatMessage(message.titleSendHistoryError)}
          description={`${formatMessage(
            message.sendHistoryError,
          )}[${codeString}]`}>
          <View style={styles.modalFooter}>
            <ButtonClose
              text={formatMessage(message.agree)}
              onPress={this.onCloseModal}
            />
          </View>
        </ModalBase>
      </>
    );
  }

  render() {
    const {intl} = this.props;
    const {disabled, statusUpload} = this.state;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={formatMessage(message.titleSendHistory)}
          styleHeader={styles.header}
          styleTitle={styles.title}
        />
        <Animated.View
          style={{
            flex: 1,
            // paddingBottom: this.keyboardHeight,
          }}>
          <Text style={styles.labelSendHistory}>
            {formatMessage(message.labelOPTSendHistory)}
          </Text>
          <TextInput
            ref={ref => (this.ref = ref)}
            autoFocus={true}
            style={styles.inputOTPMax}
            maxLength={6}
            allowFontScaling={false}
            placeholder={formatMessage(message.pleaseEnterYourPhone)}
            keyboardType={'number-pad'}
            placeholderTextColor={'#b5b5b5'}
            onChangeText={this.onChangeText}
          />
          <View style={styles.buttonConfirm}>
            <ButtonIconText
              disabled={statusUpload === 'waiting' || disabled}
              onPress={this.onConfirmPress}
              text={
                statusUpload !== 'waiting'
                  ? formatMessage(message.confirmHistory)
                  : formatMessage(message.sendingHistory)
              }
              styleBtn={[
                statusUpload === 'waiting' || disabled
                  ? styles.btnConfim
                  : styles.colorButtonConfirm,
              ]}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.iconButtonConfirm}
            />
          </View>
        </Animated.View>
        {this.renderModal()}
      </SafeAreaView>
    );
  }
}

HistoryUploadedByOTPScreen.defaultProps = {
  disabled: true,
};

HistoryUploadedByOTPScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(HistoryUploadedByOTPScreen);
