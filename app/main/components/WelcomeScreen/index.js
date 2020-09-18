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
import moment from 'moment';

// Api
import {dev} from '../../../core/apis/server';

// Components
import {
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Header from './Header/Header';
import HeaderFull from './Header/HeaderFull';
import ImageBackgroundBase from './ImageBackgroundBase';

import Text, {LightText} from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';
import ButtonIconText from '../../../base/components/ButtonIconText';

// Styles
import styles, {
  HEIGHT_HEADER,
  HEIGHT_IMG,
  HEIGHT_DEFAULT,
} from './styles/index.css';
import {injectIntl, intlShape} from 'react-intl';
import {Images, dataVi, dataEn, dayVi, dayEn, monthEn} from './styles/images';
import * as fontSize from '../../../core/fontSize';

// Utils
import configuration from '../../../configuration';
import getLunarDate from './utils/amlich-hnd';
import {can, canEn, chi, chiEn} from './utils/ConvertToCanchi';
import {ButtonConfirm} from '../../../base/components/ButtonText/ButtonModal';
import ModalBase from '../../../base/components/ModalBase';
import message from '../../../core/msg/welcome';
import {
  getDateOfWelcome,
  setDateOfWelcome,
  getDisplayOriginalImg,
  setDisplayOriginalImg,
} from '../../../core/storage';
import messageWarning from '../../../core/msg/warning';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    const {width} = Dimensions.get('window');
    this.state = {
      width: width,
      date: new Date(),
      isVisible: false,
      setHeight: 0,
      heightImg: 0,
      images: {},
      info: {},
      display: 'fit',
      textF: this.getTextByLevel(),
    };
    this.onDimensionsChange = this.onDimensionsChange.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
  }

  async componentDidMount() {
    const {Language} = configuration;
    this.changeDisplay();
    const infoDates = await getDateOfWelcome();
    const date = infoDates ? infoDates.date : '';
    const image = infoDates ? infoDates.image : null;
    const maxim = infoDates ? infoDates.maxim : null;
    const dayOfWeek = this.getDate();
    const data = Language === 'vi' ? dataVi : dataEn;
    if (date === dayOfWeek) {
      this.setState({
        images: Images[image],
        info: data[maxim],
      });
    } else {
      const imgNumber = this.getRandomInt(Images.length);
      const maximNumber = this.getRandomInt(data.length);
      setDateOfWelcome({
        date: dayOfWeek,
        image: imgNumber,
        maxim: maximNumber,
      });
      this.setState({
        images: Images[imgNumber],
        info: data[maximNumber],
      });
    }
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  onDimensionsChange(e) {
    this.setState({
      width: e.window.width,
    });
  }

  async changeDisplay() {
    const displayImg = await getDisplayOriginalImg();
    if (displayImg) {
      this.setState({display: displayImg});
    }
  }

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  getDate = () => {
    const {Language} = configuration;
    const {date} = this.state;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (Language === 'vi') {
      return `${day}/${month}/${year}`;
    }
    return `${monthEn[month - 1]} ${day}, ${year}`;
  };

  getLunar = () => {
    const {Language} = configuration;
    const {date} = this.state;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const lunarDate = getLunarDate(day, month, year);
    if (Language === 'vi') {
      return `${lunarDate.day} tháng ${lunarDate.month} ${
        can[(year + 6) % 10]
      } ${chi[(year + 8) % 12]}`;
    }
    return `${monthEn[lunarDate.month - 1]} ${lunarDate.day}, ${
      canEn[(year + 6) % 10]
    } ${chiEn[(year + 8) % 12]} Year`;
  };

  onSelect = () => {
    this.setState({isVisible: true});
  };

  onClose = () => {
    this.setState({isVisible: false});
  };

  onLayout = e => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    });
    if (e.nativeEvent.layout.height > HEIGHT_DEFAULT) {
      this.setState({setHeight: e.nativeEvent.layout.height - HEIGHT_DEFAULT});
    } else {
      this.setState({setHeight: 0});
    }
  };

  onGoBack = () => {
    const {onFinished} = this.props;

    if (onFinished) {
      onFinished();
      return;
    }

    this.props.navigation.goBack();
    return true;
  };

  onLoad = e => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    });
    const {width} = this.state;
    this.setState({
      heightImg: width / (e.nativeEvent.width / e.nativeEvent.height),
    });
  };

  onChange = () => {
    const {
      width,
      images,
      setHeight,
    } = this.state;
    const heightNatural = width * images.height / images.width;
    const bars = (HEIGHT_HEADER - setHeight - heightNatural)/HEIGHT_HEADER;
    if(bars > 0.15) {
      this.setState(prev => {
        const scale = prev.display === 'fit' ? 'full' : 'fit';
        setDisplayOriginalImg(scale);
        return {display: scale};
      });
    }
  };

  onChangeImg = () => {
    const {Language} = configuration;
    const {images, info} = this.state;
    const dayOfWeek = this.getDate();
    const data = Language === 'vi' ? dataVi : dataEn;
    const imgNumber =
      Images.length - 1 === Images.indexOf(images)
        ? 0
        : Images.indexOf(images) + 1;
    const maximNumber =
      data.length - 1 === data.indexOf(info) ? 0 : data.indexOf(info) + 1;
    setDateOfWelcome({
      date: dayOfWeek,
      image: imgNumber,
      maxim: maximNumber,
    });
    this.setState({
      images: Images[imgNumber],
      info: data[maximNumber],
    });
  };

  getTextByLevel = () => {
    const {intl} = this.props;
    const {formatMessage} = intl;
    return formatMessage(messageWarning.lableF);
  };

  render() {
    const {
      width,
      isVisible,
      images,
      info,
      setHeight,
      heightImg,
      display,
      textF,
    } = this.state;
    const {intl} = this.props;
    const {formatMessage} = intl;
    const {Language} = configuration;
    const dow = Language === 'vi' ? dayVi : dayEn;
    const dayOfWeek = dow[moment().weekday()];
    const heightNatural = width * images.height / images.width;
    const bars = (HEIGHT_HEADER - setHeight - heightNatural)/HEIGHT_HEADER;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ImageBackgroundBase
          uri={Images[0].uri}
          style={{
            width: width,
            height: HEIGHT_HEADER - setHeight,
            position: 'absolute',
            top: 0,
          }}
        />
        <View style={{zIndex: 200}}>
          <ImageBackgroundBase
            uri={images.uri}
            style={{
              width: width,
              height: HEIGHT_HEADER - setHeight,
              position: 'absolute',
              top: 0,
            }}
          />
          <TouchableOpacity activeOpacity={1} onPress={this.onChange}>
            {display === 'fit' && bars > 0.15 ? (
              <Header
                styleImg={{
                  width: width,
                  height: HEIGHT_HEADER - setHeight,
                  zIndex: 100,
                }}
                uri={images.uri}
                onLoad={this.onLoad}
              />
            ) : (
              <HeaderFull
                styleImg={{
                  width: width,
                  height: HEIGHT_HEADER - setHeight,
                  zIndex: 100,
                  backgroundColor: 'rgba(0,0,0,0.34)',
                }}
                uri={images.uri}
                onLoad={this.onLoad}
              />
            )}
            <LightText
                style={[
                  styles.titleImg,
                  {
                    bottom:
                        display === 'fit' ? (HEIGHT_HEADER - setHeight - heightImg) / 2 + 12 : 12,
                  },
                ]}>
              {Language === 'vi' ? images.address : images.addressEn}
            </LightText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnQRCode} onPress={this.onSelect}>
            <FastImage
              style={{
                width: HEIGHT_IMG,
                height: HEIGHT_IMG,
              }}
              source={require('./styles/images/qrcode.png')}
            />
            <ModalBase
              isVisibleModal={isVisible}
              title={formatMessage(message.alert)}
              description={formatMessage(message.contentAlert)}>
              <View style={styles.modalFooter}>
                <ButtonConfirm
                  text={formatMessage(message.closeAlert)}
                  onPress={this.onClose}
                />
              </View>
            </ModalBase>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.maxim}
          activeOpacity={1}
          onPress={this.onChangeImg}
          disabled={!dev}
        >
          <Text style={styles.title} onLayout={this.onLayout}>
            {info.content}
          </Text>
          <Text style={styles.note}>{info.user}</Text>
        </TouchableOpacity>
        <View style={styles.body}>
          <View style={styles.announce}>
            <View style={styles.calendar}>
              <Text style={styles.titleCalendar}>
                {Language === 'vi'
                    ? `${dayOfWeek} - ${this.getDate()}`
                    : `${dayOfWeek}, ${this.getDate()}`}
              </Text>
              <Text style={styles.titleLunar}>{this.getLunar()}</Text>
              <ButtonIconText
                  text={formatMessage(message.perpetualCalendar)}
                  onPress={this.onSelect}
                  styleText={styles.textInvite}
              />
            </View>
            <View>
              <Text style={styles.titleAlert}>{textF}</Text>
            </View>
          </View>
          <View style={styles.closeButtonContainer}>
            <ButtonText
              onPress={this.onGoBack}
              text={formatMessage(message.close)}
              styleBtn={styles.closeButton}
              styleText={{fontSize: fontSize.fontSize16, color: '#015cd0'}}
            />
          </View>
        </View>
      </View>
    );
  }
}

WelcomeScreen.propTypes = {
  intl: intlShape.isRequired,
};

WelcomeScreen.contextTypes = {
  language: PropTypes.string,
};

export default injectIntl(WelcomeScreen);
