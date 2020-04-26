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
import axios from 'axios';

// Components
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  // NativeModules,
  ScrollView,
  StatusBar,
  // Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import CountDown from './CountDown';
import InsertOTP from './InsertOTP';

// Utils
// import configuration from '../../../Configuration';
import * as fontSize from '../../../utils/fontSize';
import Service from '../../../apis/service';

// Styles
import styles from './styles/index.css';
import style from '../HomeScreen/styles/index.css';

class VerifyOTPScreen extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    this.state = {
      disable: true,
      otp: '',
      showModal: false,
      showModalError: false,
    };
  }
  onConfirmPress = () => {
    const {otp} = this.state;
    const phoneNumber = this.props.navigation.getParam('phoneNumber');
    const options = {
      method: 'post',
      data: {
        FcmID: '123abc',
        PhoneNumber: phoneNumber,
        OTPCode: otp,
      },
      url: 'https://apicpms.hcdt.vn:8443/api/App/ConfirmOTPCode',
    };
    const isConfirm = true;
    this.callApi(options, isConfirm);
  };

  saveData = async (UserCode, Token) => {
    // try {
    //   await cookies.set('UserCode', UserCode);
    //   await cookies.set('Token', Token);
    // } catch (error) {
    //   // Error saving data
    // }
  };
  onHandleConfirmSuccess = response => {
    const {Object} = response.data;
    const {UserCode, Token} = Object;
    this.saveData(UserCode, Token);

    Service.setUserId(UserCode);
    this.onStart();

    this.props.navigation.navigate('App');
  };

  onStart = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       {
    //         title: 'Yêu cầu quyền truy cập',
    //         message: 'Bạn cần bật quyền truy cập vị trí cho ứng dụng',
    //       },
    //   );
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    // Service.startService(true);
    //   } else {
    //     console.log(2);
    //   }
    // } catch (err) {
    //   console.log('err', err);
    // }
  };

  callApi = (options, isConfirm) => {
    axios(options).then(
      response => {
        if (response && response.status === 200) {
          if (response.data.isOk) {
            if (isConfirm) {
              this.onHandleConfirmSuccess(response);
            } else {
              this.onHandleReGetOTP(response);
            }
          } else if (response.data.isError) {
            this.setState({showModal: true});
          }
        }
      },
      error => {
        this.setState({showModalError: true});
        return {error};
      },
    );
  };
  onHandleReGetOTP = response => {
    this.refCountDown && this.refCountDown.startCountDown();
  };
  onBack = () => {
    this.props.navigation.goBack();
    return true;
  };
  getOtp = value => {
    this.setState({otp: value});
    if (value.length === 6) {
      this.setState({disable: false});
    }
  };
  onReGetOTP = () => {
    const phoneNumber = this.props.navigation.getParam('phoneNumber');
    const options = {
      method: 'post',
      data: {
        PhoneNumber: phoneNumber,
      },
      url: 'https://apicpms.hcdt.vn:8443/api/App/CreateAndSendOTPCode',
    };
    this.callApi(options);
  };
  onCloseModal = () => {
    this.setState({showModal: false});
  };

  setRef = element => {
    this.refCountDown = element;
  };

  onCloseModalError = () => {
    this.setState({showModalError: false});
  };

  render() {
    const {navigation} = this.props;
    const {showModal, showModalError} = this.state;
    const phoneNumber = navigation.getParam('phoneNumber');
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#F9F9F9" />
        <Header
          onBack={this.onBack}
          showBack
          title={'Xác thực mã OTP'}
          styleView={styles.header}
        />
        <ScrollView style={styles.scroll}>
          <View style={styles.layout1}>
            <Text style={styles.text1}>
              Nhập mã xác nhận đã được gửi qua số điện thoại:{' '}
              <Text style={styles.textPhoneNumber}>{phoneNumber}</Text>
            </Text>
          </View>
          <Text style={styles.text2}>Vui lòng nhập mã OTP</Text>
          <View style={styles.layout2}>
            <Text style={styles.text3}>Mã có hiệu lực trong </Text>
            <CountDown ref={this.setRef} />
          </View>
          <InsertOTP getOtp={this.getOtp} />
          <View style={styles.buttonConfirm}>
            <ButtonIconText
              onPress={this.onConfirmPress}
              text={'Xác nhận'}
              styleBtn={styles.colorButtonConfirm}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.iconButtonConfirm}
            />
          </View>
          <View style={styles.layout3}>
            <Text style={styles.text4}>
              Bạn chưa nhận được mã OTP hoặc mã đã hết hạn?
            </Text>
            <TouchableOpacity onPress={this.onReGetOTP} style={styles.btn}>
              <FastImage
                source={require('./styles/images/ic_refresh.png')}
                style={styles.iconButtonRefresh}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showModal && (
          <Modal
            isVisible={showModal}
            style={styles.modalConfirm}
            onBackButtonPress={this.onCloseModal}
            onBackdropPress={this.onCloseModal}>
            <View style={style.modalCont}>
              <View>
                <Text style={styles.titleModal}>Mã OTP không hợp lệ</Text>
              </View>
              <View>
                <Text style={styles.detailModal}>Vui lòng nhập lại mã OTP</Text>
              </View>
              <View style={styles.lBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={this.onCloseModal}>
                  <Text style={styles.textBtn}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        {showModalError && (
          <Modal
            isVisible={showModalError}
            style={styles.modalConfirm}
            onBackButtonPress={this.onCloseModalError}
            onBackdropPress={this.onCloseModalError}>
            <View style={style.modalCont}>
              <View>
                <Text style={styles.titleModal}>Đã sảy ra sự cố</Text>
              </View>
              <View>
                <Text style={styles.detailModal}>
                  Vui lòng thao tác lại để sử dụng dịch vụ
                </Text>
              </View>
              <View style={styles.lBtnModal}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={this.onCloseModalError}>
                  <Text style={styles.textBtn}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    );
  }
}

VerifyOTPScreen.defaultProps = {
  disable: true,
};

export default VerifyOTPScreen;
