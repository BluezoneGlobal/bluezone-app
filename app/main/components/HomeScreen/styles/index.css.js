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

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  colorText: {
    color: '#73e530',
  },

  watchScan: {
    flexDirection: 'row',
    paddingHorizontal: 42,
    paddingTop: 36,
    justifyContent: 'center',
  },

  marginRight23: {
    marginRight: 23,
  },

  header: {
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonScan: {
    backgroundColor: '#015cd0',
    marginBottom: 18,
  },

  buttonHistory: {
    backgroundColor: '#119a01',
    marginBottom: 18,
  },

  buttonIcon: {
    width: 18,
    height: 18,
  },

  logo: {
    // position: 'absolute',
    // top: 6,
    // left: 16,
    flexDirection: 'row',
    // zIndex: 99,
  },

  iconLogoMic: {
    width: 30,
    height: 30,
    marginRight: 12,
  },

  borderLogo: {
    borderRightWidth: 0.2,
    borderRightColor: '#b5b5b5',
    marginVertical: 6,
  },

  iconLogoBoyte: {
    width: 30,
    height: 30,
    marginLeft: 12,
  },

  center: {
    textAlign: 'center',
  },

  buttonInvite: {
    borderTopWidth: 0.65,
    borderTopColor: '#c6c6c8',
  },

  textInvite: {
    color: '#1C74C4',
    fontWeight: '700',
  },

  modal: {
    margin: 40,
    justifyContent: 'center',
  },

  textHeader: {
    textAlign: 'center',
    // fontFamily: 'OpenSans',
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 3,
  },

  texthea: {
    // fontFamily: 'OpenSans',
    color: '#ffffff',
    fontSize: fontSize.small,
  },

  button: {
    paddingHorizontal: 43,
    justifyContent: 'center',
  },

  safe: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#F7F8FA',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  safeView: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },

  textBeta: {
    color: '#ffffff',
    fontSize: fontSize.small,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    right: 10,
    top: 10,
  },

  safeImage: {
    width: 35,
    height: 42,
  },

  scanImage: {
    width: 20,
    height: 21,
    marginRight: 3,
  },

  numberBluezone: {
    // flex: 1,
    borderRadius: 70,
    paddingTop: 21,
    paddingBottom: 19,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f2f2f2',
    width: 140,
    height: 140,
  },

  scanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#119a01',
  },

  textScan: {
    // fontFamily: 'OpenSans',
    fontSize: fontSize.normal,
    color: '#fff',
  },

  textSafe: {
    color: '#1C74C4',
    fontSize: fontSize.huge,
    fontWeight: '600',
    paddingLeft: 13,
  },

  scrollView: {
    backgroundColor: '#ffffff',
  },

  textProtectCommunity: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: fontSize.large,
  },

  bluezone: {
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#fff',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },

  bluezone1: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    // paddingVertical: 10,
  },

  textBlueNumber: {
    // fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: fontSize.bigger,
    color: '#0166de',
    marginBottom: 7,
  },

  textSmallBlueNumber: {
    fontWeight: 'normal',
  },

  btnQXH: {
    backgroundColor: '#5AC86C',
    marginTop: 10,
    width: '100%',
  },

  btnXLS: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    width: '100%',
  },

  textBlue: {
    // fontFamily: 'OpenSans',
    color: '#484848',
    fontSize: fontSize.normal,
  },

  switchLanguage: {
    backgroundColor: '#015cd0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    marginBottom: -10,
    zIndex: 99,
  },

  btnLanguage: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 18,
    borderColor: '#ffffff',
    borderWidth: 0.2,
    alignItems: 'center',
  },

  btnLanguageActive: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },

  textBtnLanguageActive: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: fontSize.small,
    color: '#0166de',
  },

  textBtnLanguage: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: fontSize.small,
    color: '#ffffff',
  },
});

export default styles;
