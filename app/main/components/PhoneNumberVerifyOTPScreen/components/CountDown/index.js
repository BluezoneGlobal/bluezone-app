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

// Components
import Text from '../../../../../base/components/Text';

import configuration from '../../../../../configuration';

// Styles
import styles from './styles/index.css';

const {TimeCountDownOTP} = configuration;

class Index extends React.Component {
  constructor() {
    super();
    this.timeStart = new Date().getTime();
    this.state = {timeValue: TimeCountDownOTP};
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.convertTime = this.convertTime.bind(this);
  }

  componentDidMount() {
    this.startCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  startCountDown = () => {
    clearInterval(this.timer);
    this.timer = null;
    this.startTimer();
  };

  startTimer() {
    if (this.state.timeValue > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  reset() {
    this.timeStart = new Date().getTime();
    this.state = {timeValue: TimeCountDownOTP};
    this.startCountDown();
  }

  countDown() {
    const milisecond = new Date().getTime() - this.timeStart;
    const timeValue = TimeCountDownOTP - Math.round(milisecond / 1000);

    if (timeValue >= 0) {
      this.setState({
        timeValue: timeValue,
      });
    } else {
      clearInterval(this.timer);
      this.props.onVisibleResetOTP();
    }
  }

  convertTime(time) {
    const divisor = parseInt(time / 60);
    const surplus = time % 60;
    const mm = divisor < 10 ? `0${divisor}` : divisor;
    const ss = surplus < 10 ? `0${surplus}` : surplus;
    return `${mm}:${ss}`;
  }

  render() {
    return <Text style={styles.textTimer}>{this.convertTime(this.state.timeValue)}s</Text>;
  }
}

export default Index;
