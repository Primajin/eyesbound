import {css, Global} from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import Map from '../components/molecules/map.jsx';
import Query from '../types/proptypes.js';

const Worldmap = ({data: {allPrismicPicture: {edges}}}) => (
	<>
		<Global styles={css` body { overflow: hidden; } `}/>
		<Helmet><title>Worldmap | EYESBOUND</title></Helmet>
		<Header/>
		{edges.length > 0 && <Map data={edges}/>}
	</>
);

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
							thumbnails {
								thumbnail {
									fixed(width: 280) {
										src
										srcSet
										srcSetWebp
									}
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
