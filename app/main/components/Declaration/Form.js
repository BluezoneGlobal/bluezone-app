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

// Components
import {TextInput, View} from 'react-native';
import Text from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Language
import message from '../../../msg/warning';

// Styles
import styles from './styles/index.css';

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
      address: '',
    };
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
    const {phone, name, address} = this.state;
    this.props.onPress && this.props.onPress(phone, name, address);
  };

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {phone, name, address} = this.state;
    return (
      <View style={styles.containerForm}>
        <Text style={styles.title}>
          {formatMessage(message.dangerTutorial)}
        </Text>
        <TextInput
          style={styles.inputFirst}
          onChangeText={this.onChangePhone}
          placeholder={formatMessage(message.phoneNumber)}
          placeholderTextColor={''}
          textContentType={'telephoneNumber'}
          keyboardType={'numeric'}
          value={phone}
        />
        <TextInput
          style={styles.input}
          onChangeText={this.onChangeName}
          placeholder={formatMessage(message.fullName)}
          placeholderTextColor={''}
          value={name}
        />
        <TextInput
          style={styles.input}
          onChangeText={this.onChangeAddress}
          placeholder={formatMessage(message.address)}
          placeholderTextColor={''}
          value={address}
        />
        <ButtonIconText
          onPress={this.onSend}
          text={formatMessage(message.send)}
          styleBtn={styles.buttonSendSquare}
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
