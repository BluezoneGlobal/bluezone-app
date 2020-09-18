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
import * as fontSize from '../../../../core/fontSize';
import {large} from '../../../../core/fontSize';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const HEADER_HEIGHT = heightPercentageToDP((44 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    ...Platform.select({
      ios: {
        marginTop: isIPhoneX ? 0 : 20,
      },
      android: {
        marginTop: 20,
      },
    }),
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
  titleNtf: {
    width: '100%',
    height: HEADER_HEIGHT,
    backgroundColor: '#015cd01a',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  textHeader: {
    color: '#015cd0',
    fontSize: fontSize.bigger,
  },
  notifies: {
    flex: 1,
    // marginVertical: 9,
  },
  notifyWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  NotifyContainer: {
    paddingVertical: 10,
    height: 72,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  backgroundAvatar: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(1,92,208,0.6)',
    borderRadius: 26,
  },

  content: {
    flex: 1,
    marginLeft: 13,
  },
  titleText: {
    lineHeight: 22,
    fontSize: fontSize.larger,
    color: '#000000',
  },

  titleTextUnread: {
    lineHeight: 22,
    fontSize: fontSize.larger,
  },

  desText: {
    fontSize: fontSize.smaller,
    color: '#707070',
  },
  desTextUnread: {
    fontSize: fontSize.smaller,
  },
  timer: {
    justifyContent: 'flex-end',
  },
  textTimerUnread: {
    fontSize: fontSize.smaller,
    lineHeight: 20,
  },
  textTimer: {
    color: '#707070',
    fontSize: fontSize.smaller,
    lineHeight: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 23,
  },

  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  listEmptyText: {
    marginTop: 15,
    color: '#484848',
    fontSize: large,
  },
  empty: {
    width: 44,
    height: 64,
  },
});

export default styles;
