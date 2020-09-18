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

import {Platform, StyleSheet} from 'react-native';
import * as fontSize from '../../../../core/fontSize';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  textTitleWar: {
    color: '#f16600',
    fontSize: fontSize.normal,
  },
  textTitleNtf: {
    color: '#015cd0',
    fontSize: fontSize.normal,
  },
  titleWar: {
    width: '100%',
    height: 44,
    backgroundColor: '#f166001a',
    paddingLeft: 22,
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#015cd0',
  },
  titleNtf: {
    width: '100%',
    height: 44,
    backgroundColor: '#015cd01a',
    paddingLeft: 22,
  },
  textHeader: {
    color: '#015cd0',
    fontSize: fontSize.bigger,
  },
});

export default styles;
