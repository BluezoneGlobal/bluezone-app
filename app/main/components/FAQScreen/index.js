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
import {
  SafeAreaView,
  StatusBar,
  Platform,
  UIManager,
  FlatList,
} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

// Components
import FAQItem from './components/FAQItem';
import Header from '../../../base/components/Header';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';

import message from '../../../core/msg/tab';

import configuration from '../../../configuration';
import dataFAQ, {syncQuestionFAQ} from './data/dataFAQ';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class FAQScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idFAQSelected: null,
      index: null,
      dataFAQ: dataFAQ,
      render: false,
    };

    this.renderItem = this.renderItem.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    syncQuestionFAQ(this.test);

    this.setState({
      render: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.render && !prevState.render) {
      const {route} = this.props;
      const id = route?.params?.idFAQSelected;
      const index = route?.params?.indexFAQSelected;
      if (id && index) {
        this.timer = setTimeout(() => {
          this.openAnswer(id, index);
        }, 400);
      }
    }

    if (
      this.state.idFAQSelected &&
      prevState.idFAQSelected !== this.state.idFAQSelected
    ) {
      this.scrollToIndexTimeout(this.state.index);
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  test = data => {
    this.setState({dataFAQ: data});
  };

  openAnswer = (id, index) => {
    // LayoutAnimation.configureNext({
    //   duration: 100,
    //   create: {
    //     type: LayoutAnimation.Types.linear,
    //     property: LayoutAnimation.Properties.opacity,
    //   },
    //   update: {
    //     type: LayoutAnimation.Types.linear,
    //   },
    // });
    if (id === this.state.idFAQSelected) {
      this.setState({
        idFAQSelected: null,
      });
      return;
    }
    this.setState({
      idFAQSelected: id,
      index: index,
    });
  };

  onClickNavigateToChatBot = () => {
    this.props.navigation.push('Chatbot');
  };

  renderItem({item, index}) {
    const {idFAQSelected, dataFAQ} = this.state;
    const FAQ = dataFAQ.FAQ;
    return (
      <FAQItem
        id={item}
        data={FAQ[item]}
        openAnswer={this.openAnswer}
        index={index}
        selected={idFAQSelected === item}
      />
    );
  }

  scrollToIndexTimeout(index) {
    setTimeout(() => {
      this.scrollToIndex(index);
    }, 100);
  }

  scrollToIndex(index) {
    this.flatListRef &&
      this.flatListRef.scrollToIndex({animated: true, index: index});
  }

  setRef(ref) {
    this.flatListRef = ref;
  }

  render() {
    const {dataFAQ, render} = this.state;
    const {intl, showBack} = this.props;
    const {formatMessage} = intl;
    const {Language} = configuration;
    const itemIds = dataFAQ.HasFAQ[Language].itemIds;

    if (!render) {
      return null;
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <StatusBar hidden={true} />
        <Header
          title={formatMessage(message.faq)}
          showBack={showBack}
          styleHeader={styles.header}
          styleTitle={{color: '#015cd0', fontSize: fontSize.bigger}}
        />
        <FlatList
          style={{flex: 1}}
          ref={this.setRef}
          data={itemIds}
          keyExtractor={item => item}
          renderItem={this.renderItem}
          initialNumToRender={50}
        />
        {/*<ButtonIconText*/}
        {/*  onPress={this.onClickNavigateToChatBot}*/}
        {/*  source={require('./styles/images/chatbot.png')}*/}
        {/*  styleBtn={styles.btnIcon}*/}
        {/*  styleIcon={styles.styleIcon}*/}
        {/*/>*/}
        {/*<ButtonText*/}
        {/*  text="Chatbot"*/}
        {/*  styleBtn={styles.btnTitle}*/}
        {/*  styleText={styles.textButton}*/}
        {/*  omPress={this.scrollToIndex(5)}*/}
        {/*/>*/}
      </SafeAreaView>
    );
  }
}

FAQScreen.propTypes = {
  intl: intlShape.isRequired,
};

FAQScreen.contextTypes = {
  language: PropTypes.string,
};

FAQScreen.defaultProps = {
  showBack: false,
};

export default injectIntl(FAQScreen);
