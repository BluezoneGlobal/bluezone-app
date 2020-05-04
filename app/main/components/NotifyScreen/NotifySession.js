/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 10:12
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
import {MediumText} from '../../../base/components/Text';
import NotifyList from './NotifyList';

// Styles
import styles from './styles/index.css';

class NotifySession extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const {type, title, styleTitle, styleTextTitle, data, onGet} = this.props;
    return (
      <View style={{height: 250}}>
        <View style={styleTitle}>
          <MediumText style={styleTextTitle}>{title}</MediumText>
        </View>
        <View style={styles.notifies}>
          <NotifyList onGet={onGet} type={type} data={data} />
        </View>
      </View>
    );
  }
}

export default NotifySession;
