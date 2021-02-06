/* global document */
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';

import {fullscreenElement, toggleFullscreen} from '../../utils/fullscreen.js';

const button = css`
	background-color: var(--foreground);
	color: var(--background);
	cursor: pointer;
	font-size: 25px;
	font-weight: 700;
	height: 50px;
	right: 0;
	line-height: 50px;
	position: fixed;
	text-align: center;
	top: 0;
	width: 50px;
	z-index: 10;
`;

const Fullscreen = ({selector}) => {
	const [fullScreen, setFullScreen] = useState(false);

	useEffect(() => {
		// Register eventListener once
		document.addEventListener('fullscreenchange', () => {
			document.fullscreenElement = fullscreenElement;
			const isFullScreen = document.fullscreenElement !== null;
			setFullScreen(isFullScreen);
		});

		return () => {
			// Unregister eventListener once
			document.removeEventListener('fullscreenchange');
		};
	}, []);

	return <a css={button} onClick={() => toggleFullscreen(selector)}>{fullScreen ? 'on' : 'off'}</a>;
};

Fullscreen.propTypes = {
	selector: PropTypes.string
};

export default Fullscreen;

