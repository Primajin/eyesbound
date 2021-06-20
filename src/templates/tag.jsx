import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Member from '../components/molecules/member.jsx';
import Query from '../types/proptypes.js';

const {TAG: {name, path}} = AssetTypes;

const Tag = ({data: {prismicTags, allPrismicPicture}}) => {
	const {data: tagData} = prismicTags;
	const {edges} = allPrismicPicture;
	return <Member edges={edges} name={name} path={path} uid={prismicTags.uid} title={tagData.title}/>;
};

Tag.propTypes = {
	data: PropTypes.shape(Query)
};

export default Tag;

export const pageQuery = graphql`
	query TagBySlug($uid: String!) {
		prismicTags(uid: {eq: $uid}) {
			uid
			data {
				title
			}
		}
		allPrismicPicture(
			filter: {data: {tags: {elemMatch: {tag: {uid: {eq: $uid}}}}}}
			sort: {fields: data___datetime, order: DESC}
		) {
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
