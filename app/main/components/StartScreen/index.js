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
import * as PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

// Components
import {SafeAreaView, StatusBar, View, ScrollView} from 'react-native';
import Text, {MediumText} from '../../../base/components/Text';

// Styles
import styles from './styles/index.css';
import message from '../../../core/msg/start';

class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.doFinishedWorks = this.doFinishedWorks.bind(this);
    this.onStart = this.onStart.bind(this);
  }

  doFinishedWorks(gotoMainScreen = false, goBack = false) {
    const {name, onFinished} = this.props;
    onFinished(name, {}, gotoMainScreen, goBack);
    return;
  }

  onStart() {
    this.doFinishedWorks(true);
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView>
          <View style={styles.containerLogo}>
            <MediumText style={styles.title}>Bluezone</MediumText>
          </View>
          <View style={styles.body}>
            <View style={styles.viewDep}>
              <Text style={styles.description}>
                <MediumText>
                  {formatMessage(message.appRememberTitle)}
                </MediumText>
                {formatMessage(message.appRememberDescription)}
              </Text>
              <Text />
              <Text style={styles.description}>
                <MediumText>{formatMessage(message.warningTitle)}</MediumText>
                {formatMessage(message.warningDescription)}
              </Text>
              <Text />
              <Text style={styles.description}>
                <MediumText>
                  {formatMessage(message.dataSecurityTitle)}
                </MediumText>
                {formatMessage(message.dataSecurityDescription)}
              </Text>
              <Text />
              <Text style={styles.description}>
                {formatMessage(message.saveHistory)}
                <MediumText style={styles.dataSecurityTitle}>
                  {formatMessage(message.saveHistoryTitle)}
                </MediumText>
                {formatMessage(message.saveHistoryDescription)}
              </Text>
              <Text />
              <Text style={styles.description}>
                <MediumText>
                  {formatMessage(message.startBluetoothTitle)}
                </MediumText>
                {formatMessage(message.startBluetoothDescription)}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.boxButton}>
          <Text style={styles.button} onPress={this.onStart}>
            {formatMessage(message.button)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

StartScreen.propTypes = {
  intl: intlShape.isRequired,
};

StartScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(StartScreen);
