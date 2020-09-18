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
import {View} from 'react-native';

// Components
import Text from '../Text';

// Style
import styles from './styles/index.css';
import {blue_bluezone} from '../../../core/color';

function CountBlueZoner(props) {
  const {backgroundColor, countBlueZone} = props;
  return (
    <View style={styles.infoBluezone}>
      <View style={[styles.infoBluezone1, {backgroundColor: backgroundColor}]}>
        <Text style={styles.infoItemValue}>{countBlueZone}</Text>
      </View>
    </View>
  );
}

CountBlueZoner.defaultProps = {
  backgroundColor: blue_bluezone,
  countBlueZone: 0,
};

export default CountBlueZoner;
