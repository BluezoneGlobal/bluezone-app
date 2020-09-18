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
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const HEADER_PADDING_BOTTOM = heightPercentageToDP((20 / 720) * 100);
const HEADER_BACKGROUND_HEIGHT = heightPercentageToDP((152.4 / 720) * 100);
const BTN_MARGIN_BOTTOM = heightPercentageToDP((12 / 720) * 100);
const SCANNING_HEIGHT = heightPercentageToDP((150 / 720) * 100);
const LOGO_BLUEZONE_HEIGHT = heightPercentageToDP((34.6 / 720) * 100);
const LOGO_BLUEZONE_WIDTH = heightPercentageToDP((28.8 / 720) * 100);
const LOGO_PADDING_BOTTOM = heightPercentageToDP((8 / 720) * 100);
const SCAN_PADDING_BOTTOM = heightPercentageToDP((12 / 720) * 100);
const HEADER_PADDING_TOP = heightPercentageToDP((8 / 720) * 100);
const TEXTF_PADDING_TOP = heightPercentageToDP((12 / 720) * 100);
const TEXT_WHY_PADDING_BOTTOM = heightPercentageToDP((7 / 720) * 100);
const TEXT_WHY_MARGIN_BOTTOM = heightPercentageToDP((8 / 720) * 100);
const RADA = heightPercentageToDP((176 / 720) * 100);

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
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scan: {
    height: RADA,
    width: RADA,
  },

  marginRight23: {
    marginRight: 23,
  },

  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: HEADER_PADDING_TOP,
    paddingBottom: HEADER_PADDING_BOTTOM,
  },

  buttonScan: {
    backgroundColor: '#015cd0',
    paddingVertical: 12,
    marginBottom: SCAN_PADDING_BOTTOM,
  },

  buttonHistory: {
    backgroundColor: '#119a01',
    paddingVertical: 12,
  },

  buttonIcon: {
    width: 15,
    height: 18,
    marginRight: 6,
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
    borderRightWidth: 1,
    borderRightColor: '#b5b5b5',
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
    marginBottom: BTN_MARGIN_BOTTOM,
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
    paddingTop: isIPhoneX ? 34 : 6,
    zIndex: 99,
    paddingBottom: LOGO_PADDING_BOTTOM,
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

  textF: {
    fontSize: fontSize.small,
    textAlign: 'center',
    paddingHorizontal: 53,
    paddingTop: TEXTF_PADDING_TOP,
    color: '#015cd0',
  },

  textHoi: {
    fontSize: fontSize.smallest,
    paddingVertical: TEXT_WHY_PADDING_BOTTOM,
    marginBottom: TEXT_WHY_MARGIN_BOTTOM,
    fontStyle: 'italic',
    color: '#015cd0',
  },

  textWhy: {
    fontSize: fontSize.normal,
  },

  textWhyBtn: {
    fontSize: fontSize.normal,
    color: '#0166de',
    fontWeight: '600'
  },
});

export {
  HEADER_PADDING_BOTTOM,
  HEADER_BACKGROUND_HEIGHT,
  LOGO_BLUEZONE_HEIGHT,
  LOGO_BLUEZONE_WIDTH,
};

export default styles;
