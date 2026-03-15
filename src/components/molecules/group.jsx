import PropTypes from 'prop-types';
import React from 'react';

import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ListDataNode} from '../../types/proptypes.js';
import useThemePreference from '../../hooks/use-theme-preference.js';
import List from './list.jsx';
import Header from './header.jsx';

function Group({edges: data, path, plural}) {
	const {isDark, switchTheme} = useThemePreference();

	return (
		<>
			<HelmetMetaTags title={plural} path={path}/>
			<Header isDark={isDark} switchTheme={switchTheme}/>
			<MainWrapper>
				<List title={plural} data={data} path={path}/>
			</MainWrapper>
		</>
	);
}

Group.propTypes = {
	edges: PropTypes.arrayOf(PropTypes.exact(ListDataNode)).isRequired,
	path: PropTypes.string.isRequired,
	plural: PropTypes.string.isRequired,
};

export default Group;
