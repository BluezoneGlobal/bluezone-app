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
import {Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

// Styles
import styles from './styles/index.css';

function ButtonIconText(props) {
  const {
    disabled,
    source,
    text,
    onPress,
    styleBtn,
    styleText,
    styleIcon,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, styleBtn]}>
      {source && (
        <FastImage source={source} style={[styles.scanImage, styleIcon]} />
      )}
      <Text style={[styles.text, styleText]}>{text}</Text>
    </TouchableOpacity>
  );
}

ButtonIconText.defaultProps = {
  disabled: false,
};

export default ButtonIconText;
