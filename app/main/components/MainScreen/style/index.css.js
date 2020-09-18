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
import {smallest} from '../../../../core/fontSize';
import {heightPercentageToDP, widthPercentageToDP} from '../../../../core/utils/dimension';

export const TAB_BAR_HEIGHT = heightPercentageToDP((52 / 720) * 100);
export const TAB_BAR_IPHONEX_HEIGHT = heightPercentageToDP(
  ((52 + 34) / 720) * 100,
);
const ICON_SQUARE_HEIGHT = heightPercentageToDP((24 / 720) * 100);
const ICON_SQUARE_WIDTH = widthPercentageToDP((24 / 360) * 100);
const ICON_FAQ_HEIGHT = heightPercentageToDP((20 / 720) * 100);
const ICON_FAQ_WIDTH = widthPercentageToDP((27 / 360) * 100);

const styles = StyleSheet.create({
  iconSquare: {
    height: 24,
    width: 24,
  },

  iconRectangle: {
    height: 24,
    width: 28,
    paddingRight: 4,
  },

  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 99,
  },

  iconFaq: {
    height: 20,
    width: 27,
    marginTop: 1.5,
  },

  labelStyle: {
    fontSize: smallest,
    marginBottom: 4,
  },

  viewBadge: {
    position: 'absolute',
    top: -3,
    left: 12,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBadge: {
    color: '#FFFFFF',
    fontSize: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default styles;
