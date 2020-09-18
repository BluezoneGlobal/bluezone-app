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
import {SafeAreaView, StatusBar, View, Linking, ScrollView} from 'react-native';

// Components
import Text, {MediumText} from '../../../base/components/Text';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Api
import Service from '../../../core/apis/service';
import log from '../../../core/log';

// Styles
import styles, {LOGO_HEIGHT} from './styles/index.css';
import message from '../../../core/msg/info';

// Logo
import IconBYT from '../HomeScreen/styles/images/IconBYT';
import IconBTT from '../HomeScreen/styles/images/IconBTT';
import warning from '../../../core/msg/warning';
import * as fontSize from '../../../core/fontSize';
import configuration from '../../../configuration';

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: Service.getVersion(),
      logText: null,
    };
    this.countLog = 0;

    this.onSendHistory = this.onSendHistory.bind(this);
    this.onClickLinkDetail = this.onClickLinkDetail.bind(this);
    this.onClickLinkDetail1 = this.onClickLinkDetail1.bind(this);
    this.onClickMail = this.onClickMail.bind(this);
    this.viewLog = this.viewLog.bind(this);
  }

  componentDidMount() {
    log.addListener(this.handleLog);
  }

  componentWillUnmount() {
    this.timeoutLog && clearTimeout(this.timeoutLog);
  }

  handleLog = ({key}) => {
    if (key.indexOf('F01OTP') < 0) {
      return;
    }
    this.setState({
      logText: key,
    });
  };

  onSendHistory() {
    this.props.navigation.navigate('HistoryUploadedByOTP');
  }

  onClickLinkDetail() {
    const {language} = this.context;
    const LinkDetail =
      language === 'vi' ? configuration.LinkDetail : configuration.LinkDetailEn;
    if (!LinkDetail) {
      return;
    }

    Linking.canOpenURL(LinkDetail).then(supported => {
      if (supported) {
        Linking.openURL(LinkDetail);
        return false;
      }
    });
  }

  onClickLinkDetail1() {
    const {language} = this.context;
    const LinkDetail1 =
      language === 'vi' ? configuration.LinkRulesVi : configuration.LinkRulesEn;
    if (!LinkDetail1) {
      return;
    }

    Linking.canOpenURL(LinkDetail1).then(supported => {
      if (supported) {
        Linking.openURL(LinkDetail1);
        return false;
      }
    });
  }

  onClickMail() {
    const MailTo = configuration.MailTo;
    if (!MailTo) {
      return;
    }
    Linking.openURL(`mailto:${MailTo}`);
  }

  viewLog() {
    this.countLog++;
    if (this.timeoutLog) {
      clearTimeout(this.timeoutLog);
    }
    this.timeoutLog = setTimeout(() => {
      this.countLog = 0;
      this.timeoutLog = null;
    }, 1000);
    if (this.countLog === 7) {
      this.props.navigation.navigate('ViewLog');
      this.countLog = 0;
    }
  }

  render() {
    const {version, logText} = this.state;
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
            <View />
            <View style={{marginTop: 10}}>
              <MediumText style={styles.title}>
                {formatMessage(message.title)} {version}
              </MediumText>
            </View>
            <ButtonIconText
              onPress={this.onSendHistory}
              text={formatMessage(warning.uploadText)}
              source={require('../NotifyWarning/styles/images/send.png')}
              styleBtn={styles.buttonSend}
              styleText={{fontSize: fontSize.normal}}
              styleIcon={styles.buttonIcon}
            />
            {logText && (
              <Text
                style={{
                  fontSize: fontSize.normal,
                  textAlign: 'center',
                  color: '#000',
                }}>
                {logText}
              </Text>
            )}
            <Text style={styles.note} onPress={this.viewLog}>
              {formatMessage(message.note)}
            </Text>
            <View style={styles.viewDep}>
              <Text style={styles.description}>
                {formatMessage(message.description)}
              </Text>
            </View>
            <Text />
            <View>
              <Text style={styles.textContact}>
                {formatMessage(message.detail)}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.linkweb} onPress={this.onClickLinkDetail}>
                  {formatMessage(message.linkDetail)}
                </Text>
              </View>
            </View>
            <Text />
            <View>
              <Text style={styles.textContact}>
                {formatMessage(message.infoDetail)}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.linkweb} onPress={this.onClickMail}>
                  {formatMessage(message.email)}
                </Text>
              </View>
            </View>
            <Text />
            <View>
              <Text style={styles.textContact}>
                {formatMessage(message.infoDetail1)}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text
                  style={[styles.linkweb]}
                  onPress={this.onClickLinkDetail1}>
                  {formatMessage(message.linkDetail1)}
                </Text>
              </View>
            </View>
            <Text />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

InfoScreen.propTypes = {
  intl: intlShape.isRequired,
};

InfoScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(InfoScreen);
