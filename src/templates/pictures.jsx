import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';
import Thumbnails from '../components/molecules/thumbnails.jsx';

const Pictures = ({data: {allPrismicPicture: {edges}}}) => (
	<>
		<Helmet><title>Pictures | EYESBOUND</title></Helmet>
		<Header/>
		<MainWrapper>
			<Thumbnails data={edges} title="" type="Pictures"/>
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
