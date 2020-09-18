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
import * as PropTypes from 'prop-types';

import configuration, {
  setStatusNotifyRegister,
  retrySyncTokenFirebase,
} from '../configuration';

// Apis
import Service from '../core/apis/service';
import {TIME_RETRY_AUTO_REGISTER_USER} from '../const/api';
import {retryUploadHistoryF12} from '../core/apis/bluezone';

// FCM
import {requestTokenFirebase} from '../core/fcm';

import {createNews} from '../core/announcement';
import {messageNotifyOTP} from '../core/data';
import {getJobs, removeJob} from '../core/jobScheduler';
import {registerBluetoothStateListener} from '../core/bluetooth';
import * as scheduler from '../core/notifyScheduler';
import * as analytic from '../core/analytics';

/**
 * Thực hiện toàn bộ các kịch bản cần thực thi ngay khi app start lên
 * @param AppStack
 * @returns {*}
 */
function decorateMainAppStart(AppStack) {
  class MainApp extends React.Component {
    constructor(props) {
      super(props);
    }

    async componentDidMount() {
      // Xu ly lay FirebaseToken ngay khi appstart
      requestTokenFirebase();

      // Start service
      this.startService(true);

      // jobs
      this.processWorkToDo();

      // notify scheduler
      scheduler.initNotifyScheduler();
      registerBluetoothStateListener(scheduler.bluetoothChangeListener);

      // analytics
      analytic.reportBluetoothState();
      registerBluetoothStateListener(analytic.bluetoothChangeListener);

      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
      this.startService(false);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    startService = scanFull => {
      Service.startService(scanFull);
    };

    processWorkToDo = async () => {
      const jobs = await getJobs();
      if (jobs) {
        for (let i = 0; i < jobs.length; i++) {
          const job = jobs[i];
          const {type} = job;
          if (type === 'UploadHistoryF') {
            await this.uploadHistory(job);
          }
        }
      }
    };

    uploadHistory = async job => {
      const {data} = job;
      const {notifyObj} = data;
      retryUploadHistoryF12(
        notifyObj.data.DataContent.Numberdays,
        notifyObj.data.DataContent.FindGUID,
        () => {
          removeJob(job);
        },
      );
    };

    handleAppStateChange = appState => {
      if (appState === 'active') {
        if (configuration.TokenFirebase === '') {
          retrySyncTokenFirebase(
            this.registerUserSuccess,
            this.registerUserError,
            TIME_RETRY_AUTO_REGISTER_USER,
          );
        }
        this.startService(true);
        // analytics
        analytic.reportBluetoothState();
      } else {
        this.startService(false);
      }
    };

    registerUserSuccess = () => {
      const {Language} = configuration;
      setStatusNotifyRegister(new Date());
      createNews(messageNotifyOTP(Language));
    };

    registerUserError = () => {};

    render() {
      return <AppStack />;
    }
  }

  MainApp.propTypes = {};

  MainApp.contextTypes = {
    language: PropTypes.string,
  };

  return MainApp;
}

export default decorateMainAppStart;
