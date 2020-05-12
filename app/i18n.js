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

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */

require('intl');
require('intl/locale-data/jsonp/vi');
const addLocaleData = require('react-intl').addLocaleData;
const viLocaleData = require('react-intl/locale-data/vi');
const DEFAULT_LOCALE = 'en';
const viTranslationMessages = require('./translations/vi.json');
const enTranslationMessages = require('./translations/en.json');

const appLocales = ['vi', 'en'];

addLocaleData(viLocaleData);

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, viTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, {[key]: message});
  }, {});
};

const translationMessages = {
  vi: formatTranslationMessages('vi', viTranslationMessages),
  en: formatTranslationMessages('en', enTranslationMessages),
};

exports.translationMessages = translationMessages;
exports.formatTranslationMessages = formatTranslationMessages;
exports.appLocales = appLocales;
