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
import {large} from '../../../../utils/fontSize';
import {heightPercentageToDP} from '../../../../utils/dimension';

export const LOGO_HEIGHT = heightPercentageToDP((124 / 720) * 100);
export const CONTAINER_MARGINVERTICAL = heightPercentageToDP((137 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: CONTAINER_MARGINVERTICAL,
  },

  logo: {
    width: 124,
    height: 124,
  },

  body: {
    alignItems: 'center',
  },

  icon_success: {
    width: 58,
    height: 59,
    marginBottom: 32,
  },

  text: {
    fontSize: large,
    color: '#000000',
    marginBottom: 10,
  },
});

export default styles;
