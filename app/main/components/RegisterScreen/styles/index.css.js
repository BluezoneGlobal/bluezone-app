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
import {huge, large} from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  layout1: {
    marginTop: 50,
    backgroundColor: 'rgba(241, 90, 34, 0.07)',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  text1: {
    textAlign: 'center',
    fontSize: huge,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#F15A22',
    marginTop: 15,
  },
  text2: {
    padding: 15,
    fontSize: large,
    fontStyle: 'normal',
    lineHeight: 20,
  },
  layout2: {flexDirection: 'row', alignSelf: 'center', marginTop: 10},
  text3: {
    fontSize: large,
    lineHeight: 20,
  },
  textInput: {
    height: 44,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: '#e8e8e8',
    paddingLeft: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyBoardContainer: {
    height: 500,
  },
  phone: {
    marginVertical: 40,
    marginHorizontal: 40,
  },
  textColorActive: {
    color: '#F15A22',
  },
  buttonIcon: {
    width: 18,
    height: 18,
  },
  center: {
    margin: 40,
    justifyContent: 'center',
  },
  modalContent: {
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 19,
  },
  modalContentText01: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  modalContentText02: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
  },
  buttonContinued: {
    alignItems: 'center',
    marginTop: 10,
  },
  textButtonContinued: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#F15A22',
  },
  buttonActive: {
    backgroundColor: '#F15A22',
    marginBottom: 30,
  },
  buttonDisable: {
    backgroundColor: '#ccc',
    marginBottom: 30,
  },

  buttonInvite: {
    position: 'absolute',
    right: 20,
    bottom: 16,
  },

  textInvite: {
    color: '#000000',
    fontWeight: '600',
  },
});

export default styles;
