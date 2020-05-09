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
import {isIPhoneX} from '../../../../utils/checkIphoneX';
import {heightPercentageToDP} from '../../../../utils/dimension';

const HEADER_PADDING_BOTTOM = heightPercentageToDP((20 / 720) * 100);
const HEADER_BACKGROUND_HEIGHT = heightPercentageToDP((152.4 / 720) * 100);
const FOOTER_PADDING_BOTTOM = heightPercentageToDP((38 / 720) * 100);
const SCAN_PADDING_BOTTOM = heightPercentageToDP((18 / 720) * 100);
const SCANNING_HEIGHT = heightPercentageToDP((152 / 720) * 100);
const LOGO_BLUEZONE_HEIGHT = heightPercentageToDP((34.6 / 720) * 100);
const LOGO_BLUEZONE_WIDTH = heightPercentageToDP((28.8 / 720) * 100);


const styles = StyleSheet.create({
  background: {
    flex: 1,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  marginRight23: {
    marginRight: 23,
  },

  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: HEADER_PADDING_BOTTOM,
  },

  buttonScan: {
    backgroundColor: '#015cd0',
    marginBottom: SCAN_PADDING_BOTTOM,
  },

  buttonHistory: {
    backgroundColor: '#119a01',
  },

  buttonIcon: {
    width: 18,
    height: 18,
  },

  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconLogoMic: {
    width: 30,
    height: 30,
    marginHorizontal: 14.6,
  },

  borderLogo: {
    borderWidth: 0.4,
    borderColor: '#b5b5b5',
    height: 24,
  },

  iconLogoBluezone: {
    width: 28.8,
    height: 34.6,
  },

  iconLogoBoyte: {
    width: 30,
    height: 30,
    marginLeft: 14.6,
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
    paddingBottom: FOOTER_PADDING_BOTTOM,
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
    borderRadius: SCANNING_HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#e5e5e5',
    width: SCANNING_HEIGHT,
    height: SCANNING_HEIGHT,
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
    fontSize: fontSize.larger,
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
    fontSize: fontSize.biggest,
    color: '#0166de',
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
    color: '#484848',
    fontSize: fontSize.normal,
  },



  switchLanguage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: isIPhoneX ? 36 : 12,
    zIndex: 99,
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

  circleScan: {
    width: SCANNING_HEIGHT,
    height: SCANNING_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleSnail: {
    width: SCANNING_HEIGHT,
    height: SCANNING_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export {HEADER_PADDING_BOTTOM, HEADER_BACKGROUND_HEIGHT, LOGO_BLUEZONE_HEIGHT, LOGO_BLUEZONE_WIDTH};

export default styles;
