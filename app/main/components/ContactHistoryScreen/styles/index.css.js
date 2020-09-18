/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 9/8/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import {StyleSheet} from 'react-native';
import {bigger, normal, fontSize19} from '../../../../core/fontSize';
import {blue_bluezone} from '../../../../core/color';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const PADDING_TOP_CONTACT = heightPercentageToDP((26 / 720) * 100);
const HEIGHT_CONTACT = heightPercentageToDP((44 / 720) * 100);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  warper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    marginTop: isIPhoneX ? 0 : 20,
  },
  titleHeader: {
    color: '#015cd0',
    fontSize: bigger,
  },
  contact: {
    alignItems: 'center',
    paddingTop: PADDING_TOP_CONTACT,
  },

  textContact: {
    color: blue_bluezone,
    fontStyle: 'italic',
    paddingTop: 10,
    paddingBottom: 16,
  },

  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5EEF9',
    height: HEIGHT_CONTACT,
    paddingHorizontal: 20,
  },

  textHeader: {
    fontSize: normal,
    color: blue_bluezone
  },

  contentContainerStyle: {
    // paddingHorizontal: 20,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    paddingVertical: 14,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 0.65,
  },

  date: {
    fontSize: normal,
  },

  numberContact: {
    fontSize: fontSize19,
    color: blue_bluezone,
    paddingRight: 20
  }
});

export default styles;
