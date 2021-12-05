/* global document */
// document may be used inside useEffects - they only run in a browser
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';

import buttonCSS from '../../styles/button.js';
import {fullscreenElement, toggleFullscreen} from '../../utils/fullscreen.js';
import IconFullscreen from './icons/fullscreen.jsx';
import IconFullscreenExit from './icons/fullscreen-exit.jsx';

const buttonClass = css`
	${buttonCSS};
	right: 0;

	svg {
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
			callback(isFullScreen);
			setFullScreen(isFullScreen);
		};

		// Register eventListener once
		document.addEventListener('fullscreenchange', setFullScreenState);

		return () => {
			// Unregister eventListener once
			document.removeEventListener('fullscreenchange', setFullScreenState);
		};
	}, [callback]);

	return <button aria-label="Toggle fullscreen" type="button" css={buttonClass} className={classnames({fullScreen})} tabIndex="12" onClick={() => toggleFullscreen(selector)}>{fullScreen ? <IconFullscreenExit/> : <IconFullscreen/>}</button>;
};

Fullscreen.propTypes = {
	callback: PropTypes.func,
	selector: PropTypes.string,
};

Fullscreen.defaultProps = {
	callback: () => {},
	selector: '',
};

export default Fullscreen;

