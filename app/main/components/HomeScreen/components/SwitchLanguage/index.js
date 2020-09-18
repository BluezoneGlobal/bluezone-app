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
import {LanguageContext} from '../../../../../../LanguageContext';
import * as PropTypes from 'prop-types';

// Components
import Text from '../../../../../base/components/Text';

// Styles
import styles from './styles/index.css';
import {setLanguage} from '../../../../../configuration';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  componentDidMount() {
    this.setState({disabled: false});
  }

  onChangeLanguage(context) {
    const {onChange} = this.props;
    const {language} = this.context;
    const _language = language === 'vi' ? 'en' : 'vi';
    context.updateLanguage(_language);
    this.setState({disabled: true});
    setLanguage(_language);
    onChange && onChange(_language);
  }

  render() {
    const {disabled} = this.state;
    const {language} = this.context;
    return (
      <LanguageContext.Consumer>
        {context => {
          return (
            <TouchableOpacity
              onPress={() => this.onChangeLanguage(context)}
              activeOpacity={1}
              disabled={disabled}
              style={styles.btnLanguage}>
              <View
                style={[
                  {marginLeft: 2},
                  language === 'vi' ? styles.btnLanguageActive : {},
                ]}>
                <Text
                  style={
                    language === 'vi'
                      ? styles.textBtnLanguageActive
                      : styles.textBtnLanguage
                  }>
                  Vi
                </Text>
              </View>
              <View
                style={[
                  {marginRight: 2},
                  language === 'en' ? styles.btnLanguageActive : {},
                ]}>
                <Text
                  style={
                    language === 'en'
                      ? styles.textBtnLanguageActive
                      : styles.textBtnLanguage
                  }>
                  En
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      </LanguageContext.Consumer>
    );
  }
}

Index.contextTypes = {
  language: PropTypes.string,
};

export default Index;
