/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 11/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import LottieView from 'lottie-react-native';

class Dot extends React.Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setRef = this.setRef.bind(this);
    this.onAnimationFinish = this.onAnimationFinish.bind(this);
    this.isPlaying = false;
    this.playAgain = false;
  }

  play() {
    const {dot} = this.props;
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playAgain = false;

      this.ref && this.ref.play(dot.firstBeginFrame, dot.firstEndFrame);
    } else {
      this.playAgain = true;
    }
  }

  stop() {}

  onAnimationFinish() {
    const {dot} = this.props;

    if (this.playAgain) {
      this.isPlaying = true;
      this.playAgain = false;

      this.ref && this.ref.play(dot.otherBeginFrame, dot.otherEndFrame);
      return;
    }
    this.isPlaying = false;
  }

  setRef(ref) {
    this.ref = ref;
  }

  render() {
    const {dot, key, dotIndex, ref, ...other} = this.props;
    return (
      <LottieView
        ref={this.setRef}
        source={dot}
        loop={false}
        onAnimationFinish={this.onAnimationFinish}
        renderMode="HARDWARE"
        {...other}
      />
    );
  }
}

export default Dot;
