import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const Tag = ({data: {prismicTags, allPrismicPicture}}) => {
	const {data: tagData} = prismicTags;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<Helmet><title>{tagData.title} | EYESBOUND</title></Helmet>
			<Header/>
			<MainWrapper>
				<Thumbnails data={pictureData} title={tagData.title} type="Tag"/>
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
							url
						}
					}
					uid
					id
				}
			}
		}
	}
`;
