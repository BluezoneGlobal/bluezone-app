/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 09:59
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
import {View, ScrollView, SafeAreaView} from 'react-native';

// Components
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import NotifySection from './NotifySession';
// import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles from './styles/index.css';
// import InviteScreen from "../InviteScreen";

class NotifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  onPressWarning = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyWarning', {item});
  };

  onPressNotification = item => {
    // doSomething.
    this.props.navigation.navigate('NotifyDetail', {item});
  };

  render() {
    const {route} = this.props;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const dataWar = {
      items: [
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định tiếp xúc ...',
          content: 'Bạn được xác định tiếp xúc ...',
          timer: '14:03',
          date: '22/04/2020',
          unRead: true,
        },
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn có thể đã tiếp xúc với F0',
          content: 'Bạn có thể đã tiếp xúc với F0',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định là F0',
          content: 'Bạn được xác định là F0',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định là F0',
          content: 'Bạn được xác định là F0',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định là F0',
          content: 'Bạn được xác định là F0',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
      ],
      callback: {
        onPress: this.onPressWarning,
      },
    };

    const dataNtf = {
      items: [
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định tiếp xúc ...',
          content: 'Bạn được xác định tiếp xúc ...',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
        {
          avatar: 'boyte',
          title: 'Bộ Y tế',
          description: 'Cách ly thêm 1 tuần đối với Hà...',
          content: 'Cách ly thêm 1 tuần đối với Hà...',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
        {
          avatar: 'bluezone',
          title: 'Bluezone',
          description: 'Bạn được xác định là F0',
          content: 'Bạn được xác định là F0',
          timer: '14:03',
          date: '22/04/2020',
          unRead: false,
        },
      ],
      callback: {
        onPress: this.onPressNotification,
      },
    };

    return (
      <SafeAreaView style={styles.container}>
        {header ? (
          <Header
            onBack={this.onBack}
            colorIcon={'#015cd0'}
            styleTitle={styles.textHeader}
            showBack
            title={'Thông báo'}
          />
        ) : (
          <ScrollView>
            <View style={styles.header}>
              <MediumText style={styles.textHeader}>Thông báo</MediumText>
            </View>
            <>
              <View style={styles.wrapper}>
                {/*<NotifySection*/}
                {/*  title={'Cảnh báo'}*/}
                {/*  data={dataWar}*/}
                {/*  styleTitle={styles.titleWar}*/}
                {/*  styleTextTitle={styles.textTitleWar}*/}
                {/*/>*/}
                <NotifySection
                  title={'Thông báo'}
                  data={dataNtf}
                  styleTitle={styles.titleNtf}
                  styleTextTitle={styles.textTitleNtf}
                />
              </View>
            </>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

export default NotifyScreen;
