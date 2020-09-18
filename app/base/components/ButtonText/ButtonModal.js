/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/26/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import ButtonText from './index';
import styles from './styles/index.css';

export function ButtonConfirm(props) {
  const {text, onPress} = props;
  return (
    <ButtonText
      text={text}
      onPress={onPress}
      styleBtn={styles.btnConfirm}
      styleText={styles.textConfirm}
    />
  );
}

export function ButtonClose(props) {
  const {text, onPress} = props;
  return (
    <ButtonText
      text={text}
      onPress={onPress}
      styleBtn={styles.btnClose}
      styleText={styles.textClose}
    />
  );
}
