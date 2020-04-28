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

import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {LanguageContext} from '../../../../LanguageContext';

// Components
import Text from '../../../base/components/Text';

// Styles
import style from './styles/index.css';
import configuration, {setLanguage} from '../../../Configuration';

class SwitchLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Language: configuration.Language,
    };

    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  onChangeLanguage(context) {
    const {Language} = this.state;
    const language = Language === 'vn' ? 'en' : 'vn';
    context.updateLanguage(language);
    this.setState({Language: language});
    setLanguage(language);
  }

  render() {
    const {Language} = this.state;
    return (
      <LanguageContext.Consumer>
        {context => (
          <TouchableOpacity
            onPress={() => this.onChangeLanguage(context)}
            activeOpacity={1}
            style={style.btnLanguage}>
            <View
              style={[
                {marginLeft: 2},
                Language === 'vn' ? style.btnLanguageActive : {},
              ]}>
              <Text
                style={
                  Language === 'vn'
                    ? style.textBtnLanguageActive
                    : style.textBtnLanguage
                }>
                Vn
              </Text>
            </View>
            <View
              style={[
                {marginRight: 2},
                Language === 'en' ? style.btnLanguageActive : {},
              ]}>
              <Text
                style={
                  Language === 'en'
                    ? style.textBtnLanguageActive
                    : style.textBtnLanguage
                }>
                En
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </LanguageContext.Consumer>
    );
  }
}

export default SwitchLanguage;
