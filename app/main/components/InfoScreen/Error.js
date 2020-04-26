import * as React from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity} from 'react-native';

import Text from '../../../base/components/Text';
import styles from './styles/index.css';

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = () => {
    const {onPress} = this.props;
    onPress();
  };

  render() {
    return (
      <View style={styles.error}>
        <Text style={styles.textTitle}>
          Hiện không truy cập được. Vui lòng xem lại kết nối mạng và tải lại.
        </Text>
        <TouchableOpacity style={styles.btnError} onPress={this.onPress}>
          <Text style={styles.textBtnReload}>Tải lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Error.propTypes = {
  onPress: PropTypes.func,
};

export default Error;
