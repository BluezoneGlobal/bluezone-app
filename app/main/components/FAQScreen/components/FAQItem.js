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
import {View, TouchableOpacity, Dimensions, Linking} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';
import Entypo from 'react-native-vector-icons/Entypo';
import HTML from 'react-native-render-html';

// Components
import Text, {MediumText} from '../../../../base/components/Text';

// Styles
import * as fontSize from '../../../../core/fontSize';
import styles, {CUSTOM_STYLES} from './styles/index.css';

class FAQItem extends React.Component {
  constructor(props) {
    super(props);
    this.onLinkPress = this.onLinkPress.bind(this);
    this.openAnswer = this.openAnswer.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {selected, data} = this.props;
    if (nextProps.selected !== selected || nextProps.data !== data) {
      return true;
    }
    return false;
  }

  openAnswer() {
    const {id, openAnswer, index} = this.props;
    openAnswer(id, index);
  }

  onLinkPress(evt, href) {
    Linking.openURL(href).catch(() => console.log('Link lỗi'));
  }

  render() {
    const {data, selected, id, index} = this.props;

    console.log(id);

    if (!data) {
      return null;
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnContainer}
          activeOpacity={1}
          onPress={this.openAnswer}>
          <View style={styles.dot}>
            <Text
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                textAlignVertical: 'center',
                fontWeight: 'bold',
              }}>
              {index + 1}
            </Text>
          </View>
          <MediumText
            style={{
              flex: 1,
              color: '#000',
              lineHeight: 23,
              fontSize: fontSize.normal,
            }}>
            {data.question}
          </MediumText>
          <Entypo
            name={selected ? 'chevron-thin-up' : 'chevron-thin-down'}
            size={12}
            color={'#C4C4C4'}
            style={{paddingLeft: 12}}
          />
        </TouchableOpacity>
        {selected && (
          <HTML
            html={data.answer}
            containerStyle={{paddingTop: 7, marginBottom: -7}}
            tagsStyles={CUSTOM_STYLES}
            imagesMaxWidth={Dimensions.get('window').width}
            allowFontScaling={false}
            onLinkPress={this.onLinkPress}
          />
        )}
      </View>
    );
  }
}

FAQItem.propTypes = {
  intl: intlShape.isRequired,
};

FAQItem.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(FAQItem);
