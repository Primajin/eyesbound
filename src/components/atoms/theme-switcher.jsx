import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {Global, css} from '@emotion/react';
import {Helmet} from 'react-helmet';

import buttonCSS from '../../styles/button.js';
import BulbOff from './icons/bulb-off.jsx';
import BulbOn from './icons/bulb-on.jsx';

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

const ThemeSwitcher = ({isFullscreen: fullScreen, isDark, switchTheme}) => (
	<button
		aria-label='Switch theme' css={buttonCSS}
		className={classnames({fullScreen})} type='button'
		onClick={switchTheme}
	>
		{isDark && (
			<>
				<BulbOff/>
				<Global styles={darkStyles}/>
				<Helmet><meta name='theme-color' content='#000000'/></Helmet>
			</>
		)}
		{!isDark && (
			<>
				<BulbOn/>
				<Global styles={lightStyles}/>
				<Helmet><meta name='theme-color' content='#ffffff'/></Helmet>
			</>
		)}
	</button>
);

ThemeSwitcher.propTypes = {
	isDark: PropTypes.bool.isRequired,
	isFullscreen: PropTypes.bool,
	switchTheme: PropTypes.func.isRequired,
};

ThemeSwitcher.defaultProps = {
	isFullscreen: false,
};

export default ThemeSwitcher;
