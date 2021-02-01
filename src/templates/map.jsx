import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Map from '../components/map.jsx';
import NotFoundLink from '../components/404-link.jsx';
import Query from '../types/proptypes.js';

const Worldmap = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<>
			<Helmet><title>Worldmap | EYESBOUND</title></Helmet>
			<NotFoundLink/>
			<h1>Map</h1>
			{edges.length > 0 && <Map data={edges}/>}
		</>
	);
};

Worldmap.propTypes = {
	data: PropTypes.shape(Query)
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
							url
						}
					}
					id
					uid
				}
			}
		}
	}
`;
