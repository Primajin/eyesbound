import PropTypes from 'prop-types';
import React from 'react';

import Logo from '../atoms/logo.jsx';
import Navigation from '../atoms/navigation.jsx';
import ThemeSwitcher from '../atoms/theme-switcher.jsx';

const Header = ({isFullscreen, isDark, switchTheme}) => (
	<header>
		<Logo isFullscreen={isFullscreen}/>
		<Navigation isFullscreen={isFullscreen}/>
		{Boolean(switchTheme) && <ThemeSwitcher isFullscreen={isFullscreen} isDark={isDark} switchTheme={switchTheme}/>}
	</header>
);

Header.propTypes = {
	isDark: PropTypes.bool,
	isFullscreen: PropTypes.bool,
	switchTheme: PropTypes.func,
};

Header.defaultProps = {
	isFullscreen: false,
	isDark: true,
	switchTheme: null,
};

export default Header;
