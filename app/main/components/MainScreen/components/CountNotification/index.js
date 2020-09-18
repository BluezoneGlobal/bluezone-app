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

import * as React from 'react';
import * as PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import {withNavigation} from '@react-navigation/compat';

// Component
import Badge from '../Badge';

import {registerNotificationDisplay, setBadge} from '../../../../../core/fcm';
import {
  getTimespanNotification,
  setTimespanNotification,
} from '../../../../../core/storage';
import {getCountNotification} from '../../../../../core/db/SqliteDb';

// Styles
import styles from './styles/index.css';

const handleForcusChangeList = [];

const rigisterForcusTabbar = handleChange => {
  for (let i = 0; i < handleForcusChangeList.length; i++) {
    if (handleForcusChangeList[i] === handleChange) {
      return;
    }
  }
  handleForcusChangeList.push(handleChange);
};

export const broadcastForcusChange = () => {
  for (let i = 0; i < handleForcusChangeList.length; i++) {
    handleForcusChangeList[i]();
  }
};

class CountNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };

    this.getCount = this.getCount.bind(this);
  }

  componentDidMount() {
    // Lấy số count thông báo
    this.getCount();

    // Đăng kí event nhận notify
    this.removeNotificationDisplayedListener = registerNotificationDisplay(
      this.getCount,
    );

    // Đăng kí event click vào tab notify
    // this.props.navigation.addListener('focus', () => {
    //   this.resetCount();
    // });
    rigisterForcusTabbar(this.resetCount);
  }

  componentWillUnmount() {
    // this.removeNotificationDisplayedListener.remove();
  }

  async getCount() {
    const timespanNotification = await getTimespanNotification();
    setTimespanNotification(new Date());
    getCountNotification(timespanNotification || 0, this.addCount);
  }

  addCount = count => {
    this.setState(prevState => {
      return {
        count: prevState.count + count,
      };
    });
  };

  showCount = count => {
    setBadge(count);
    this.setState({
      count,
    });
  };

  resetCount = () => {
    if (this.state.count > 0) {
      setTimespanNotification(new Date());
      this.showCount(0);
    }
  };

  render() {
    const {count} = this.state;
    const {icon, iconActive, focused} = this.props;
    return (
      <Badge count={count}>
        <FastImage
          source={focused ? iconActive : icon}
          style={styles.iconSquare}
        />
      </Badge>
    );
  }
}

CountNotification.propTypes = {
  icon: PropTypes.object,
  iconActive: PropTypes.object,
  focused: PropTypes.bool,
  count: PropTypes.number,
};

export default withNavigation(CountNotification);
