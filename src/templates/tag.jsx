import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Picture from '../components/molecules/picture.jsx';
import Query from '../types/proptypes.js';

const Tag = ({data: {prismicTags, allPrismicPicture}}) => {
	const {data: tagData} = prismicTags;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<Helmet><title>{tagData.title} | EYESBOUND</title></Helmet>
			<Header/>
			<MainWrapper>
				<h1>
					Tag: {tagData.title} ({pictureData.length})
				</h1>
				{pictureData.map(({node: {data, id, uid}}) => (
					<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
						<Picture data={data}/>
					</a>
				))}
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
