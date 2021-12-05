import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';

import {up} from '../../utils/theming.js';

const logo = css`
	background-color: var(--foreground);
	color: var(--background);
	font-size: 27px;
	font-weight: 700;
	height: 100px;
	left: 0;
	line-height: 100px;
	opacity: 1;
	position: fixed;
	text-align: center;
	transition: opacity .333s;
	top: 0;
	width: 250px;
	z-index: 10;

	&.isFullscreen {
		opacity: 0.65;
	}

	${up('sm')} {
		font-size: 37px;
		width: 400px;
	};
`;

const {GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

const Logo = ({isFullscreen}) => <h1 css={logo} className={classnames({isFullscreen})}><a href="/" rel="home" tabIndex="1">{GATSBY_SITE_NAME}</a></h1>;

Logo.propTypes = {
	isFullscreen: PropTypes.bool,
};

Logo.defaultProps = {
	isFullscreen: false,
};

export default Logo;
