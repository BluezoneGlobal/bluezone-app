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

import {StyleSheet, Platform} from 'react-native';
import {bigger, huge, large, normal, smaller} from '../../../../core/fontSize';
import {blue_bluezone} from '../../../../core/color';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const MARGIN_TOP_HEADER = heightPercentageToDP((37 / 720) * 100);
const LOGO_HEIGHT = heightPercentageToDP((124 / 720) * 100);
const MARGIN_TOP_LAYOUT = heightPercentageToDP((50 / 720) * 100);
const PADDING_TOP_INPUT = heightPercentageToDP((23 / 720) * 100);
const PADDING_BOTTOM_INPUT = heightPercentageToDP((35 / 720) * 100);
const BOTTOM_PHONE = heightPercentageToDP((38 / 720) * 100);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    marginTop: MARGIN_TOP_HEADER,
  },

  title: {
    textAlign: 'center',
    fontSize: bigger,
  },

  layout1: {
    marginTop: MARGIN_TOP_LAYOUT,
    marginHorizontal: 30,
  },

  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  text1: {
    textAlign: 'center',
    fontSize: huge,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: blue_bluezone,
    marginTop: 15,
  },

  text2: {
    fontSize: normal,
    fontStyle: 'normal',
    lineHeight: 25,
    textAlign: 'center',
  },

  text4: {
    fontSize: normal,
    fontStyle: 'normal',
    lineHeight: 38,
  },

  layout2: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },

  text3: {
    fontSize: large,
    lineHeight: 20,
  },

  textInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingLeft: 16,
    fontSize: 15,
    color: '#000000',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  keyBoardContainer: {
    height: 500,
  },

  logo: {
    width: 124,
    height: 124,
  },

  phone: {
    marginTop: PADDING_TOP_INPUT,
    marginHorizontal: 30,
    marginBottom: PADDING_BOTTOM_INPUT,
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
    // fontWeight: 'bold',
    fontSize: large,
    color: blue_bluezone,
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
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_PHONE,
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
    fontSize: 14,
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
