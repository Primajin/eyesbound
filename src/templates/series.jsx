import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const {SERIES: {name, path}} = AssetTypes;

const Series = ({data: {prismicSeries, allPrismicPicture}}) => {
	const {data: seriesData} = prismicSeries;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<HelmetMetaTags title={seriesData.title} path={path} uid={prismicSeries.uid}/>
			<Header/>
			<MainWrapper>
				<Thumbnails data={pictureData} title={seriesData.title} type={name}/>
			</MainWrapper>
		</>
	);
};

Series.propTypes = {
	data: PropTypes.shape(Query)
};

export default Series;

export const pageQuery = graphql`
	query SeriesBySlug($uid: String!) {
		prismicSeries(uid: {eq: $uid}) {
			uid
			data {
				title
			}
		}
		allPrismicPicture(filter: {data: {series: {uid: {eq: $uid}}}}, sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
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
					uid
					id
				}
			}
		}
	}
`;
