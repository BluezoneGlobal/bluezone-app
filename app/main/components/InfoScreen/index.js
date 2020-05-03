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
import 'react-native-get-random-values';
import * as PropTypes from 'prop-types';

// Components
import {SafeAreaView, StatusBar, BackHandler} from 'react-native';
import WebView from 'react-native-webview';
import Error from './Error';

// Utils
import configuration from '../../../Configuration';

// Styles
import styles from './styles/index.css';

class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backButtonEnabled: null,
    };
    this.onGoBack = this.onGoBack.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onGoBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onGoBack);
  }

  setRef = ref => {
    this._bridge = ref;
  };

  onGoBack() {
    if (this.state.backButtonEnabled) {
      this._bridge.goBack();
      return true;
    }
  }

  onNavigationStateChange = navState => {
    if (navState.canGoBack !== this.state.backButtonEnabled) {
      this.setState({
        backButtonEnabled: navState.canGoBack,
      });
    }
  };

  renderError = () => <Error onPress={this.reload} />;

  reload() {
    if (this._bridge) {
      this._bridge.reload();
    }
  }

  render() {
    const {language} = this.context;

    const url =
      language && language !== 'vi'
        ? configuration.Introduce_en
        : configuration.Introduce;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <WebView
          // style={styles.flex}
          ref={this.setRef}
          source={{uri: url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
          thirdPartyCookiesEnabled={true}
          javaScriptEnabledAndroid={true}
          onNavigationStateChange={this.onNavigationStateChange}
          renderError={this.renderError}
        />
      </SafeAreaView>
    );
  }
}

InfoScreen.contextTypes = {
  language: PropTypes.object,
};

export default InfoScreen;
