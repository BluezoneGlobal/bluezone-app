/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/19/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import * as PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import {View} from 'react-native';

// Components
import Text from '../Text';

// Styles
import styles from './styles/index.css';

function ModalBase(props) {
  const {
    isVisibleModal,
    title,
    description,
    children,
    onCloseModal,
    styleTitle,
    styleDescription,
  } = props;
  return (
    <Modal
      isVisible={isVisibleModal}
      style={styles.container}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      backdropOpacity={0.8}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}>
      <View style={styles.content}>
        <View style={styles.body}>
          {title && <Text text={title} style={[styles.title, styleTitle]} />}
          {description && (
            <Text
              text={description}
              style={[styles.description, styleDescription]}
            />
          )}
        </View>
        {children && children}
      </View>
    </Modal>
  );
}

ModalBase.propTypes = {
  isVisibleModal: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.any,
  onCloseModal: PropTypes.func,
  styleTitle: PropTypes.object,
  styleDescription: PropTypes.object,
};

ModalBase.defaultProps = {
  onCloseModal: () => {},
  styleTitle: {},
  styleDescription: {},
};

export default ModalBase;
