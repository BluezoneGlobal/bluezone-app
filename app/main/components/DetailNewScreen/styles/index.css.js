/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/13/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import * as fontSize from '../../../../core/fontSize';

const CUSTOM_STYLES = {
  p: {
    color: '#000',
    fontSize: fontSize.normal,
    lineHeight: 30,
    fontFamily: 'Roboto-Regular',
    marginBottom: 7,
    marginHorizontal: 20,
    // textAlignVertical: 'bottom',
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
