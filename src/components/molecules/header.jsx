import PropTypes from 'prop-types';
import React from 'react';

import Logo from '../atoms/logo.jsx';
import Navigation from '../atoms/navigation.jsx';
import ThemeSwitcher from '../atoms/theme-switcher.jsx';

const Header = ({isFullscreen}) => (
	<header>
		<Logo isFullscreen={isFullscreen}/>
		<Navigation isFullscreen={isFullscreen}/>
		<ThemeSwitcher isFullscreen={isFullscreen}/>
	</header>
);

Header.propTypes = {
	isFullscreen: PropTypes.bool,
};

export default Header;
