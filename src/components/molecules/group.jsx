import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ListDataNode} from '../../types/proptypes.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {userPrefersDark} from '../../utils/theming.js';
import List from './list.jsx';
import Header from './header.jsx';

function Group({edges: data, path, plural}) {
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
