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
import * as fontSize from '../../../../utils/fontSize';
import {blue_bluezone} from '../../../../utils/color';
import {large} from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  layout1: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 24,
    borderRadius: 8,
  },
  text1: {
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize: fontSize.large,
    lineHeight: 30,
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
    fontStyle: 'normal',
    fontSize: fontSize.large,
    lineHeight: 20,
  },
  layout3: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text4: {
    fontWeight: 'normal',
    fontSize: fontSize.large,
    paddingVertical: 24,
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 30,
    color: blue_bluezone,
  },
  btnActive: {
    height: 54,
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

  textSendOTPActive: {
    color: blue_bluezone,
    paddingHorizontal: 36,
  },

  textSendOTP: {
    color: '#ffffff',
    paddingHorizontal: 36,
  },

  modalCont: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 19,
  },

  titleModal: {
    fontSize: fontSize.large,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailModal: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
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
    fontSize: fontSize.large,
    color: blue_bluezone,
    fontWeight: '500',
  },
  textTimer: {
    fontSize: fontSize.large,
    color: blue_bluezone,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  textPhoneNumber: {
    fontWeight: 'bold',
  },
  buttonConfirm: {
    marginVertical: 30,
    marginHorizontal: 48,
  },
  colorButtonConfirm: {
    backgroundColor: blue_bluezone,
    height: 54,
    borderRadius: 28,
    marginHorizontal: 78,
  },

  btnConfim: {
    backgroundColor: '#e8e8e8',
    height: 54,
    borderRadius: 28,
    marginHorizontal: 78,
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
    fontSize: fontSize.large,
  },
  inputOTPMax: {
    height: 45,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingLeft: 10,
    fontSize: fontSize.large,
    marginBottom: 16,
    marginHorizontal: 50,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30,
    marginHorizontal: 15,
  },

  buttonInvite: {
    position: 'absolute',
    right: 8,
    bottom: 16,
  },

  textInvite: {
    color: blue_bluezone,
  },

  textBtnSkip: {
    fontWeight: '500',
    fontSize: large,
    color: blue_bluezone,
  },
});

export default styles;
