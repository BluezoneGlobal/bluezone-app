/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 27/06/19.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-native';

function ImageBackgroundBase(props) {
  const {style, uri} = props;

  return (
    <Image
        // resizeMode={'contain'}
      style={[style]}
      blurRadius={2}
      source={uri}
      backgroundColor={'rgb(0,0,0)'}
      opacity={0.5}
    />
  );
}

ImageBackgroundBase.propTypes = {
  style: PropTypes.object,
};

export default ImageBackgroundBase;
