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
import PropTypes from 'prop-types';
import {Linking, View, Platform} from 'react-native';
import Modal from 'react-native-modal';
import {injectIntl} from 'react-intl';
// import Config from 'react-native-config';

// Component
import Text, {MediumText} from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';
import {getCheckVersions} from '../../../core/apis/bluezone';
import {checkPriorityOfNewVersion} from '../../../core/version';

import {
  getVersionCurrent,
  setVersionCurrent,
  setLatestVersionApp,
} from '../../../core/storage';
import {
  creatScheduleUpdateAppNotification,
  clearScheduleUpdateAppNotification,
} from '../../../core/notifyScheduler';
import {CurrentVersionValue} from '../../../core/version';

// Styles
import styles from './styles/index.css';
import message from '../../../core/msg/home';

const Config = {
  TYPE_APP: 'store',
};

class UpdateVersion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalUpdate: false,
      forceUpdate: false,
    };
    this.setModalStatus = this.setModalStatus.bind(this);
  }

  componentDidMount() {
    this.onCheckUpdate();
  }

  onUpdate = () => {
    const {navigation} = this.props;
    this.setState({isModalUpdate: false}, () => {
      if (Config.TYPE_APP === 'web' && Platform.OS === 'android') {
        this.urlUpdate &&
          navigation.navigate('DownloadLatestVersionScreen', {
            url: this.urlUpdate,
          });
      } else {
        this.urlUpdate && Linking.openURL(this.urlUpdate);
      }
    });
  };

  onCancelUpdate = () => {
    this.setState({isModalUpdate: false}, this.setModalStatus);
  };

  async onCheckUpdate() {
    const versionUpdate = await getVersionCurrent();
    if (!versionUpdate) {
      setVersionCurrent(CurrentVersionValue);
    } else {
      if (versionUpdate !== CurrentVersionValue) {
        setVersionCurrent(CurrentVersionValue);
        // Clear notify nhắc bản mới vì vừa cập nhật bản mới thành công
        clearScheduleUpdateAppNotification();
      }
    }

    getCheckVersions(
      async response => {
        const {
          VersionAndroid,
          VersionIOS,
          forceUpdateAndroid,
          forceUpdateIOS,
          recommendedUpdateAndroid,
          recommendedUpdateIOS,
          LinkShareAndroid,
          LinkShareIOS,
          LinkDownloadApk,
          LinkHuawei,
        } = response;

        const _version =
          Platform.OS === 'android' ? VersionAndroid : VersionIOS;
        const _forceUpdate =
          Platform.OS === 'android' ? forceUpdateAndroid : forceUpdateIOS;
        const _recommendUpdate =
          Platform.OS === 'android'
            ? recommendedUpdateAndroid
            : recommendedUpdateIOS;
        const statusUpdate = checkPriorityOfNewVersion(
          _version,
          _forceUpdate,
          _recommendUpdate,
        );

        let urlUpdateAndroid;
        if (Config.TYPE_APP === 'web' && Platform.OS === 'android') {
          urlUpdateAndroid = LinkDownloadApk;
        } else if (Config.TYPE_APP === 'huawei' && Platform.OS === 'android') {
          urlUpdateAndroid = LinkHuawei;
        } else {
          urlUpdateAndroid = LinkShareAndroid;
        }

        this.urlUpdate =
          Platform.OS === 'android' ? urlUpdateAndroid : LinkShareIOS;
        this.lastVerion =
          Platform.OS === 'android' ? VersionAndroid : VersionIOS;

        if (statusUpdate !== 0) {
          // Tạo notification nhắc bản mới
          creatScheduleUpdateAppNotification();
          // Lưu lại thông tin bản mới nhất lấy về được
          setLatestVersionApp(this.lastVerion);

          this.urlUpdate &&
            this.urlUpdate.length > 0 &&
            this.setState({
              isModalUpdate: true,
              forceUpdate: statusUpdate === 1,
            });
          return;
        }
        this.setModalStatus();
      },
      () => {
        this.setModalStatus();
      },
    );
  }

  setModalStatus() {
    const {setModalStatus} = this.props;
    setModalStatus({
      isPermission: true,
    });
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {isModalUpdate, forceUpdate} = this.state;
    return (
      <Modal
        isVisible={isModalUpdate}
        style={styles.modal}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}>
        <View style={styles.container}>
          <View style={styles.textDiv}>
            <MediumText style={styles.textTitle}>
              {formatMessage(message.hasNewVersion)}
            </MediumText>
            <Text style={styles.textCenter}>
              {formatMessage(message.updateVersion)}
            </Text>
          </View>
          <View style={styles.flexRow}>
            {!forceUpdate && (
              <ButtonText
                text={formatMessage(message.Cancel)}
                onPress={this.onCancelUpdate}
                styleText={styles.colorText}
                styleBtn={styles.buttonCancel}
              />
            )}
            <ButtonText
              text={formatMessage(message.Ok)}
              onPress={this.onUpdate}
              styleText={styles.colorText}
              styleBtn={styles.flex}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

UpdateVersion.propTypes = {
  navigation: PropTypes.object,
};

UpdateVersion.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(UpdateVersion);
