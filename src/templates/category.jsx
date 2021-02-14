import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Picture from '../components/molecules/picture.jsx';
import Query from '../types/proptypes.js';

const Category = ({data: {prismicCategory, allPrismicPicture}}) => {
	const {data: categoryData} = prismicCategory;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<>
			<Helmet><title>{categoryData.title} | EYESBOUND</title></Helmet>
			<Header/>
			<MainWrapper>
				<h1>
					Category: {categoryData.title} ({pictureData.length})
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
