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
import {View, SafeAreaView, Alert, BackHandler} from 'react-native';
import RNFS from 'react-native-fs';
import ProgressBar from 'react-native-progress/Bar';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import {injectIntl, intlShape} from 'react-intl';

// Components
import Text from '../../../base/components/Text';

// Image
import iconBluezone from './images/icon_bluezone.png';
import updateMessage from '../../../core/msg/update';

const fileName = 'lastVersion.apk';

class DownloadLatestVersion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      downloadSuccess: false,
      statusButton: 'download',
    };
    this.unmount = false;
  }

  componentDidMount() {
    this.onDownload();
    BackHandler.addEventListener('hardwareBackPress', this.onGoBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onGoBack);
    this.unmount = true;
    this.jobId && RNFS.stopDownload(this.jobId);
  }

  onGoBack = () => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    Alert.alert(
      formatMessage(updateMessage.stopUpdateTitle),
      formatMessage(updateMessage.stopUpdateContent),
      [
        {
          text: formatMessage(updateMessage.continueButton),
          onPress: () => {},
        },
        {
          text: formatMessage(updateMessage.stopUpdateButton),
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ],
    );
    return true;
  };

  onDownload = () => {
    const {route, navigation, intl} = this.props;
    const {formatMessage} = intl;
    const {url} = route.params;
    const {jobId, promise} = RNFS.downloadFile({
      fromUrl: url,
      toFile: RNFS.DocumentDirectoryPath + '/' + fileName,
      progressInterval: 100,
      // progressDivider: number,
      progress: ({bytesWritten, contentLength}) => {
        const t = Math.round((bytesWritten / contentLength) * 100) / 100;
        if (t !== this.state.progress) {
          this.setState({
            progress: t,
          });
        }
      },
    });

    this.jobId = jobId;
    promise
      .then(success => {
        !this.unmount &&
          this.setState({
            progress: 1,
            downloadSuccess: true,
          });
      })
      .catch(e => {
        if (this.unmount) {
          return;
        }
        Alert.alert(
          formatMessage(updateMessage.errorTitle),
          formatMessage(updateMessage.errorContent),
          [
            {
              text: formatMessage(updateMessage.close),
              onPress: () => {
                navigation.goBack();
              },
            },
            {
              text: formatMessage(updateMessage.retry),
              onPress: () => {
                this.onDownload();
              },
            },
          ],
        );
      });
  };

  install = async () => {
    await RNFetchBlob.android.actionViewIntent(
      RNFS.DocumentDirectoryPath + '/' + fileName,
      'application/vnd.android.package-archive',
    );
  };

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {progress, downloadSuccess} = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '50%',
          }}>
          <FastImage style={{width: 100, height: 100}} source={iconBluezone} />
        </View>

        <View
          style={{
            marginHorizontal: 30,
          }}>
          <View style={{flexDirection: 'row', paddingVertical: 8}}>
            <Text
              style={{
                fontSize: 14,
                color: '#6A6A6A',
                flex: 1,
              }}>
              {downloadSuccess
                ? formatMessage(updateMessage.downloadFinish)
                : formatMessage(updateMessage.downloading)}
            </Text>
            {!downloadSuccess && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#6A6A6A',
                }}>
                {Math.round(progress * 100)} %
              </Text>
            )}
          </View>
          <ProgressBar
            progress={progress}
            width={null}
            borderRadius={0}
            unfilledColor={'#DBDBDB'}
            color={'#015cd0'}
            borderColor={'blue'}
            height={4}
            borderWidth={0}
          />
        </View>

        <Text
          style={{
            fontSize: 16,
            backgroundColor: downloadSuccess ? '#015cd0' : '#DBDBDB',
            color: '#FFFFFF',
            padding: 10,
            textAlign: 'center',
            marginHorizontal: 30,
            marginTop: 20,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
          disabled={!downloadSuccess}
          onPress={this.install}>
          {formatMessage(updateMessage.updateButton)}
        </Text>
      </SafeAreaView>
    );
  }
}

DownloadLatestVersion.propTypes = {
  navigation: PropTypes.string,
  route: PropTypes.object,
};

export default injectIntl(DownloadLatestVersion);
