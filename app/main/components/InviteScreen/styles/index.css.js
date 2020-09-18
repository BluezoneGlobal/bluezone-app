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
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const HEADER_PADDING_TOP = heightPercentageToDP((37 / 720) * 100);
const HEADER_PADDING_BOTTOM = heightPercentageToDP((32 / 720) * 100);
const FOOTER_PADDING_BOTTOM = heightPercentageToDP((38 / 720) * 100);
const SCAN_PADDING_BOTTOM = heightPercentageToDP((18 / 720) * 100);
const LOGO_HEIGHT = heightPercentageToDP((192 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  frame: {
    width: 152,
    height: 152,
    position: 'absolute',
  },

  containerQR: {
    width: 164,
    height: 164,
    position: 'relative',
  },

  contentQR: {
    width: 124,
    height: 124,
    left: 14,
    top: 14,
    position: 'absolute',
  },

  header: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },

  textHeader: {
    paddingTop: HEADER_PADDING_TOP,
    color: '#015cd0',
    fontSize: fontSize.bigger,
    paddingBottom: HEADER_PADDING_BOTTOM,
  },

  banner: {
    paddingHorizontal: 10,
  },

  textBanner: {
    color: '#015cd0',
    fontSize: fontSize.large,
    textAlign: 'center',
  },

  imageQR: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  share: {
    paddingHorizontal: 43,
    justifyContent: 'center',
    paddingBottom: FOOTER_PADDING_BOTTOM,
  },
  btnShare: {
    backgroundColor: '#015cd0',
  },
  textBtnShare: {
    fontSize: fontSize.normal,
    marginLeft: 5,
  },

  btnAddGroup: {
    borderWidth: 0.65,
    borderColor: '#015cd0',
    paddingVertical: 13,
  },

  textBtnAddGroup: {
    color: '#015cd0',
    fontSize: fontSize.normal,
    marginLeft: 5,
  },

  iconFace: {
    width: 9,
    height: 16,
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export {LOGO_HEIGHT};

export default styles;
