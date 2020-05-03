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
import {View, TextInput} from 'react-native';

// Styles
import styles from './styles/index.css';

class InsertOTP extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
    this.state = {otp: []};
    this.otpTextInput = [];
  }

  focusPrevious(key, index) {
    if (key === 'Backspace' && index !== 0) {
      this.otpTextInput[index - 1]._root.focus();
    }
  }

  focusNext(index, value) {
    if (index < this.otpTextInput.length - 1 && value) {
      this.otpTextInput[index + 1].focus();
    }
    if (index === this.otpTextInput.length - 1) {
      this.otpTextInput[index].blur();
    }
    const otp = this.state.otp;
    otp[index] = value;
    this.setState({otp});
    this.props.getOtp(otp.join(''));
  }

  renderInputs() {
    const inputs = Array(6).fill(0);
    return inputs.map((i, j) => {
      return (
        <TextInput
          style={j < 5 ? styles.inputOTPMax : styles.inputOTPMin}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={v => this.focusNext(j, v)}
          onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
          ref={ref => {
            this.otpTextInput[j] = ref;
          }}
        />
      );
    });
  }

  render() {
    return <View style={styles.inputContainer}>{this.renderInputs()}</View>;
  }
}

export default InsertOTP;
