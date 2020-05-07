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
  textDiv: {
    padding: 20,
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },

  textTitle: {
    fontSize: fontSize.huge,
    textAlign: 'center',
    fontWeight: '600',
    paddingBottom: 20,
    color: '#1C74C4',
  },

  buttonCancel: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#c6c6c8',
    borderRadius: 0,
  },

  modal: {
    margin: 40,
    justifyContent: 'center',
  },

  textCenter: {
    textAlign: 'center',
  },

  textCenterIOS: {
    textAlign: 'center',
    fontSize: fontSize.larger,
  },

  flex: {
    flex: 1,
  },

  flexRow: {
    flexDirection: 'row',
  },

  colorText: {
    color: '#1C74C4',
  },

  modalBase: {
    margin: 20,
    justifyContent: 'center',
  },

  buttonConfirm: {
    borderTopWidth: 0.65,
    borderTopColor: '#c6c6c8',
  },

  textButtonConfirm: {
    color: '#1C74C4',
    fontSize: fontSize.huge,
    fontWeight: '600',
  },

  textContent: {
    fontSize: fontSize.larger,
    lineHeight: 20,
  },
});

export default styles;
