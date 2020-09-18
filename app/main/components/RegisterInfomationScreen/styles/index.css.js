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

import {Platform, StyleSheet} from 'react-native';
import {large, normal, smaller} from '../../../../core/fontSize';
import {blue_bluezone} from '../../../../core/color';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const LOGO_HEIGHT = heightPercentageToDP((124 / 720) * 100);
const MARGIN_TOP_HEADER = heightPercentageToDP((37 / 720) * 100);
const MARGIN_TOP_LAYOUT = heightPercentageToDP((58 / 720) * 100);
const MARGIN_TOP_PHONE = heightPercentageToDP((38 / 720) * 100);
const MARGIN_BOTTOM_PHONE = heightPercentageToDP((35 / 720) * 100);
const PADDING_HORIZONTAL_TITLE = heightPercentageToDP((86 / 720) * 100);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    marginTop: MARGIN_TOP_HEADER,
  },
  layout1: {
    marginVertical: MARGIN_TOP_LAYOUT,
  },
  textInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingLeft: 16,
    fontSize: normal,
    color: '#000000',
    marginVertical: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  title: {
    textAlign: 'center',
    fontSize: normal,
    lineHeight: 25,
    paddingHorizontal: PADDING_HORIZONTAL_TITLE
  },

  keyBoardContainer: {
    height: 500,
  },

  phone: {
    // marginTop: MARGIN_TOP_PHONE,
    marginHorizontal: 30,
    marginBottom: MARGIN_BOTTOM_PHONE,
  },

  textColorActive: {
    color: blue_bluezone,
  },

  buttonIcon: {
    width: 18,
    height: 18,
  },

  center: {
    margin: 40,
    justifyContent: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 19,
  },

  modalContentText01: {
    fontSize: large,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  modalContentText02: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
  },

  buttonContinued: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: 45,
  },

  textButtonContinued: {
    fontWeight: 'bold',
    fontSize: large,
    color: blue_bluezone,
  },

  textButtonSkip: {
    fontWeight: 'bold',
    fontSize: large,
    color: '#bfbfbf',
  },

  borderBtn: {
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },

  buttonActive: {
    backgroundColor: blue_bluezone,
  },

  buttonDisable: {
    backgroundColor: '#ccc',
  },

  buttonInvite: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: MARGIN_TOP_PHONE,
    width: '100%',
  },

  textInvite: {
    fontSize: normal,
    color: blue_bluezone,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  btnNext: {
    marginHorizontal: 30,
    height: 46,
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 17,
  },
  textCheckBox: {
    flex: 1,
    fontSize: smaller,
    lineHeight: 24,
    color: '#000000',
    ...Platform.select({
      ios: {
        paddingLeft: 10,
        marginTop: -4,
      },
    }),
  },
  textCheckbox2: {
    fontWeight: 'bold',
    color: blue_bluezone,
  },

  checkbox: {
    ...Platform.select({
      ios: {
        width: 15,
        height: 15,
      },
    }),
  },
});

export {LOGO_HEIGHT};

export default styles;
