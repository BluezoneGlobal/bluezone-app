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

// Components
import {SafeAreaView, StatusBar, View, ScrollView} from 'react-native';

import Text, {MediumText} from '../../../base/components/Text';

// Styles
import styles, {LOGO_HEIGHT} from './styles/index.css';
import {injectIntl, intlShape} from 'react-intl';
import message from '../../../core/msg/intro';

// Logo
import IconBYT from './styles/images/iconBoYTe';
import IconBTT from '../HomeScreen/styles/images/IconBTT';

class IntroductionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.doFinishedWorks = this.doFinishedWorks.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  doFinishedWorks(gotoMainScreen) {
    const {name, onFinished} = this.props;
    onFinished(name, {}, gotoMainScreen);
  }

  onContinue() {
    this.doFinishedWorks(false);
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView>
          <View style={styles.containerLogo}>
            <IconBTT height={LOGO_HEIGHT} width={LOGO_HEIGHT} />
            <View style={styles.borderLogo} />
            <IconBYT height={LOGO_HEIGHT} width={LOGO_HEIGHT} />
          </View>
          <View style={styles.body}>
            <View style={styles.viewDep}>
              <Text style={styles.description}>
                {formatMessage(message.description)}
              </Text>
              <MediumText style={styles.title}>
                {formatMessage(message.title)}
              </MediumText>
            </View>
          </View>
        </ScrollView>
        <View style={styles.boxButton}>
          <Text style={styles.button} onPress={this.onContinue}>
            {formatMessage(message.button)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

IntroductionScreen.propTypes = {
  intl: intlShape.isRequired,
};

IntroductionScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(IntroductionScreen);
