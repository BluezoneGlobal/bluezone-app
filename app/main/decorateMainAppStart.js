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
import {AppState} from 'react-native';

import configuration, {registerUser} from '../Configuration';
import Service from '../apis/service';
import {requestTokenFirebase, getTokenFirebase} from '../CloudMessaging';

/**
 * Thực hiện toàn bộ các kịch bản cần thực thi ngay khi app start lên
 * @param AppStack
 * @returns {*}
 */
function decorateMainAppStart(AppStack) {
  class MainApp extends React.Component {
    // static router = AppStack.router;
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      // Xin luon quyen notification
      // requestUserPermission();

      // Xu ly lay FirebaseToken ngay khi appstart
      requestTokenFirebase();

      const {Token} = configuration;
      if (Token === '') {
        getTokenFirebase(registerUser);
      }

      // Start service
      this.onStartService(true);

      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
      this.onStartService(false);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    onStartService = async scanFull => {
      Service.startService(scanFull);
    };

    handleAppStateChange = appState => {
      if (appState === 'active') {
        if (configuration.Token === '') {
          registerUser(getTokenFirebase());
        }
        // Start service
        this.onStartService(true);
      } else {
        this.onStartService(false);
      }
    };

    render() {
      return <AppStack />;
    }
  }

  MainApp.propTypes = {};

  return MainApp;
}

export default decorateMainAppStart;
