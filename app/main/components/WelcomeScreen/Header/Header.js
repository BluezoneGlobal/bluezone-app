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
import FastImage from 'react-native-fast-image';

// Styles
import {injectIntl, intlShape} from 'react-intl';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {styleImg, uri, onLoad} = this.props;
        return (
            <FastImage
                style={styleImg}
                source={uri}
                cacheControl={FastImage.cacheControl.immutable}
                onLoad={onLoad}
                resizeMode={FastImage.resizeMode.contain}
            />
        );
    }
}

Header.propTypes = {
    intl: intlShape.isRequired,
};

Header.contextTypes = {
    language: PropTypes.string,
};

export default injectIntl(Header);
