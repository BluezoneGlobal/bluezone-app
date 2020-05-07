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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FastImage from 'react-native-fast-image';
import {View} from 'react-native';

// Components
import HomeScreen from '../HomeScreen';
import NotifyScreen from '../NotifyScreen';
import InfoScreen from '../InfoScreen';
import InviteScreen from '../InviteScreen';

// Styles
import styles from './style/index.css';

// Language
import message from '../../../msg/tab';
import {injectIntl, intlShape} from 'react-intl';
import {smallest} from '../../../utils/fontSize';

// Consts
const Tab = createBottomTabNavigator();

const icon = {
  Home: require('./style/images/home.png'),
  warning: require('./style/images/ic_warning_normal.png'),
  Invite: require('./style/images/invite.png'),
  Notify: require('./style/images/notify.png'),
  Info: require('./style/images/info.png'),
};

const iconActive = {
  Home: require('./style/images/home_active.png'),
  warning: require('./style/images/ic_warning_active.png'),
  Invite: require('./style/images/invite_active.png'),
  Notify: require('./style/images/notify_active.png'),
  Info: require('./style/images/info_active.png'),
};

class HomeTabScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#015cd0',
          labelStyle: {
            marginBottom: 5,
            fontSize: smallest,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: formatMessage(message.home),
            tabBarIcon: ({focused, color, size}) => (
              <FastImage
                source={focused ? iconActive.Home : icon.Home}
                style={styles.iconSquare}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notify"
          component={NotifyScreen}
          options={{
            tabBarLabel: formatMessage(message.report),
            tabBarIcon: ({focused, color, size}) => (
              <View>
                {/*{!focused && <Badge text="8" style={styles.badge} dot={true} />}*/}
                <FastImage
                  source={focused ? iconActive.Notify : icon.Notify}
                  style={styles.iconSquare}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Invite"
          component={InviteScreen}
          options={{
            tabBarLabel: formatMessage(message.invite),
            tabBarIcon: ({focused, color, size}) => (
              <FastImage
                source={focused ? iconActive.Invite : icon.Invite}
                style={styles.iconRectangle}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{
            tabBarLabel: formatMessage(message.about),
            tabBarIcon: ({focused, color, size}) => (
              <FastImage
                source={focused ? iconActive.Info : icon.Info}
                style={styles.iconSquare}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

HomeTabScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(HomeTabScreen);
