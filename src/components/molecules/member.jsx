import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import AssetTypes from '../../constants/asset-types.js';
import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ThumbnailDataNode} from '../../types/proptypes.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {userPrefersDark} from '../../utils/theming.js';
import Thumbnails from './thumbnails.jsx';
import Header from './header.jsx';

const {PICTURE: {plural}} = AssetTypes;

function Member({edges, name, path = '', title, uid = ''}) {
	const [isDark, setIsDark] = useState(userPrefersDark);

	useEffect(() => {
		const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
		if (storagePrefersDark !== null) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsDark(storagePrefersDark);
		}
	}, []);

	const switchTheme = () => {
		const flipPreference = !isDark;
		setIsDark(flipPreference);
		fromLocalStorage.setItem('userPrefersDark', flipPreference);
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
