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

// Components
import AnimateNumber from './AnimateNumber';
import {MediumText} from '../../../base/components/Text';
import Text from '../Text';

// Styles
import style from '../../../main/components/HomeScreen/styles/index.css';

class InviteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.setRoundNumber = this.setRoundNumber.bind(this);
  }

  setRoundNumber(number) {
    const {language} = this.context;
    let round, text;
    if (number > 100000 && number < 1000000) {
      round = 1000;
      text = language === 'vi' ? 'N+' : 'K+';
    } else if (number > 1000000 && number < 1000000000) {
      round = 1000000;
      text = language === 'vi' ? 'Tr+' : 'M+';
    } else if (number > 1000000000) {
      round = 1000000000;
      text = language === 'vi' ? 'T+' : 'B+';
    } else {
      round = 1;
      text = '';
    }
    return {
      round: round,
      text: text,
    };
  }

  render() {
    const {amount} = this.props;
    const newAmount = parseInt(amount, 10);
    const count = this.setRoundNumber(amount);
    return (
      <Text style={style.textBlueNumber}>
        <AnimateNumber
          value={newAmount}
          countBy={Math.floor(newAmount / 40)}
          // timing="easeOut"
          formatter={val => {
            return parseFloat(val / count.round).toFixed();
          }}
        />
        <MediumText style={style.textSmallBlueNumber}> {count.text}</MediumText>
      </Text>
    );
  }
}

InviteScreen.contextTypes = {
  language: PropTypes.string,
};

export default InviteScreen;
