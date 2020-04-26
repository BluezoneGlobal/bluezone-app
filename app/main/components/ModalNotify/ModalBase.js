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
import PropTypes from 'prop-types';

// Components
import Modal from 'react-native-modal';
import {View} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';

// Styles
import styles from './styles/index.css';

class ModalBase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {isVisible, content, onPress, btnText} = this.props;
    return (
      <Modal
        isVisible={isVisible}
        style={styles.modalBase}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}>
        <View style={styles.container}>
          <View style={styles.textDiv}>
            <MediumText style={styles.textTitle}>Thông báo</MediumText>
            <Text style={styles.textContent}>{content}</Text>
          </View>
          <ButtonText
            text={btnText}
            onPress={onPress}
            styleBtn={styles.buttonConfirm}
            styleText={styles.textButtonConfirm}
          />
        </View>
      </Modal>
    );
  }
}

ModalBase.propTypes = {
  btnText: PropTypes.string,
};

ModalBase.defaultProps = {
  btnText: 'OK',
  onPress: () => {},
};

export default ModalBase;
