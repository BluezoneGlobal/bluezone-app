/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 13/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../../core/fontSize';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    borderColor: '#DDDDDD',
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
  },

  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#015cd0',
    width: 24,
    height: 24,
    marginRight: 14,
  },
});

const CUSTOM_STYLES = {
  p: {
    color: '#000',
    fontSize: fontSize.normal,
    lineHeight: 23,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 7,
    // textAlign: 'justify',
    marginLeft: 38,
  },
  br: {
    display: 'none',
  },
  strong: {
    // lineHeight: 32,
    fontFamily: 'Roboto-Medium',
  },
  h1: {
    marginVertical: 10,
    color: '#000',
  },
  h2: {
    marginVertical: 7,
    color: '#000',
    marginHorizontal: 20,
  },
  ul: {
    paddingLeft: 5,
  },
  li: {
    lineHeight: 24,
    color: '#000',
    fontSize: fontSize.normal,
  },
  a: {
    fontSize: fontSize.normal,
  },
};

export {CUSTOM_STYLES};

export default styles;
