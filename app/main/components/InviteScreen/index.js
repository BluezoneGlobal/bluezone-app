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
import {View, SafeAreaView, Linking} from 'react-native';
import Share from 'react-native-share';
import * as PropTypes from 'prop-types';

// Components
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import IconBluezone from './styles/images/IconBluezone';

// Language
import message from '../../../core/msg/invite';
import {injectIntl, intlShape} from 'react-intl';

// Configs
import configuration from '../../../configuration';

// Styles
import styles, {LOGO_HEIGHT} from './styles/index.css';

class InviteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onShareApp = this.onShareApp.bind(this);
    this.onAddGroupFace = this.onAddGroupFace.bind(this);
  }

  async onShareApp() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {language} = this.context;
    const {LinkShareAndroid, LinkShareIOS, ShareMessageText} = configuration;
    // const messText = `Bluezone:\n\nPhiên bản IOS: ${LinkShareIOS}\n\nPhiên bản Android:${LinkShareAndroid}`;
    const messText = (language && language !== 'vi'
      ? configuration.ShareMessageText_en
      : configuration.ShareMessageText
    )
      .replace('{LinkShareIOS}', LinkShareIOS)
      .replace('{LinkShareAndroid}', LinkShareAndroid);
    const title = formatMessage(message.share);
    const options = {
      title,
      subject: title,
      message: messText,
    };
    try {
      await Share.open(options);
    } catch (error) {
      // console.log('Huỷ chia sẻ');
    }
  }

  onAddGroupFace() {
    const {language} = this.context;
    const {LinkGroupFace_en, LinkGroupFace} = configuration;
    const link = language === 'vi' ? LinkGroupFace : LinkGroupFace_en;
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        return Linking.openURL(link);
      } else {
        return Linking.openURL(link);
      }
    });
  }

  render() {
    const {route, intl} = this.props;
    const {language} = this.context;
    const header =
      route.params && route.params.header ? route.params.header : false;
    const {formatMessage} = intl;

    const shareAppText =
      language && language !== 'vi'
        ? configuration.ShareAppText_en
        : configuration.ShareAppText;
    const joinGroupText =
      language && language !== 'vi'
        ? configuration.JoinGroupFaceText_en
        : configuration.JoinGroupFaceText;

    return (
      <SafeAreaView style={styles.container}>
        {header ? (
          <Header
            styleTitle={styles.textHeader}
            title={formatMessage(message.title)}
          />
        ) : (
          <View style={styles.header}>
            <MediumText style={styles.textHeader}>
              {formatMessage(message.title)}
            </MediumText>
          </View>
        )}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View>
            <View style={styles.banner}>
              <MediumText style={styles.textBanner}>
                {formatMessage(message.productLabel1)}
              </MediumText>
              <MediumText style={styles.textBanner}>
                {formatMessage(message.productLabel2)}
              </MediumText>
              <MediumText style={styles.textBanner}>
                {formatMessage(message.productLabel3)}
              </MediumText>
            </View>
          </View>
          <View style={styles.imageQR}>
            <IconBluezone width={LOGO_HEIGHT} height={LOGO_HEIGHT} />
          </View>
          <View style={styles.share}>
            <ButtonIconText
              onPress={this.onShareApp}
              text={shareAppText}
              source={require('./styles/images/icon_share.png')}
              styleBtn={styles.btnShare}
              styleText={styles.textBtnShare}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

InviteScreen.propTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object,
};

InviteScreen.defaultProps = {};

InviteScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(InviteScreen);
