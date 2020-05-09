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

import {Platform, StyleSheet} from 'react-native';
import * as fontSize from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: 20,
      },
    }),
  },
  textHeader: {
    color: '#015cd0',
    fontSize: fontSize.bigger,
  },
  buttonSendSquare: {
    width: '100%',
    backgroundColor: '#119a01',
    marginTop: 13,
    borderRadius: 3,
  },
  header: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#dddddd',
    borderWidth: 1,
    marginTop: 13,
    width: '100%',
    borderRadius: 3,
    paddingHorizontal: 12,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSize.small,
  },
  inputFirst: {
    height: 40,
    borderColor: '#dddddd',
    borderWidth: 1,
    marginTop: 5,
    width: '100%',
    borderRadius: 3,
    paddingHorizontal: 12,
    fontFamily: 'OpenSans-Regular',
    fontSize: fontSize.small,
  },
  containerForm: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: fontSize.small,
    lineHeight: 25,
  },
  textButton: {
    fontSize: fontSize.normal,
  },
});

export default styles;
