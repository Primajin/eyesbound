import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const {PICTURE: {path, plural}} = AssetTypes;

const Pictures = ({data: {allPrismicPicture: {edges}}}) => (
	<>
		<HelmetMetaTags title={plural} path={path}/>
		<Header/>
		<MainWrapper>
			<Thumbnails data={edges} title="" type={plural}/>
		</MainWrapper>
	</>
);

Pictures.propTypes = {
	data: PropTypes.shape(Query)
};

export default Pictures;

export const pageQuery = graphql`
	query AllPictures {
		allPrismicPicture(sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					id
					uid
					data {
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
				}
			}
		}
	}
`;
