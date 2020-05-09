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

import {StyleSheet} from 'react-native';
import {biggested} from '../../../../utils/fontSize';
import {heightPercentageToDP} from '../../../../utils/dimension';

const SCANNING_HEIGHT = heightPercentageToDP((124 / 720) * 100);
const SCANNING_STRONG_HEIGHT = heightPercentageToDP((100 / 720) * 100);

const styles = StyleSheet.create({
    infoBluezone: {
        backgroundColor: '#E5EEF9',
        width: SCANNING_HEIGHT,
        height: SCANNING_HEIGHT,
        borderRadius: SCANNING_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBluezone1: {
        width: SCANNING_STRONG_HEIGHT,
        height: SCANNING_STRONG_HEIGHT,
        borderRadius: SCANNING_STRONG_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoItemValue: {
        fontSize: biggested,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default styles;
