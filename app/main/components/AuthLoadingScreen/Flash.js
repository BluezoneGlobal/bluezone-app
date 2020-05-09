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
import {SafeAreaView, StatusBar, View} from 'react-native';

// Components
import styles, {
  CONTAINER_MARGINVERTICAL,
  LOGO_HEIGHT,
} from './styles/index.css';
import IconBluezone from './styles/images/IconBluezone';
import FastImage from 'react-native-fast-image';
import {MediumText} from '../../../base/components/Text';
import message from '../../../msg/auth';
import {injectIntl, intlShape} from 'react-intl';
import ButtonText from '../../../base/components/ButtonText';

class Flash extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.setLoadingModalFlash();
    }, 2500);
  }

  onBack() {
    this.props.setLoadingModalFlash();
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.modalFlash}>
          <IconBluezone width={LOGO_HEIGHT} height={LOGO_HEIGHT} />
          <View style={styles.body}>
            <FastImage
              source={require('./styles/images/success.png')}
              style={styles.icon_success}
            />
            <MediumText
              text={formatMessage(message.label1)}
              style={styles.text}
            />
            <MediumText
              text={formatMessage(message.label2)}
              style={styles.text}
            />
          </View>
        </View>
        <ButtonText
          text={`${formatMessage(message.close)}`}
          onPress={this.onBack}
          styleBtn={styles.buttonInvite}
          styleText={styles.textInvite}
        />
      </SafeAreaView>
    );
  }
}

Flash.propTypes = {
  intl: intlShape.isRequired,
  setLoadingModalFlash: PropTypes.func,
};

export default injectIntl(Flash);
