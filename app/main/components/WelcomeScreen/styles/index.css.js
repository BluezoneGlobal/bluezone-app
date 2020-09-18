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
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../core/utils/dimension';

const HEIGHT_HEADER = heightPercentageToDP((338 / 720) * 100);
const HEIGHT_IMG = heightPercentageToDP((68 / 720) * 100);
const PADDING_HOR = widthPercentageToDP((26 / 360) * 100);
const PAD_TOP = heightPercentageToDP((28 / 720) * 100);
const PAD_TOP1 = heightPercentageToDP((19 / 720) * 100);
const MAR_TOP = heightPercentageToDP((11 / 720) * 100);
const PAD_VER = heightPercentageToDP((13 / 720) * 100);
const RIGHT_IMG = widthPercentageToDP((22 / 360) * 100);
const LINE_HEI = heightPercentageToDP((20 / 720) * 100);
const HEIGHT_DEFAULT = heightPercentageToDP((40 / 720) * 100);
const MAR_TOP2 = heightPercentageToDP((42 / 720) * 100);
const MAR_TOP3 = heightPercentageToDP((34 / 720) * 100);
const HEI_BTN = heightPercentageToDP((27 / 720) * 100);
const WID_BTN = widthPercentageToDP((60 / 360) * 100);
const MARGIN_QR = widthPercentageToDP((130 / 360) * 100);
const HEIGHT_BTN_OK = heightPercentageToDP((63 / 720) * 100);
const HEIGHT_ANN = heightPercentageToDP((225 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    backgroundColor: '#015cd0',
    borderRadius: 17,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: PAD_VER,
  },
  titleCalendar: {
    color: '#fff',
    fontSize: fontSize.huger,
  },
  titleLunar: {
    color: '#fff',
    fontSize: fontSize.biggest2,
  },

  textInvite: {
    fontSize: fontSize.smaller,
    color: '#fff',
  },
  titleAlert: {
    color: '#015cd0',
    textAlign: 'center',
    fontSize: fontSize.normal,
  },

  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
  },
  btnQRCode: {
    position: 'absolute',
    bottom: -20,
    right: RIGHT_IMG,
    zIndex: 999,
  },
  titleImg: {
    position: 'absolute',
    color: '#fff',
    fontSize: fontSize.fontSize11,
    zIndex: 999,
    left: PADDING_HOR,
    marginRight: MARGIN_QR,
  },
  containerLogo: {
    // height: HEADER_BẠCKGROUND_LOGO,
    backgroundColor: blue_bluezone,
    paddingHorizontal: 69.2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  body: {
    flex: 1,
    paddingHorizontal: PADDING_HOR,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
    zIndex: 100,
  },

  maxim: {
    paddingHorizontal: PADDING_HOR,
    paddingTop: PAD_TOP,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: fontSize.normal,
    color: 'black',
    lineHeight: LINE_HEI,
    fontStyle: 'italic',
  },

  viewDep: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },

  description: {
    fontSize: fontSize.normal,
    lineHeight: 25,
  },

  borderLogo: {
    borderWidth: 0.4,
    borderColor: '#ffffff',
    // height: LOGO_HEIGHT,
  },

  date: {
    lineHeight: 28,
    fontSize: fontSize.normal,
  },

  textContact: {
    fontSize: fontSize.normal,
    lineHeight: 25,
  },

  textTitle: {
    color: '#000',
    marginBottom: 10,
    fontSize: fontSize.huge,
    paddingHorizontal: 20,
  },

  textBottom: {
    // paddingBottom: DATE_PADDINGBOTTOM,
  },

  textBtnReload: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    color: '#0166de',
    fontSize: fontSize.larger,
  },

  linkweb: {
    color: '#0166de',
    fontSize: fontSize.normal,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  closeButtonContainer: {
    height: HEIGHT_BTN_OK,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    height: HEI_BTN,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#015cd0',
    borderRadius: 17,
  },

  buttonIcon: {
    width: 15,
    height: 15,
    marginRight: 7,
  },
  note: {
    textAlign: 'right',
    marginTop: MAR_TOP,
    fontSize: fontSize.fontSize11,
    color: '#a7a7a7',
  },
  announce: {
    height: HEIGHT_ANN,
    paddingTop: PAD_TOP1,
    justifyContent: 'space-between',
  },
});

export {HEIGHT_HEADER, HEIGHT_IMG, HEIGHT_DEFAULT, RIGHT_IMG, PADDING_HOR};

export default styles;
