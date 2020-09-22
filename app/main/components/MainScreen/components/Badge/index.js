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

import * as React from 'react';
import * as PropTypes from 'prop-types';
import {View} from 'react-native';

// Components
import Text from '../../../../../base/components/Text';

// Styles
import styles from './styles/index.css';

class Badge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {count, children} = this.props;
    return (
      <View>
        {children}
        {count !== '0' && count !== 0 && (
          <View style={styles.viewBadge}>
            <Text style={styles.textBadge}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </View>
    );
  }
}

Badge.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Badge;
