import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Member from '../components/molecules/member.jsx';
import Query from '../types/proptypes.js';

const {CATEGORY: {name, path}} = AssetTypes;

const Category = ({data: {prismicCategory, allPrismicPicture}}) => {
	const {data: categoryData} = prismicCategory;
	const {edges} = allPrismicPicture;
	return <Member edges={edges} name={name} path={path} uid={prismicCategory.uid} title={categoryData.title}/>;
};

Category.propTypes = {
	data: PropTypes.shape(Query)
};

export default Category;

export const pageQuery = graphql`
	query CategoryBySlug($uid: String!) {
		prismicCategory(uid: {eq: $uid}) {
			uid
			data {
				title
			}
		}
		allPrismicPicture(filter: {data: {category: {uid: {eq: $uid}}}}, sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					data {
						title
						image {
							alt
							thumbnails {
								thumbnail {
									fixed(width: 261) {
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
