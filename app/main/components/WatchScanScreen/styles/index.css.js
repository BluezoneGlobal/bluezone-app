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
import {small, normal, larger, large, bigger} from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingTop: 25,
    paddingHorizontal: 25,
  },
  infoItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoAround: {
    backgroundColor: '#E6F6E6',
    width: 100,
    height: 100,
    borderRadius: 50,
    // opacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoAround1: {
    backgroundColor: '#119A01',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBluezone: {
    backgroundColor: '#E5EEF9',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.1,
  },
  infoBluezone1: {
    backgroundColor: '#015CD0',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoItemValue: {
    fontSize: bigger,
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoItemDesc: {
    color: '#484848',
    fontSize: normal,
    paddingTop: 15,
    paddingBottom: 25,
  },

  listContainer: {
    minHeight: 220,
    // flex: 1,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    // backgroundColor: '#FFF',
  },

  listHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F5FC',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 20,
    paddingVertical: 10,
  },

  textListHeader: {
    fontSize: larger,
    color: '#015cd0',
  },

  textListHeaderValue: {
    fontSize: larger,
    color: '#015cd0',
    width: 44,
    textAlign: 'center',
  },

  textUserCode: {
    fontSize: larger,
    color: '#015cd0',
    textAlign: 'center',
  },

  listBodyContainer: {
    paddingLeft: 20,
    paddingBottom: 12,
  },

  listItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inviteButtonContainer: {
    height: '100%',
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  inviteButton: {
    height: 24,
    width: 44,
    backgroundColor: '#015cd0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteText: {
    fontSize: small,
    color: '#FFFFFF',
  },

  contentScan: {
    fontSize: normal,
    color: '#000000',
    flex: 1,
  },

  listEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listEmptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  listEmptyText: {
    color: '#484848',
    fontSize: large,
  },

  buttonInvite: {
    width: 16,
    height: 20,
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  titleHeader: {
    color: '#015CD0',
    fontSize: bigger,
  },

  header: {
    marginTop: 20,
  },

  iconEmpty: {
    width: 44,
    height: 64,
  },
});

export default styles;
