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
import PropTypes from "prop-types";

class SwitchLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  onChangeLanguage(context) {
    const {language} = this.context;

    // EN
    console.log('onChangeLanguage', language);
    const _language = language === 'vi' ? 'en' : 'vi';
    context.updateLanguage(_language);
    setLanguage(_language);
  }

  render() {
    const {language} = this.context;
    // alert(language);

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
                language === 'vi' ? style.btnLanguageActive : {},
              ]}>
              <Text
                style={
                  language === 'vi'
                    ? style.textBtnLanguageActive
                    : style.textBtnLanguage
                }>
                vi
              </Text>
            </View>
            <View
              style={[
                {marginRight: 2},
                language === 'en' ? style.btnLanguageActive : {},
              ]}>
              <Text
                style={
                  language === 'en'
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

SwitchLanguage.contextTypes = {
  language: PropTypes.object,
};

export default SwitchLanguage;
