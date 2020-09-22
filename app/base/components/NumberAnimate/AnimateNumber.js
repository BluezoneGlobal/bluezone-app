/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate Apr. 2020
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

import React, {Component} from 'react';
import Timer from 'react-timer-mixin';

// Components
import Text from '../Text';

const HALF_RAD = Math.PI / 2;

export default class AnimateNumber extends Component {
  props: {
    countBy?: ?number,
    interval?: ?number,
    steps?: ?number,
    value: number,
    timing: 'linear' | 'easeOut' | 'easeIn' | (() => number),
    formatter: () => {},
    onProgress: () => {},
    onFinish: () => {},
  };

  static defaultProps = {
    interval: 14,
    timing: 'linear',
    steps: 45,
    value: 0,
    formatter: val => val,
    onFinish: () => {},
  };

  static TimingFunctions = {
    linear: (interval: number, progress: number): number => {
      return interval;
    },

    easeOut: (interval: number, progress: number): number => {
      return interval * Math.sin(HALF_RAD * progress) * 5;
    },

    easeIn: (interval: number, progress: number): number => {
      return interval * Math.sin(HALF_RAD - HALF_RAD * progress) * 5;
    },
  };

  state: {
    value?: ?number,
    displayValue?: ?number,
  };

  /**
   * Animation direction, true means positive, false means negative.
   * @type {bool}
   */
  direction: boolean;
  /**
   * Start value of last animation.
   * @type {number}
   */
  startFrom: number;
  /**
   * End value of last animation.
   * @type {number}
   */
  endWith: number;

  constructor(props: any) {
    super(props);
    // default values of state and non-state variables
    this.state = {
      value: 0,
      displayValue: 0,
    };
    this.dirty = false;
    this.startFrom = 0;
    this.endWith = 0;
  }

  componentDidMount() {
    this.startFrom = this.state.value;
    this.endWith = this.props.value;
    this.dirty = true;
    this.startAnimate();
  }

  componentWillUpdate(nextProps, nextState) {
    // check if start an animation
    if (this.props.value !== nextProps.value) {
      this.startFrom = this.props.value;
      this.endWith = nextProps.value;
      this.dirty = true;
      this.startAnimate();
      return;
    }
    // Check if iterate animation frame
    if (!this.dirty) {
      return;
    }
    if (this.direction === true) {
      if (parseFloat(this.state.value) <= parseFloat(this.props.value)) {
        this.startAnimate();
      }
    } else if (this.direction === false) {
      if (parseFloat(this.state.value) >= parseFloat(this.props.value)) {
        this.startAnimate();
      }
    }
  }

  render() {
    return <Text {...this.props}>{this.state.displayValue}</Text>;
  }

  startAnimate() {
    let progress = this.getAnimationProgress();

    Timer.setTimeout(() => {
      let value = (this.endWith - this.startFrom) / this.props.steps;
      if (this.props.countBy)
        value = Math.sign(value) * Math.abs(this.props.countBy);
      let total = parseFloat(this.state.value) + parseFloat(value);

      this.direction = value > 0;
      // animation terminate conditions
      if ((this.direction ^ (total <= this.endWith)) === 1) {
        this.dirty = false;
        total = this.endWith;
        this.props.onFinish(total, this.props.formatter(total));
      }

      if (this.props.onProgress) this.props.onProgress(this.state.value, total);

      this.setState({
        value: total,
        displayValue: this.props.formatter(total),
      });
    }, this.getTimingFunction(this.props.interval, progress));
  }

  getAnimationProgress(): number {
    return (
      (this.state.value - this.startFrom) / (this.endWith - this.startFrom)
    );
  }

  getTimingFunction(interval: number, progress: number) {
    if (typeof this.props.timing === 'string') {
      let fn = AnimateNumber.TimingFunctions[this.props.timing];
      return fn(interval, progress);
    } else if (typeof this.props.timing === 'function')
      return this.props.timing(interval, progress);
    else return AnimateNumber.TimingFunctions['linear'](interval, progress);
  }
}
