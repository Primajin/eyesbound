import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';

import IconFullscreen from './icons/fullscreen.jsx';
import IconFullscreenExit from './icons/fullscreen-exit.jsx';

import {fullscreenElement, toggleFullscreen} from '../../utils/fullscreen.js';

const button = css`
	align-items: center;
	background-color: var(--foreground);
	color: var(--background);
	cursor: pointer;
	display: flex;
	height: 50px;
	justify-content: center;
	padding: 0;
	position: fixed;
	right: 0;
	top: 0;
	transition: background-color .333s, color .333s;
	width: 50px;
	z-index: 10;

	&:hover,
	&:focus {
		background: var(--background);
		color: var(--foreground);
	}

	svg {
		fill: currentColor;
		height: 50px;
		width: 50px;
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

	return <button type="button" css={button} tabIndex="5" onClick={() => toggleFullscreen(selector)}>{fullScreen ? <IconFullscreenExit/> : <IconFullscreen/>}</button>;
};

Fullscreen.propTypes = {
	selector: PropTypes.string
};

export default Fullscreen;

