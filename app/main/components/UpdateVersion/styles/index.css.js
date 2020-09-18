/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author CuongNTg@bkav.com on 13/10/2019.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

'use strict';

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../core/fontSize';

const styles = StyleSheet.create({
  modal: {
    margin: 40,
    justifyContent: 'center',
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },

  textDiv: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  textTitle: {
    fontSize: fontSize.huge,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    paddingVertical: 10,
    color: '#1C74C4',
  },

  textCenter: {
    textAlign: 'center',
    paddingVertical: 5,
  },

  flexRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#c6c6c8',
  },

  colorText: {
    color: '#1C74C4',
  },

  buttonCancel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#c6c6c8',
    borderRadius: 0,
  },

  flex: {
    flex: 1,
  },
});

export default styles;
