/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/28/2020, 21:55
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
import {View, SafeAreaView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {injectIntl, intlShape} from 'react-intl';

// Components
import {MediumText} from '../../../base/components/Text';
import Header from '../../../base/components/Header';
import FormInput from './Form';

// Util
import * as fontSize from '../../../utils/fontSize';

// Styles
import styles from './styles/index.css';

class Declaration extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      status: 'infected',
    };
  }

  onBack() {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return (
      <SafeAreaView style={styles.container}>
        <Header
          onBack={this.onBack}
          colorIcon={'#015cd0'}
          styleTitle={styles.textHeader}
          showBack
          title={'Khai báo'}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 30,
            alignItems: 'center',
          }}>
          <FastImage
            style={{
              width: 58,
              height: 59,
            }}
            source={require('./styles/images/infected.png')}
          />
          <View
            style={{
              alignItems: 'center',
              marginVertical: 18,
            }}>
            <MediumText
              style={{
                fontSize: fontSize.larger,
                lineHeight: 29,
                textAlign: 'center',
                paddingHorizontal: 21,
              }}>
              Bạn có tiếp xúc với F0
            </MediumText>
          </View>
          <FormInput />
        </View>
      </SafeAreaView>
    );
  }
}

Declaration.propTypes = {
  intl: intlShape.isRequired,
};

Declaration.defaultProps = {};

Declaration.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(Declaration);
