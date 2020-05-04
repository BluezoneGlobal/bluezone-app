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
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';

// Components
import ButtonIconText from '../../../base/components/ButtonIconText';
import Text from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';

// Apis
import {CreateAndSendOTPCode} from '../../../apis/bluezone';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../utils/fontSize';

import message from '../../../msg/register';
import {injectIntl, intlShape} from 'react-intl';

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
    this.onPress = this.onPress.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.createAndSendOTPCodeSuccess = this.createAndSendOTPCodeSuccess.bind(
      this,
    );
    this.createAndSendOTPCodeFail = this.createAndSendOTPCodeFail.bind(this);
    this.onChangeNavigate = this.onChangeNavigate.bind(this);
  }

  onChangeText(value) {
    this.setState({numberPhone: value});
  }

  onPress() {
    const {numberPhone} = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (vnf_regex.test(numberPhone) === false) {
      Alert.alert(formatMessage(message.phoneEnterNotValid));
    } else {
      this.setState({showLoading: true, showErrorModal: false}, () => {
        CreateAndSendOTPCode(
          numberPhone,
          this.createAndSendOTPCodeSuccess,
          this.createAndSendOTPCodeFail,
        );
      });
    }
  }

  createAndSendOTPCodeSuccess(response) {
    const {numberPhone} = this.state;
    this.props.navigation.navigate('VerifyOTP', {
      phoneNumber: numberPhone,
    });
    this.setState({showLoading: false});
  }

  createAndSendOTPCodeFail(error) {
    this.setState({showLoading: false, showErrorModal: true});
  }

  onCloseModal() {
    this.setState({showErrorModal: false});
  }

  onChangeNavigate() {
    const {setLoading, navigation} = this.props;
    setLoading ? setLoading('Home') : navigation.push('Home');
  }

  render() {
    const {intl} = this.props;
    const {numberPhone, showLoading, showErrorModal} = this.state;
    const {formatMessage} = intl;
    const disabled = numberPhone.length === 0;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.keyBoardContainer} behavior={'position'}>
          <View style={styles.layout1}>
            <Text style={styles.text1}>{formatMessage(message.summary)}</Text>
            <Text style={styles.text2}>{formatMessage(message.title)}</Text>
          </View>
          <View style={styles.phone}>
            <Text style={styles.text3}>
              {formatMessage(message.numberphone)}
              <Text style={styles.textColorActive}> *</Text>
            </Text>
            <TextInput
              keyboardType={'phone-pad'}
              style={styles.textInput}
              placeholder={formatMessage(message.pleaseEnterYourPhone)}
              onChangeText={this.onChangeText}
            />
            <ButtonIconText
              disabled={disabled}
              onPress={this.onPress}
              text={formatMessage(message.next)}
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
                <Text style={styles.modalContentText01}>
                  {formatMessage(message.error)}
                </Text>
                <Text style={styles.modalContentText02}>
                  {formatMessage(message.redo)}
                </Text>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.buttonContinued}
                    onPress={this.onCloseModal}>
                    <Text style={styles.textButtonSkip}>
                      {formatMessage(message.skip)}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.borderBtn} />
                  <TouchableOpacity
                    style={styles.buttonContinued}
                    onPress={this.onPress}>
                    <Text style={styles.textButtonContinued}>
                      {formatMessage(message.try)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>
        <ButtonText
          text={formatMessage(message.skip)}
          onPress={this.onChangeNavigate}
          styleBtn={styles.buttonInvite}
          styleText={styles.textInvite}
        />
      </SafeAreaView>
    );
  }
}

RegisterScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(RegisterScreen);
