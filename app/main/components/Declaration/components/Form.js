/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 21:59
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
import CheckBox from '@react-native-community/checkbox';

// Components
import {TextInput, View} from 'react-native';
import Text from '../../../../base/components/Text';
import ButtonIconText from '../../../../base/components/ButtonIconText';
import configuration from '../../../../configuration';
import {getInfoDeclare, setInfoDeclare} from '../../../../core/storage';

// Language
import message from '../../../../core/msg/warning';

// Styles
import styles from '../styles/index.css';

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: configuration.PhoneNumber || '',
      name: '',
      address: '',
      getDataSuccess: false,
      checkbox: props.notifyObj.data.IsQuestion,
      showCheckbox: props.notifyObj.data.IsQuestion,
    };
  }

  async componentDidMount() {
    const strInfoDeclare = await getInfoDeclare();
    if (!strInfoDeclare) {
      return;
    }

    const {phone = '', name = '', address = ''} = strInfoDeclare;
    this.setState({
      phone,
      name,
      address,
      getDataSuccess: true,
    });
  }

  onChangePhone = phone => {
    this.setState({phone});
  };

  onChangeName = name => {
    this.setState({name});
  };

  onChangeAddress = address => {
    this.setState({address});
  };

  onSend = () => {
    const {statusInfo, onSubmit} = this.props;
    const {phone, name, address, checkbox} = this.state;
    if (statusInfo !== 'success' && statusInfo !== 'waiting') {
      onSubmit && onSubmit(phone, name, address, checkbox);
      setInfoDeclare({
        phone,
        name,
        address,
      });
    }
  };

  onChangeCheckBox = newValue => {
    this.setState({
      checkbox: newValue,
    });
  };

  onChangeValueCheckBox = () => {
    this.setState(prevCheckbox => {
      return {
        checkbox: !prevCheckbox.checkbox,
      };
    });
  };

  render() {
    const {intl, statusInfo, notifyObj} = this.props;
    const {formatMessage} = intl;
    const {phone, name, address, getDataSuccess, showCheckbox} = this.state;
    const statusButton = statusInfo || notifyObj.data.declare ? 'edit' : 'send';
    const infoValid = phone.length > 0 && name.length > 0 && address.length > 0;
    const disabledButton =
      !infoValid || statusInfo === 'success' || statusInfo === 'waiting';
    const buttonText =
      statusInfo === 'waiting'
        ? formatMessage(message.sending)
        : statusButton === 'send'
        ? formatMessage(message.send)
        : formatMessage(message.editInfo);
    return (
      <View style={[styles.containerForm]}>
        <Text style={styles.title}>
          {formatMessage(message.dangerTutorial)}
        </Text>
        <View style={{paddingTop: 10, paddingBottom: 5}}>
          <TextInput
            style={styles.inputFirst}
            onChangeText={this.onChangePhone}
            placeholder={formatMessage(message.phoneNumber)}
            placeholderTextColor={'#b5b5b5'}
            allowFontScaling={false}
            textContentType={'telephoneNumber'}
            keyboardType={'numeric'}
            value={phone}
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onChangeName}
            placeholder={formatMessage(message.fullName)}
            placeholderTextColor={'#b5b5b5'}
            allowFontScaling={false}
            value={name}
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onChangeAddress}
            placeholder={formatMessage(message.address)}
            placeholderTextColor={'#b5b5b5'}
            allowFontScaling={false}
            value={address}
          />
        </View>
        {showCheckbox && (
          <View
            style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
            <CheckBox
              value={this.state.checkbox}
              onValueChange={this.onChangeCheckBox}
              style={{marginLeft: -7}}
            />
            <Text onPress={this.onChangeValueCheckBox} style={styles.checkbox}>
              Gửi kèm lịch sử tiếp xúc
            </Text>
          </View>
        )}
        <ButtonIconText
          onPress={this.onSend}
          disabled={disabledButton}
          text={buttonText}
          styleBtn={[
            styles.buttonSendSquare,
            {
              backgroundColor: disabledButton ? '#CCCCCC' : '#119a01',
            },
          ]}
          styleText={styles.textButton}
        />
        <View />
      </View>
    );
  }
}

FormInput.propTypes = {
  intl: intlShape.isRequired,
};

FormInput.defaultProps = {};

FormInput.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(FormInput);
