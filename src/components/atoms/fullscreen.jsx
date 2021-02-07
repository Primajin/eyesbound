import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
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
	opacity: 1;
	padding: 0;
	position: fixed;
	right: 0;
	top: 0;
	transition: background-color .333s, color .333s, opacity .333s;
	width: 50px;
	z-index: 8;

	&:hover,
	&:focus {
		background: var(--background);
		color: var(--foreground);
	}

	&.fullScreen {
		opacity: 0.65;
	}

	svg {
		fill: currentColor;
		height: 50px;
		width: 50px;
	}
`;

const Fullscreen = ({callback, selector}) => {
	const [fullScreen, setFullScreen] = useState(false);

	useEffect(() => {
		const setFullScreenState = () => {
			document.fullscreenElement = fullscreenElement;
			const isFullScreen = document.fullscreenElement !== null;
			callback?.(isFullScreen);
			setFullScreen(isFullScreen);
		};

		// Register eventListener once
		document.addEventListener('fullscreenchange', setFullScreenState);

		return () => {
			// Unregister eventListener once
			document.removeEventListener('fullscreenchange', setFullScreenState);
		};
	}, [callback]);

	return <button type="button" css={button} className={classnames({fullScreen})} tabIndex="12" onClick={() => toggleFullscreen(selector)}>{fullScreen ? <IconFullscreenExit/> : <IconFullscreen/>}</button>;
};

Fullscreen.propTypes = {
	callback: PropTypes.func,
	selector: PropTypes.string
};

export default Fullscreen;

