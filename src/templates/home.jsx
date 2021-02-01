import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Header from '../components/header.jsx';
import Fullscreen from '../components/fullscreen.jsx';
import Query from '../types/proptypes.js';
import Slideshow from '../components/slideshow.jsx';

const Home = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<>
			<Header/>
			<Fullscreen/>
			<Slideshow images={edges}/>
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
