import PropTypes from 'prop-types';
import React from 'react';

import LanguageSwitcher from '../atoms/language-switcher.jsx';
import Logo from '../atoms/logo.jsx';
import Navigation from '../atoms/navigation.jsx';
import ThemeSwitcher from '../atoms/theme-switcher.jsx';

function Header({isFullscreen = false, isDark = true, switchTheme = null}) {
	return (
		<header>
			<Logo isFullscreen={isFullscreen}/>
			<Navigation isFullscreen={isFullscreen}/>
			<LanguageSwitcher isFullscreen={isFullscreen}/>
			{Boolean(switchTheme) && <ThemeSwitcher isFullscreen={isFullscreen} isDark={isDark} switchTheme={switchTheme}/>}
		</header>
	);
}

Header.propTypes = {
	isDark: PropTypes.bool,
	isFullscreen: PropTypes.bool,
	switchTheme: PropTypes.func,
};

export default Header;
