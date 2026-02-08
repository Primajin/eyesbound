import PropTypes from 'prop-types';
import React, {useState} from 'react';

import AssetTypes from '../../constants/asset-types.js';
import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ThumbnailDataNode} from '../../types/proptypes.js';
import {userPrefersDark} from '../../utils/theming.js';
import Thumbnails from './thumbnails.jsx';
import Header from './header.jsx';

const {PICTURE: {plural}} = AssetTypes;

function Member({edges, name, path = '', title, uid = ''}) {
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
			<HelmetMetaTags title={title} path={path} uid={uid}/>
			<Header isDark={isDark} switchTheme={switchTheme}/>
			<MainWrapper>
				<Thumbnails edges={edges} title={title === plural ? '' : title} type={name}/>
			</MainWrapper>
		</>
	);
}

Member.propTypes = {
	edges: PropTypes.arrayOf(PropTypes.exact(ThumbnailDataNode)).isRequired,
	name: PropTypes.string.isRequired,
	path: PropTypes.string,
	title: PropTypes.string.isRequired,
	uid: PropTypes.string,
};

export default Member;
