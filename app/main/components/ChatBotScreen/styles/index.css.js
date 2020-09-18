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
import {blue_bluezone} from '../../../../core/color';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';
import {bigger, normal, smaller} from '../../../../core/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  chatbot: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleHeader: {
    color: '#015CD0',
    fontSize: bigger,
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  textButton: {
    fontSize: smaller,
  },
  btnIcon: {
    position: 'absolute',
    right: 19,
    bottom: 18,
    width: 52,
    height: 52,
  },
  styleIcon: {
    width: 52,
    height: 52,
    color: blue_bluezone,
  },
  btnTitle: {
    position: 'absolute',
    backgroundColor: blue_bluezone,
    right: 75,
    bottom: 31,
    width: 80,
    height: 25,
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 2,
    textAlign: 'center',
    fontSize: smaller,
  },
  boxbotMessage: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  iconbot: {
    width: 34,
    height: 34,
    marginTop: 7,
  },
  viewbotMessage: {
    width: 262,
    marginLeft: 9,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 19,
  },
  botmessage: {
    fontSize: normal,
    color: '#000000',
    textAlign: 'left',
  },
  boxUserMessage: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
    justifyContent: 'flex-end',
  },
  viewUserMessage: {
    width: 262,
    marginLeft: 9,
    backgroundColor: '#015cd0',
    padding: 10,
    borderRadius: 19,
  },
  userMessage: {
    fontSize: normal,
    color: '#ffffff',
    textAlign: 'left',
  },
  boxHintQuestion: {
    marginLeft: 64,
    marginRight: 64,
    marginTop: 10,
    marginBottom: 10,
  },
  titleHintQueston: {
    fontSize: normal,
    textAlign: 'left',
    color: '#848484',
  },
  messageHintQuestion: {
    fontSize: normal,
    textAlign: 'left',
    color: '#015cd0',
  },
  boxTextInput: {
    flexDirection: 'row',
    width: '100%',
    height: 42,
  },
  boxTextInputOnFocus: {
    flexDirection: 'row',
    width: '100%',
    height: 42,
    backgroundColor: '#f1f1f1',
  },
  textInput: {
    height: 42,
    backgroundColor: '#f1f1f1',
    borderRadius: 21,
    marginLeft: 20,
    width: '80%',
    paddingBottom: 11,
    paddingTop: 11,
    paddingLeft: 22,
    paddingRight: 22,
  },
  iconSend: {
    width: 27,
    height: 20,
    marginLeft: 12,
  },
  btnIconSendMessage: {
    width: 42,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default styles;
