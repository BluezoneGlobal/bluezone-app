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
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {Toast} from '@ant-design/react-native';
import {injectIntl, intlShape} from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import CountDown from './CountDown';
import InsertOTP from './InsertOTP';
import {MediumText} from '../../../base/components/Text';

// Utils
import {setToken, setPhoneNumber} from '../../../Configuration';
import * as fontSize from '../../../utils/fontSize';
import {blue_bluezone} from '../../../utils/color';

// Styles
import styles from './styles/index.css';
import ButtonText from '../../../base/components/ButtonText';
import {CreateAndSendOTPCode, VerifyOTPCode} from '../../../apis/bluezone';
import message from '../../../msg/verifyOtp';
import {replaceNotify} from '../../../db/SqliteDb';
import {messageNotifyOTPSuccess} from '../ModalNotify/data';

class VerifyOTPScreen extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      otp: '',
      showModal: false,
      showModalError: false,
      visibleBtnSenOTP: false,
      visibleVerifiSuccess: false,
      showLoading: false,
    };
    this.onChangeNavigate = this.onChangeNavigate.bind(this);
    this.createAndSendOTPCodeSuccess = this.createAndSendOTPCodeSuccess.bind(
      this,
    );
    this.createAndSendOTPCodeFail = this.createAndSendOTPCodeFail.bind(this);
    this.onHandleConfirmSuccess = this.onHandleConfirmSuccess.bind(this);
    this.onHandleConfirmFail = this.onHandleConfirmFail.bind(this);
    this.onVisibleResetOTP = this.onVisibleResetOTP.bind(this);
    this.onChangeNavigateApp = this.onChangeNavigateApp.bind(this);
  }
  onConfirmPress = () => {
    const {otp} = this.state;
    const phoneNumber = this.props.route.params.phoneNumber;
    this.setState(
      {showModalError: false, showModal: false, showLoading: true},
      () => {
        VerifyOTPCode(
          phoneNumber,
          otp,
          this.onHandleConfirmSuccess,
          this.onHandleConfirmFail,
        );
      },
    );
  };

  onHandleConfirmSuccess(response) {
    const {Token, PhoneNumber} = response.data.Object;
    setPhoneNumber(PhoneNumber);
    setToken(Token);
    this.setState({visibleVerifiSuccess: true, showLoading: false});
  }

  onChangeNavigateApp() {
    const {language} = this.context;
    const {setLoading, navigation} = this.props;
    this.setState({visibleVerifiSuccess: false}, () => {
      setLoading ? setLoading('Home') : navigation.goBack();
    });
    replaceNotify(messageNotifyOTPSuccess, language, false);
  }

  onHandleConfirmFail(error) {
    this.setState({showModal: true, showLoading: false});
  }

  onHandleReGetOTP = response => {
    this.refCountDown && this.refCountDown.startCountDown();
  };

  onBack = () => {
    const {setLoading, navigation} = this.props;
    navigation.replace(setLoading ? 'RegisterAuth' : 'Register');
  };

  onChangeText = value => {
    this.setState({otp: value, disabled: !(value.length === 6)});
  };

  onReGetOTP = () => {
    const phoneNumber = this.props.route.params.phoneNumber;
    this.setState({showModal: false, showLoading: true}, () => {
      CreateAndSendOTPCode(
        phoneNumber,
        this.createAndSendOTPCodeSuccess,
        this.createAndSendOTPCodeFail,
      );
    });
  };

  createAndSendOTPCodeSuccess(response) {
    const {numberPhone} = this.state;
    this.setState({showLoading: false});
  }

  createAndSendOTPCodeFail(error) {
    this.setState({showLoading: false, showErrorModal: true});
  }

  onCloseModal = () => {
    this.setState({showModal: false});
  };

  setRef = element => {
    this.refCountDown = element;
  };

  onCloseModalError = () => {
    this.setState({showModalError: false});
  };

  onChangeNavigate() {
    const {setLoading, navigation} = this.props;
    setLoading ? setLoading('Home') : navigation.goBack();
  }

  onVisibleResetOTP() {
    this.setState({visibleBtnSenOTP: true});
  }

  render() {
    const {route, intl} = this.props;
    const {
      showModal,
      showModalError,
      disabled,
      visibleBtnSenOTP,
      visibleVerifiSuccess,
      showLoading,
    } = this.state;
    const {formatMessage} = intl;
    const phoneNumber = route.params.phoneNumber;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          onBack={this.onBack}
          showBack
          title={formatMessage(message.title)}
          styleView={styles.header}
          colorIcon={blue_bluezone}
          styleTitle={{color: blue_bluezone}}
        />
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.layout1}>
            <Text style={styles.text1}>
              {formatMessage(message.enterPin)}{' '}
              <Text style={styles.textPhoneNumber}>{phoneNumber}</Text>
            </Text>
          </View>
          <Text style={styles.text2}>
            {formatMessage(message.pleaseEnterPin)}
          </Text>
          <View style={styles.layout2}>
            <Text style={styles.text3}>{formatMessage(message.validPin)} </Text>
            <CountDown
              ref={this.setRef}
              onVisibleResetOTP={this.onVisibleResetOTP}
            />
          </View>
          {showLoading && (
            <Modal isVisible={showLoading} style={styles.center}>
              <ActivityIndicator size="large" color={'#fff'} />
            </Modal>
          )}
          <TextInput
            autoFocus={true}
            style={styles.inputOTPMax}
            maxLength={6}
            keyboardType={'number-pad'}
            onChangeText={this.onChangeText}
          />
          <View style={styles.buttonConfirm}>
            <ButtonIconText
              disabled={disabled}
              onPress={this.onConfirmPress}
              text={formatMessage(message.confirm)}
              styleBtn={disabled ? styles.btnConfim : styles.colorButtonConfirm}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.iconButtonConfirm}
            />
          </View>

          <View style={styles.layout3}>
            <Text style={styles.text4}>
              {formatMessage(message.receivedOTP)}
            </Text>
            <TouchableOpacity
              disabled={!visibleBtnSenOTP}
              onPress={this.onReGetOTP}
              style={visibleBtnSenOTP ? styles.btnActive : styles.btn}>
              <MediumText
                style={
                  visibleBtnSenOTP
                    ? styles.textSendOTPActive
                    : styles.textSendOTP
                }>
                {formatMessage(message.resetOTP)}
              </MediumText>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showModal && (
          <Modal
            isVisible={showModal}
            style={styles.modalConfirm}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackButtonPress={this.onCloseModal}
            onBackdropPress={this.onCloseModal}>
            <View style={styles.modalCont}>
              <View>
                <Text style={styles.titleModal}>
                  {formatMessage(message.optNotValid)}
                </Text>
              </View>
              <View>
                <Text style={styles.detailModal}>
                  {formatMessage(message.saveOTP)}
                </Text>
              </View>
              <View style={styles.lBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={this.onCloseModal}>
                  <Text style={styles.textBtnSkip}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <Modal
          isVisible={visibleVerifiSuccess}
          style={styles.modalConfirm}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackButtonPress={this.onCloseModal}
          onBackdropPress={this.onCloseModal}>
          <View style={styles.modalCont}>
            <Text style={styles.titleModal}>
              {formatMessage(message.otpsuccess)}
            </Text>
            <View style={styles.lBtnModal}>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={this.onChangeNavigateApp}>
                <Text style={styles.textBtnSkip}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {showModalError && (
          <Modal
            isVisible={showModalError}
            style={styles.center}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackButtonPress={this.onCloseModal}
            onBackdropPress={this.onCloseModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalContentText01}>Đã xảy ra sự cố</Text>
              <Text style={styles.modalContentText02}>
                Vui lòng thao tác lại để sử dụng dịch vụ
              </Text>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.buttonContinued}
                  onPress={this.onCloseModal}>
                  <Text style={styles.textButtonSkip}>Bỏ qua</Text>
                </TouchableOpacity>
                <View style={styles.borderBtn} />
                <TouchableOpacity
                  style={styles.buttonContinued}
                  onPress={this.onConfirmPress}>
                  <Text style={styles.textButtonContinued}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        <ButtonText
          text={`${formatMessage(message.skip)} >>`}
          onPress={this.onChangeNavigate}
          styleBtn={styles.buttonInvite}
          styleText={styles.textInvite}
        />
      </SafeAreaView>
    );
  }
}

VerifyOTPScreen.defaultProps = {
  disabled: true,
};

VerifyOTPScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(VerifyOTPScreen);
