import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {css, Global} from '@emotion/react';
import {graphql} from 'gatsby';

import Fullscreen from '../components/atoms/fullscreen.jsx';
import Header from '../components/molecules/header.jsx';
import Query from '../types/proptypes.js';
import Slideshow from '../components/organisms/slideshow.jsx';

const Home = ({data: {allPrismicPicture: {edges}}}) => {
	const [fullScreen, setFullScreen] = useState(false);

	const fullscreenCallback = isFullscreen => {
		setFullScreen(isFullscreen);
	};

	return (
		<>
			<Global styles={css` body { overflow: hidden; } `}/>
			<Header isFullscreen={fullScreen}/>
			<Fullscreen callback={fullscreenCallback}/>
			<Slideshow images={edges} isFullscreen={fullScreen}/>
		</>
	);
};

Home.propTypes = {
	data: PropTypes.shape(Query)
};

export default Home;

export const pageQuery = graphql`
	query Homepage {
		allPrismicPicture(filter: {data: {homepage: {eq: true}}}, limit: 5, sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					id
					uid
					data {
						title
						image {
							alt
							url
						}
					}
				}
			}
		}
	}
`;
