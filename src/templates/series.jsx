import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Member from '../components/molecules/member.jsx';
import Query from '../types/proptypes.js';

const {SERIES: {name, path}} = AssetTypes;

const Series = ({data: {prismicSeries, allPrismicPicture}}) => {
	const {data: seriesData} = prismicSeries;
	const {edges} = allPrismicPicture;
	return <Member edges={edges} name={name} path={path} uid={prismicSeries.uid} title={seriesData.title}/>;
};

Series.propTypes = {
	data: PropTypes.shape(Query).isRequired,
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
									gatsbyImageData(width: 261)
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
