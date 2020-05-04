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
  header: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  textTitleWar: {
    color: '#f16600',
    fontSize: fontSize.normal,
  },
  textTitleNtf: {
    color: '#015cd0',
    fontSize: fontSize.normal,
  },
  titleWar: {
    width: '100%',
    height: 44,
    backgroundColor: '#f166001a',
    paddingLeft: 22,
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#015cd0',
  },
  titleNtf: {
    width: '100%',
    height: 44,
    backgroundColor: '#015cd01a',
    paddingLeft: 22,
  },
  textHeader: {
    color: '#015cd0',
    fontSize: fontSize.bigger,
  },
  NotifyContainer: {
    marginVertical: 9,
    height: 52,
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 52,
    height: 52,
  },
  colorDes: {
    color: '#707070',
    fontSize: fontSize.small,
  },
  content: {
    marginHorizontal: 13,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titleText: {
    fontSize: fontSize.large,
  },
  textContent: {
    marginTop: 26,
    fontSize: fontSize.normal,
  },
  timer: {
    alignItems: 'flex-end',
  },
  textTimerUnread: {
    alignItems: 'flex-end',
  },
  textTimer: {
    color: '#707070',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  declare: {
    paddingVertical: 20,
    paddingHorizontal: 60,
  },
  button: {
    backgroundColor: '#015cd0',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  textButton: {
    color: '#fff',
    fontSize: fontSize.normal,
  },
});

export default styles;
