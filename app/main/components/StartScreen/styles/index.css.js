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
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const MARGINTOP_HEADER = heightPercentageToDP((37 / 720) * 100);
const MARGINTOP_TITLE = heightPercentageToDP((16 / 720) * 100);
const LOGO_HEIGHT = heightPercentageToDP((124 / 720) * 100);
const MARGINTOP_BODY = heightPercentageToDP((28 / 720) * 100);
const MARGINTOP_FOTTER = heightPercentageToDP((20 / 720) * 100);
const MARGIN_BOTTON_FOTTER = heightPercentageToDP((38 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  containerLogo: {
    marginTop: MARGINTOP_HEADER,
    backgroundColor: '#ffffff',
    paddingHorizontal: 69.2,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    color: blue_bluezone,
    fontSize: fontSize.bigger,
    fontWeight: '600',
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    marginTop: MARGINTOP_BODY,
  },

  viewDep: {
    justifyContent: 'center',
  },

  description: {
    fontSize: fontSize.normal,
    lineHeight: 23,
  },

  borderLogo: {
    borderWidth: 0.4,
    borderColor: '#DBDBDB',
    height: LOGO_HEIGHT,
  },

  boxButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: MARGINTOP_FOTTER,
    marginBottom: MARGIN_BOTTON_FOTTER,
  },

  button: {
    color: blue_bluezone,
    fontSize: fontSize.normal,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export {LOGO_HEIGHT};

export default styles;
