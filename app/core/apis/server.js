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

import Service from './service';

const currentVersion = Service.getVersion();
export const dev = currentVersion.endsWith('dev');

export const DOMAIN = dev
  ? 'https://apibetabz.bkav.com'
  : 'https://apibz.bkav.com';

export const DOMAIN_CONFIG = dev
  ? 'https://apiconfigbz.bkav.com'
  : 'https://apiconfigbz.bkav.com';

export const DOMAIN_NEW = dev
  ? 'https://bznews.bkav.com'
  : 'https://bznews.bkav.com';

export const CONFIG_APP_FILE_NAME = dev
  ? 'configAppTest.json'
  : 'configApp.json';
export const RESOURCE_APP_FILE_NAME = dev
  ? 'resourceAppTest.json'
  : 'resourceApp.json';
export const VERSION_APP_FILE_NAME = dev
  ? 'versionAppTest.json'
  : 'versionApp.json';
export const FAQ_FILE_NAME = dev ? 'dataFAQ.json' : 'dataFAQ.json';
