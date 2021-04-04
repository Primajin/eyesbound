import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const {TAG: {name, path}} = AssetTypes;

const Tag = ({data: {prismicTags, allPrismicPicture}}) => {
	const {data: tagData} = prismicTags;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<HelmetMetaTags title={tagData.title} path={path} uid={prismicTags.uid}/>
			<Header/>
			<MainWrapper>
				<Thumbnails data={pictureData} title={tagData.title} type={name}/>
			</MainWrapper>
		</>
	);
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
