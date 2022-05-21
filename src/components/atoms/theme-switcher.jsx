import PropTypes from 'prop-types';
import React, {useState} from 'react';
import classnames from 'classnames';
import {Global, css} from '@emotion/react';
import {Helmet} from 'react-helmet';

import buttonCSS from '../../styles/button.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {userPrefersDark} from '../../utils/theming.js';
import BulbOn from './icons/bulb-on.jsx';
import BulbOff from './icons/bulb-off.jsx';

const ThemeSwitcher = ({isFullscreen: fullScreen}) => {
	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const [prefersDark, setPrefersDark] = useState(storagePrefersDark ?? userPrefersDark);

	const switchTheme = () => {
		const flipPreference = !prefersDark;
		setPrefersDark(flipPreference);
		fromLocalStorage.setItem('userPrefersDark', flipPreference);
	};

	const darkStyles = css`
		:root {
			--background: #000 !important;
			--foreground: #fff !important;
			color-scheme: dark !important;
		}
	`;

	const lightStyles = css`
		:root {
			--background: #fff !important;
			--foreground: #000 !important;
			color-scheme: light !important;
		}
	`;

	return (
		<button aria-label='Switch theme' css={buttonCSS} className={classnames({fullScreen})} type='button' onClick={switchTheme}>
			{prefersDark && (
				<>
					<BulbOff/>
					<Global styles={darkStyles}/>
					<Helmet><meta name='theme-color' content='#000000'/></Helmet>
				</>
			)}
			{!prefersDark && (
				<>
					<BulbOn/>
					<Global styles={lightStyles}/>
					<Helmet><meta name='theme-color' content='#ffffff'/></Helmet>
				</>
			)}
		</button>
	);
};

ThemeSwitcher.propTypes = {
	isFullscreen: PropTypes.bool,
};

ThemeSwitcher.defaultProps = {
	isFullscreen: false,
};

export default ThemeSwitcher;
