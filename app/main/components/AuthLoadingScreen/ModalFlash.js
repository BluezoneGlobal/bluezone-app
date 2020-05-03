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
import * as PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import {View} from 'react-native';

// Components
import AuthLoadingScreen from './index';

class ModalFlash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleFlash: false,
    };
    this.setLoadingModalFlash = this.setLoadingModalFlash.bind(this);
  }

  setLoadingModalFlash() {
    this.setState({isVisibleFlash: false});
  }

  render() {
    const {isVisibleFlash} = this.state;
    return (
      <Modal
        isVisible={isVisibleFlash}
        style={{justifyContent: 'flex-end', margin: 0}}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={800}
        animationOutTiming={800}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        swipeDirection={['up', 'left', 'right', 'down']}>
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <AuthLoadingScreen setLoading={this.setLoadingModalFlash} />
        </View>
      </Modal>
    );
  }
}

ModalFlash.propTypes = {
  setLoading: PropTypes.func,
};

export default ModalFlash;
