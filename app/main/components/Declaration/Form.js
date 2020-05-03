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

// Components
import {TextInput, View} from 'react-native';
import Text from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

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
    // doSomething.
  };

  render() {
    const {phone, name, address} = this.state;
    return (
      <View style={styles.containerForm}>
        <Text style={styles.title}>
          Bạn hãy khai thông tin để được hỗ trợ nhanh nhất
        </Text>
        <TextInput
          style={styles.inputFirst}
          onChangeText={this.onChangePhone}
          placeholder={'Điện thoại'}
          placeholderTextColor={''}
          textContentType={'telephoneNumber'}
          keyboardType={'numeric'}
          value={phone}
        />
        <TextInput
          style={styles.input}
          onChangeText={this.onChangeName}
          placeholder={'Họ tên'}
          placeholderTextColor={''}
          value={name}
        />
        <TextInput
          style={styles.input}
          onChangeText={this.onChangeAddress}
          placeholder={'Địa chỉ'}
          placeholderTextColor={''}
          value={address}
        />
        <ButtonIconText
          onPress={this.onSend}
          text={'Gửi'}
          styleBtn={styles.buttonSendSquare}
          styleText={styles.textButton}
        />
        <View />
      </View>
    );
  }
}

export default FormInput;
