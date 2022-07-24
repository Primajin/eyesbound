import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {css, Global} from '@emotion/react';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import Map from '../components/molecules/map.jsx';
import Query from '../types/proptypes.js';
import {fromLocalStorage} from '../utils/local-storage.js';
import {userPrefersDark} from '../utils/theming.js';

const Worldmap = ({data: {allPrismicPicture: {edges}}}) => {
	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const [isDark, setIsDark] = useState(storagePrefersDark ?? userPrefersDark);

	const switchTheme = () => {
		const flipPreference = !isDark;
		setIsDark(flipPreference);
		fromLocalStorage.setItem('userPrefersDark', flipPreference);
	};

	return (
		<>
			<HelmetMetaTags title='Worldmap' path='worldmap'/>
			<Global styles={css` body { overflow: hidden; } `}/>
			<Header isDark={isDark} switchTheme={switchTheme}/>
			{edges.length > 0 && <Map data={edges} isDark={isDark}/>}
		</>
	);
};

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
