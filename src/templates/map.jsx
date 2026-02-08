import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {css, Global} from '@emotion/react';
import {graphql} from 'gatsby';
import {useTranslation} from 'react-i18next';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import Map from '../components/molecules/map.jsx';
import Query from '../types/proptypes.js';
import {userPrefersDark} from '../utils/theming.js';

function Worldmap({data: {allPrismicPicture: {edges}}}) {
	const {t} = useTranslation();
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
			<HelmetMetaTags title={t('navigation.worldmap')} path='worldmap'/>
			<Global styles={css` body { overflow: hidden; } `}/>
			<Header isDark={isDark} switchTheme={switchTheme}/>
			{edges.length > 0 && <Map data={edges} isDark={isDark}/>}
		</>
	);
}

Worldmap.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Worldmap;

export const pageQuery = graphql`
	query Map {
		allPrismicPicture(filter: {data: {coordinates: {latitude: {ne: 0}, longitude: {ne: 0}}}}) {
			edges {
				node {
					data {
						coordinates {
							latitude
							longitude
						}
						title
						image {
							alt
							thumbnails {
								thumbnail {
									gatsbyImageData(width: 164)
								}
							}
						}
					}
					id
					uid
				}
			}
		}
	}
`;
