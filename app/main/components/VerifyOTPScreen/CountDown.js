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

// Components.
import {Text} from 'react-native';

// Styles
import styles from './styles/index.css';

const TIME = 180;

class CountDown extends React.Component {
  constructor() {
    super();
    this.state = {time: {}, seconds: TIME};
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    const obj = {
      s: secs,
    };
    return obj;
  }

  componentDidMount() {
    this.startCountDown();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startCountDown = () => {
    clearInterval(this.timer);
    this.timer = 0;
    let timeLeftVar = this.secondsToTime(TIME);
    this.setState({time: timeLeftVar, seconds: TIME});
    this.startTimer();
  };

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.onVisibleResetOTP();
    }
  }

  formatTime = time => {
    const minute = parseInt(time / 60);
    const seconds = time % 60;
    const secondsConvert = seconds > 10 ? seconds : `0${seconds}`;
    return `0${minute}:${secondsConvert}`;
  };

  render() {
    return (
      <Text style={styles.textTimer}>{this.formatTime(this.state.time.s)}</Text>
    );
  }
}

export default CountDown;
