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
import {large} from '../../../../core/fontSize';
import {heightPercentageToDP} from "../../../../core/utils/dimension";

const MARGIN_TOP_CONTENT = heightPercentageToDP((62 / 720) * 100);
const MARGIN_BOTTOM_CONTENT = heightPercentageToDP((64 / 720) * 100);
const MARGIN_TOP_PHONE = heightPercentageToDP((38 / 720) * 100);

const styles = StyleSheet.create({
  layout1: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 24,
    borderRadius: 8,
  },

  content: {
    paddingHorizontal: 50,
    justifyContent: 'center',
    marginTop: MARGIN_TOP_CONTENT,
    marginBottom: MARGIN_BOTTOM_CONTENT,
  },

  text1: {
    textAlign: 'center',
    fontSize: fontSize.normal,
    lineHeight: 25,
  },
  text2: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 19,
    lineHeight: 20,
    color: blue_bluezone,
    textAlign: 'center',
    marginTop: 40,
  },

  layout2: {flexDirection: 'row', alignSelf: 'center', marginTop: 10},
  text3: {
    fontSize: fontSize.normal,
    lineHeight: 25,
    color: blue_bluezone,
  },
  layout3: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text4: {
    fontWeight: 'normal',
    fontSize: fontSize.larger,
    paddingVertical: 24,
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 30,
    color: blue_bluezone,
  },
  btnActive: {
    borderColor: blue_bluezone,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },

  btn: {
    height: 54,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },

  textSendOTP: {
    fontSize: fontSize.normal,
    lineHeight: 25,
    color: blue_bluezone,
  },

  modalCont: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },

  titleModal: {
    fontSize: fontSize.larger,
    textAlign: 'center',
    fontWeight: '500',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  detailModal: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  lBtnModal: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  btnModal: {
    alignItems: 'center',
    flex: 1,
  },
  textBtn: {
    fontSize: fontSize.larger,
    color: blue_bluezone,
    fontWeight: '500',
  },
  textTimer: {
    fontSize: fontSize.normal,
    lineHeight: 25,
    color: blue_bluezone,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  textPhoneNumber: {
    fontWeight: 'bold',
    marginTop: 40,
    lineHeight: 25,
    fontSize: fontSize.larger,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonConfirm: {
    marginHorizontal: 43,
    marginBottom: 27,
  },
  colorButtonConfirm: {
    backgroundColor: blue_bluezone,
    height: 46,
  },

  btnConfim: {
    backgroundColor: '#e8e8e8',
    height: 46,
  },

  iconButtonConfirm: {
    width: 18,
    height: 18,
  },
  iconButtonRefresh: {
    width: 24,
    height: 24,
  },
  modalConfirm: {
    margin: 40,
    justifyContent: 'center',
  },
  inputOTPMin: {
    borderRadius: 8,
    width: 45,
    marginRight: 0,
    textAlign: 'center',
    backgroundColor: '#e8e8e8',
    height: 50,
    fontSize: fontSize.larger,
  },
  inputOTPMax: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingLeft: 12,
    fontSize: fontSize.large,
    marginBottom: 51,
    marginHorizontal: 30,
    textAlign: 'center',
    paddingTop: 9,
    paddingBottom: 9,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30,
    marginHorizontal: 15,
  },

  textNumber: {
    textAlign: 'center',
    color: '#f18b25',
  },

  buttonInvite: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: MARGIN_TOP_PHONE,
  },

  textInvite: {
    fontSize: fontSize.normal,
    color: blue_bluezone,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  textBtnSkip: {
    color: blue_bluezone,
    fontSize: fontSize.huge,
    fontWeight: '600',
  },

  buttonContinued: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: 45,
  },

  textButtonSkip: {
    fontSize: large,
    color: blue_bluezone,
  },
});

export default styles;
