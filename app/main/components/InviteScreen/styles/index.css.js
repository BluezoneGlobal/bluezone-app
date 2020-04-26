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

import {StyleSheet, Platform} from 'react-native';
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
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },

  textHeader: {
    color: '#015cd0',
    fontSize: fontSize.bigger,
  },

  banner: {
    paddingVertical: 20,
    paddingHorizontal: 23,
  },

  textBanner: {
    color: '#015cd0',
    fontStyle: 'normal',
    fontSize: fontSize.large,
    textAlign: 'center',
  },

  imageQR: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  share: {
    paddingHorizontal: 43,
    justifyContent: 'center',
    marginBottom: 80,
  },
  btnShare: {
    backgroundColor: '#015cd0',
  },
  textBtnShare: {
    fontSize: fontSize.large,
    marginLeft: 5,
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

export default styles;
