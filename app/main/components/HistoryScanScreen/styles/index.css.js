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
import {bigger, small, normal, larger, large} from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  warper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    marginTop: 20,
  },
  titleHeader: {
    color: '#015cd0',
    fontSize: bigger,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 25,
  },
  contentChild: {
    flexDirection: 'row',
    paddingVertical: 24,
  },
  colorText: {
    color: '#015cd0',
  },
  colorNumber: {
    color: '#119a01',
  },
  backgroundPeople: {
    backgroundColor: 'rgb(214,239,213)',
  },
  backgroundBlue: {
    backgroundColor: 'rgb(11,147,35)',
  },
  pickerAndroid: {
    height: 46,
    width: 150,
    color: '#015cd0',
  },
  pickerIOS: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  pickerDay: {
    height: 200,
    width: 150,
  },
  buttonOK: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleButtonOK: {
    fontSize: large,
    color: '#1D76C1',
  },
  pickerIOSContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  human: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: 'rgb(211, 228, 245)',
  },
  bluezone: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: '#015cd0',
  },
  title: {
    fontSize: larger,
    color: '#000000',
    textAlign: 'center',
  },
  textValue: {
    fontSize: bigger,
    lineHeight: 31,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: small,
    color: '#fff',
  },
  datePickerT: {
    fontWeight: 'normal',
    fontSize: normal,
    color: '#5F5F5F',
    paddingRight: 10,
  },
  datePickerO: {
    backgroundColor: '#F7F8FA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 11,
    width: '100%',
    height: 46,
    position: 'relative',
  },
  datePickerL: {
    paddingTop: 50,
    flexDirection: 'row',
    paddingHorizontal: 43,
  },
  datePicker1: {
    flex: 1,
    paddingTop: 10,
    marginBottom: 40,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#015cd0',
    // width: '100%',
    height: 44,
    position: 'relative',
  },
  textDes: {
    fontSize: small,
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 15,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: '#1C74C4',
  },

  buttonSend: {
    height: 46,
    // width: '100%',
    backgroundColor: '#119a01',
    marginTop: 25,
  },
  buttonIcon: {
    width: 15,
    height: 15,
    marginRight: 7,
  },
});

export default styles;
