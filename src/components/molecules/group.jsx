import PropTypes from 'prop-types';
import React, {useState} from 'react';

import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ListDataNode} from '../../types/proptypes.js';
import {userPrefersDark} from '../../utils/theming.js';
import List from './list.jsx';
import Header from './header.jsx';

function Group({edges: data, path, plural}) {
	const [isDark, setIsDark] = useState(() => {
		// During SSR, we don't have access to localStorage, so use system preference
		if (globalThis.window === undefined) {
			return userPrefersDark;
		}

		// On client, read from localStorage to match what the inline script set
		try {
			const stored = localStorage.getItem('userPrefersDark');
			if (stored !== null) {
				return JSON.parse(stored);
			}
		} catch {
			// Fallback to system preference if localStorage fails
		}

		return userPrefersDark;
	});

	const switchTheme = () => {
		const flipPreference = !isDark;
		setIsDark(flipPreference);
		try {
			localStorage.setItem('userPrefersDark', JSON.stringify(flipPreference));
		} catch {
			// Silently fail if localStorage is not available
		}
	};

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
