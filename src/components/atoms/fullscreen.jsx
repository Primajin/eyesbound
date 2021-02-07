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
	line-height: 50px;
	position: fixed;
	right: 0;
	text-align: center;
	top: 0;
	transition: background-color .333s, color .333s;
	width: 50px;
	z-index: 10;

	&:hover,
	&:focus {
		background: var(--background);
		color: var(--foreground);
	}
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

	return <a css={button} tabIndex="5" onClick={() => toggleFullscreen(selector)}>{fullScreen ? 'on' : 'off'}</a>;
};

Fullscreen.propTypes = {
	selector: PropTypes.string
};

export default Fullscreen;

