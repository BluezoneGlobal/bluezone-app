/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/12/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';
import Error from './Error';
import Header from '../../../base/components/Header';

class PageViewScreen extends Component {
  constructor(props) {
    super(props);
    this.reload = this.reload.bind(this);
  }

  setRef = ref => {
    this._bridge = ref;
  };

  reload() {
    if (this._bridge) {
      this._bridge.reload();
    }
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={'#3f51b5'}
        size={'large'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  renderError = () => <Error onPress={this.reload} />;

  render() {
    const {route} = this.props;
    const item = route.params?.item;
    const data = item?.data;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <StatusBar hidden={true} />
        <Header
          colorIcon={'#000000'}
          styleHeader={{marginTop: 20}}
          styleTitle={{paddingHorizontal: 50}}
          title={item.title}
        />
        <WebView
          ref={this.setRef}
          source={{
            uri: data?.Link,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
          thirdPartyCookiesEnabled={true}
          javaScriptEnabledAndroid={true}
          renderLoading={this.ActivityIndicatorLoadingView}
          onLoad={this.ActivityIndicatorLoadingView}
          geolocationEnabled={true}
          renderError={this.renderError}
        />
      </SafeAreaView>
    );
  }
}

PageViewScreen.propTypes = {
  navigation: PropTypes.object,
  token: PropTypes.string,
  domain: PropTypes.string,
};
export default PageViewScreen;
