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

import React from 'react';
import * as PropTypes from 'prop-types';
import {NativeModules} from "react-native";

export const LanguageContext = React.createContext();

class LanguageProvider extends React.Component {
  constructor(props) {
    super(props);
    const languages = NativeModules.I18nManager.localeIdentifier || 'vi';
    const _language = languages.split('_')[0];
    this.state = {
      language: _language,
    };
    console.log('Contructor LanguageProvider');
  }

  getChildContext = () => {
    const {language} = this.state;
    if (language && language !== 'vi') {
      return {
        language: 'en',
      };
    }
    return {
      language: this.state.language,
    };
  };

  render() {
    return (
      <LanguageContext.Provider
        value={{
          state: this.state,
          updateLanguage: language => this.setState({language: language}),
        }}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

LanguageProvider.childContextTypes = {
  language: PropTypes.string,
};

LanguageProvider.propTypes = {
  language: PropTypes.string,
};

export default LanguageProvider;
