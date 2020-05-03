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

// Components
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Utils
import {CreateAndSendOTPCode} from '../../../apis/bluezone';

// Styles
import styles from './styles/index.css';

import * as fontSize from '../../../utils/fontSize';

class RegisterScreen extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    this.state = {
      numberPhone: '',
      showLoading: false,
      showErrorModal: false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    // eslint-disable-next-line prettier/prettier
	this.createAndSendOTPCodeSuccess = this.createAndSendOTPCodeSuccess.bind(this);
    this.createAndSendOTPCodeFail = this.createAndSendOTPCodeFail.bind(this);
  }

  onChangeText(value) {
    this.setState({numberPhone: value});
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }

  onPress() {
    const {numberPhone} = this.state;
    // const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    // if (vnf_regex.test(numberPhone) === false) {
    //   Alert.alert('Số điện thoại bạn nhập không hợp lệ');
    // } else {
    //   this.callApi(numberPhone);
    // }
    CreateAndSendOTPCode(
      numberPhone,
      this.createAndSendOTPCodeSuccess,
      this.createAndSendOTPCodeFail,
    );
    this.callApi(numberPhone);
  }

  createAndSendOTPCodeSuccess(response) {
    const {numberPhone} = this.state;
    if (response && response.status === 200 && response.data.isOk) {
      this.props.navigation.navigate('VerifyOTP', {
        phoneNumber: numberPhone,
      });
      this.setState({showLoading: false});
    }
  }

  createAndSendOTPCodeFail(error) {
    this.setState({showLoading: false, showErrorModal: true});
  }

  onCloseModal() {
    this.setState({showErrorModal: false});
  }

  render() {
    const {numberPhone, showLoading, showErrorModal} = this.state;
    const disabled = numberPhone.length === 0;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyBoardContainer}
          behavior={'position'}>
          <StatusBar backgroundColor="#ffffff" />
          <View style={styles.layout1}>
            <Text style={styles.text1}>Human Shield</Text>
            <Text style={styles.text2}>
              Ứng dụng Bluezone là ứng dụng cho phép người dùng theo dõi tình
              hình dịch bệnh COVID-19, phát hiện sớm nhất những người tiếp xúc
              với người bị nhiễm bệnh. Để sử dụng ứng dụng, vui lòng đăng kí
              dịch vụ.
            </Text>
          </View>
          <View style={styles.phone}>
            <Text style={styles.text3}>
              Nhập số điện thoại<Text style={styles.textColorActive}> *</Text>
            </Text>
            <TextInput
              keyboardType={'phone-pad'}
              style={styles.textInput}
              placeholder={'Vui lòng nhập số điện thoại'}
              onChangeText={this.onChangeText}
            />
            <ButtonIconText
              disabled={disabled}
              onPress={this.watchHistory}
              text={'Tiếp tục'}
              styleBtn={disabled ? styles.buttonDisable : styles.buttonActive}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.buttonIcon}
            />
          </View>
          {showLoading && (
            <Modal isVisible={showLoading} style={styles.center}>
              <ActivityIndicator size="large" color={'#fff'} />
            </Modal>
          )}
          {showErrorModal && (
            <Modal
              isVisible={showErrorModal}
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
                <View>
                  <Text style={styles.modalContentText01}>Đã sảy ra sự cố</Text>
                </View>
                <View>
                  <Text style={styles.modalContentText02}>
                    Vui lòng thao tác lại để sử dụng dịch vụ
                  </Text>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.buttonContinued}
                    onPress={this.onCloseModal}>
                    <Text style={styles.textButtonContinued}>Tiếp tục</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default RegisterScreen;
