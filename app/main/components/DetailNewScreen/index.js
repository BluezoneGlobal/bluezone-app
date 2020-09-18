/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/13/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import React from 'react';
import {ScrollView, SafeAreaView, Dimensions} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';
import HTML from 'react-native-render-html';
import 'moment/locale/vi'; // without this line it didn't work

// Api
import {getNews} from '../../../core/apis/bluezone';

// Components
import Header from '../../../base/components/Header';

// Styles
import {CUSTOM_STYLES} from './styles/index.css';
import configuration from '../../../configuration';

class DetailNewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: {},
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const item = route.params?.item;
    const data = item?.data;
    this.BzNewId = data?.BzNewId;
    getNews(
      this.BzNewId,
      data => {
        this.setState({
          news: data?.BzEntry?.[this.BzNewId],
        });
      },
      this.getNewFail,
    );
  }

  getNewFail(repponse) {}

  render() {
    const {news} = this.state;
    const {route} = this.props;
    const item = (route && route.params.item) || {};
    const {Language} = configuration;
    //
    const title =
      (Language === 'vi' ? item.title : item.titleEn) ||
      item.title ||
      item.titleEn;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Header
          colorIcon={'#000000'}
          styleHeader={{marginTop: 20}}
          styleTitle={{paddingHorizontal: 50}}
          title={title}
        />
        <ScrollView>
          <HTML
            html={news?.data?.content}
            tagsStyles={CUSTOM_STYLES}
            imagesMaxWidth={Dimensions.get('window').width}
            allowFontScaling={false}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

DetailNewScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailNewScreen);
