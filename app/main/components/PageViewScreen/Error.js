/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/12/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity} from 'react-native';

// Components
import Text, {MediumText} from '../../../base/components/Text';

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = () => {
    const {onPress} = this.props;
    onPress();
  };

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MediumText style={{color: '#000', marginBottom: 10}}>
          Đã có lỗi xảy ra. Vui lòng thử lại sau.!
        </MediumText>
        <TouchableOpacity onPress={this.onPress}>
          <Text style={{padding: 20, color: '#015cd0'}}>Tại lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Error.propTypes = {
  onPress: PropTypes.func,
};

export default Error;
