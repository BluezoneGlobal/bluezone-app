/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 12/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../../../core/fontSize';
import {isIPhoneX} from '../../../../../../core/utils/isIPhoneX';
import {heightPercentageToDP} from '../../../../../../core/utils/dimension';

const LOGO_PADDING_BOTTOM = heightPercentageToDP((8 / 720) * 100);

const styles = StyleSheet.create({
  switchLanguage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: isIPhoneX ? 34 : 6,
    zIndex: 99,
    paddingBottom: LOGO_PADDING_BOTTOM,
  },

  btnLanguage: {
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 0.3,
  },

  btnLanguageActive: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    paddingHorizontal: 8,
  },

  textBtnLanguageActive: {
    fontSize: fontSize.smallest,
    color: '#0166de',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 2,
    // fontWeight: '600',
  },

  textBtnLanguage: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: fontSize.smallest,
    color: '#ffffff',
  },
});

export default styles;
