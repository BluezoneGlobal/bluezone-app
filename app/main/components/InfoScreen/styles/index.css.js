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
  container: {
    flex: 1,
    backgroundColor: '#265bd0',
  },

  error: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textTitle: {
    color: '#000',
    marginBottom: 10,
    fontSize: fontSize.huge,
    paddingHorizontal: 20,
    textAlign: 'center',
  },

  btnError: {
    borderRadius: 5,
    borderWidth: 0.65,
    borderColor: '#0166de',
  },

  textBtnReload: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    color: '#0166de',
    fontSize: fontSize.large,
  },
});

export default styles;
