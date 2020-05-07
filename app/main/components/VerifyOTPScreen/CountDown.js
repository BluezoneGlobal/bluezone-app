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
import {Text} from 'react-native';

import configuration from '../../../Configuration';

// Styles
import styles from './styles/index.css';

const {TimeCountDownOTP} = configuration;

class CountDown extends React.Component {
  constructor() {
    super();
    this.state = {time: {}, seconds: TimeCountDownOTP};
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
    let timeLeftVar = this.secondsToTime(TimeCountDownOTP);
    this.setState({time: timeLeftVar, seconds: TimeCountDownOTP});
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

  render() {
    return <Text style={styles.textTimer}>{this.state.time.s}s</Text>;
  }
}

export default CountDown;
