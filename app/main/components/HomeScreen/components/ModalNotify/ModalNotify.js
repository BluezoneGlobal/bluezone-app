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
import {View} from 'react-native';
import ButtonText from '../../../../../base/components/ButtonText';
import ModalBase from '../../../../../base/components/ModalBase';

import message from '../../../../../core/msg/home';
import {injectIntl, intlShape} from 'react-intl';

import styles from './styles/index.css';

class ModalNotify extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {isVisible, content, onPress, btnText, intl} = this.props;
    const {formatMessage} = intl;
    return (
      <ModalBase
        isVisibleModal={isVisible}
        title={formatMessage(message.report)}
        description={content}
        styleTitle={styles.textTitle}
        styleDescription={styles.textContent}>
        <View style={styles.container}>
          <ButtonText
            text={btnText}
            onPress={onPress}
            styleBtn={styles.buttonConfirm}
            styleText={styles.textButtonConfirm}
          />
        </View>
      </ModalBase>
    );
  }
}

ModalNotify.propTypes = {
  btnText: PropTypes.string,
  intl: intlShape.isRequired,
};

ModalNotify.defaultProps = {
  btnText: 'OK',
  onPress: () => {},
};

export default injectIntl(ModalNotify);
