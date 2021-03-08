import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const Category = ({data: {prismicCategory, allPrismicPicture}}) => {
	const {data: categoryData} = prismicCategory;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<HelmetMetaTags title={categoryData.title} path="category" uid={prismicCategory.uid}/>
			<Header/>
			<MainWrapper>
				<Thumbnails data={pictureData} title={categoryData.title} type="Category"/>
			</MainWrapper>
		</>
	);
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
