/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../core/fontSize';
import {blue_bluezone} from '../../../../core/color';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },

  title: {
    color: blue_bluezone,
    fontSize: fontSize.bigger,
  },

  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  buttonConfirm: {
    marginHorizontal: 43,
    marginBottom: 30,
    paddingBottom: 30,
  },
  colorButtonConfirm: {
    backgroundColor: blue_bluezone,
    height: 46,
  },

  btnConfim: {
    backgroundColor: '#e8e8e8',
    height: 46,
  },

  inputOTPMax: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    fontSize: fontSize.large,
    marginBottom: 51,
    marginHorizontal: 43,
    textAlign: 'center',
    paddingTop: 9,
    paddingBottom: 9,
    color: '#000000',
  },

  labelSendHistory: {
    color: '#000000',
    fontSize: fontSize.normal,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 50,
  },

  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
  },
});

export default styles;
