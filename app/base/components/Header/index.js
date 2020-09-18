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
import {BackHandler, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {withNavigation} from '@react-navigation/compat';

// Components
import {MediumText} from '../Text';

// Styles
import styles from './styles/index.css';
import {blue_bluezone} from '../../../core/color';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onGoBack = this.onGoBack.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onGoBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onGoBack);
  }

  onGoBack() {
    const {onBack, showBack} = this.props;

    if (!showBack) {
      return;
    }

    if (onBack) {
      onBack();
      return;
    }
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const {showBack, title, styleHeader, styleTitle, colorIcon} = this.props;
    return (
      <View style={[styles.container, styleHeader]}>
        {showBack && (
          <TouchableOpacity onPress={this.onGoBack} style={styles.btnBack}>
            <Ionicons
              name={'ios-arrow-back'}
              size={28}
              style={styles.icon}
              color={colorIcon}
            />
          </TouchableOpacity>
        )}
        <View style={styles.title}>
          <MediumText style={[styles.textTitle, styleTitle]}>
            {title}
          </MediumText>
        </View>
      </View>
    );
  }
}

Header.defaultProps = {
  colorIcon: blue_bluezone,
  showBack: true,
};

export default withNavigation(Header);
