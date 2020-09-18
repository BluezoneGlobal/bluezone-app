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
import {blue_bluezone} from '../../../../core/color';

const LOGO_HEIGHT = heightPercentageToDP((72 / 720) * 100);
const MARGIN_TOP_HEADER = heightPercentageToDP((63 / 720) * 100);
const MARGIN_HOZITAL_BORDER = heightPercentageToDP((40 / 720) * 100);
const MARGIN_TOP_BODY = heightPercentageToDP((45 / 720) * 100);
const BOTTOM_BTN = heightPercentageToDP((38 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  containerLogo: {
    marginTop: MARGIN_TOP_HEADER,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  body: {
    flex: 1,
    marginTop: MARGIN_TOP_BODY,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: fontSize.larger,
    color: '#000000',
  },

  viewDep: {
    justifyContent: 'center',
  },

  description: {
    fontSize: fontSize.normal,
    lineHeight: 25,
  },

  borderLogo: {
    borderWidth: 0.4,
    borderColor: '#DBDBDB',
    height: LOGO_HEIGHT,
    marginHorizontal: MARGIN_HOZITAL_BORDER,
  },
  boxButton: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_BTN,
  },
  button: {
    color: blue_bluezone,
    fontSize: fontSize.normal,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});

export {LOGO_HEIGHT};

export default styles;
