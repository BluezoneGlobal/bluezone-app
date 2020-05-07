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

import configuration, {registerUser, setStatusNotifyRegister} from '../Configuration';
import Service from '../apis/service';
import {requestTokenFirebase, getTokenFirebase} from '../CloudMessaging';
import {replaceNotify} from "../db/SqliteDb";
import {messageNotifyOTP} from "./components/ModalNotify/data";
import * as PropTypes from "prop-types";

const TIME_RETRY = [2000, 3000, 5000, 8000, 13000, 21000, 34000, 550000];

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
      this.registerUserSuccess = this.registerUserSuccess.bind(this);
      this.registerUserError = this.registerUserError.bind(this);
    }

    componentDidMount() {

      const {TokenFirebase} = configuration;
      if (TokenFirebase === '') {
        getTokenFirebase((TokenFB) => registerUser(TokenFB, this.registerUserSuccess, this.registerUserError));
      }

      // Xu ly lay FirebaseToken ngay khi appstart
      requestTokenFirebase();

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
        if (configuration.TokenFirebase === '') {
          getTokenFirebase((TokenFB) => registerUser(TokenFB, this.registerUserSuccess, this.registerUserError, TIME_RETRY));
        }
        // Start service
        this.onStartService(true);
      } else {
        this.onStartService(false);
      }
    };

    registerUserSuccess(data) {
      const {language} = this.context;
      setStatusNotifyRegister(new Date().getTime().toString());
      replaceNotify(messageNotifyOTP, language);
    }

    registerUserError() {}

    render() {
      return <AppStack />;
    }
  }

  MainApp.propTypes = {};

  MainApp.contextTypes = {
    language: PropTypes.object,
  };

  return MainApp;
}

export default decorateMainAppStart;
