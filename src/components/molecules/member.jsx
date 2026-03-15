import PropTypes from 'prop-types';
import React from 'react';

import AssetTypes from '../../constants/asset-types.js';
import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ThumbnailDataNode} from '../../types/proptypes.js';
import useThemePreference from '../../hooks/use-theme-preference.js';
import Thumbnails from './thumbnails.jsx';
import Header from './header.jsx';

const {PICTURE: {plural}} = AssetTypes;

function Member({edges, name, path = '', title, uid = ''}) {
	const {isDark, switchTheme} = useThemePreference();

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
