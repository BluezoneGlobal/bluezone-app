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
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FastImage from 'react-native-fast-image';
import {injectIntl, intlShape} from 'react-intl';

// Components
import HomeScreen from '../HomeScreen';
import NotifyScreen from '../NotifyScreen';
import InfoScreen from '../InfoScreen';
import FAQScreen from '../FAQScreen';
import CountNotifications, {
  broadcastForcusChange,
} from './components/CountNotification';
import Text from '../../../base/components/Text';

import {isIPhoneX} from '../../../core/utils/isIPhoneX';

// Language
import message from '../../../core/msg/tab';

// Styles
import styles from './style/index.css';
import {smallest} from '../../../core/fontSize';
import {TAB_BAR_HEIGHT, TAB_BAR_IPHONEX_HEIGHT} from './style/index.css';

// Consts
const Tab = createMaterialTopTabNavigator();

const icon = {
  Home: require('./style/images/home.png'),
  warning: require('./style/images/ic_warning_normal.png'),
  Invite: require('./style/images/invite.png'),
  Notify: require('./style/images/notify.png'),
  Info: require('./style/images/info.png'),
  Faq: require('./style/images/faq.png'),
};

const iconActive = {
  Home: require('./style/images/home_active.png'),
  warning: require('./style/images/ic_warning_active.png'),
  Invite: require('./style/images/invite_active.png'),
  Notify: require('./style/images/notify_active.png'),
  Info: require('./style/images/info_active.png'),
  Faq: require('./style/images/faq_active.png'),
};

class HomeTabScreen extends React.Component {
  constructor(props) {
    super(props);
    this.db = null;
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBarPosition={'bottom'}
        tabBarOptions={{
          showIcon: true,
          activeTintColor: '#015cd0',
          inactiveTintColor: '#f2f2f2',
          indicatorStyle: {
            opacity: 0,
          },
          style: {
            borderTopColor: '#dddddd',
            borderTopWidth: 0.5,
            height: isIPhoneX ? TAB_BAR_IPHONEX_HEIGHT : TAB_BAR_HEIGHT,
          },
          tabStyle: {
            height: TAB_BAR_HEIGHT,
          },
          labelStyle: {
            fontSize: smallest,
            textTransform: 'capitalize',
          },
          allowFontScaling: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                text={formatMessage(message.home)}
                style={[
                  {
                    color: focused ? '#015cd0' : '#747474',
                  },
                  styles.labelStyle,
                ]}
              />
            ),
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
            tabBarLabel: ({focused}) => (
              <Text
                text={formatMessage(message.report)}
                style={[
                  styles.labelStyle,
                  {
                    color: focused ? '#015cd0' : '#747474',
                  },
                ]}
              />
            ),
            tabBarIcon: ({focused, color, size, navigate}) => (
              <CountNotifications
                focused={focused}
                icon={icon.Notify}
                iconActive={iconActive.Notify}
              />
            ),
          }}
          listeners={({navigation, route}) => ({
            focus: () => {
              broadcastForcusChange();
            },
          })}
        />
        <Tab.Screen
          name="FAQ"
          component={FAQScreen}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                text={formatMessage(message.faq)}
                style={[
                  styles.labelStyle,
                  {
                    color: focused ? '#015cd0' : '#747474',
                    paddingLeft: 3,
                  },
                ]}
              />
            ),
            tabBarIcon: ({focused, color, size}) => (
              <FastImage
                source={focused ? iconActive.Faq : icon.Faq}
                style={styles.iconFaq}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                text={formatMessage(message.about)}
                style={[
                  styles.labelStyle,
                  {
                    color: focused ? '#015cd0' : '#747474',
                  },
                ]}
              />
            ),
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
