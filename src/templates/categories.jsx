import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import List from '../components/molecules/list.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';

const Category = ({data: {allPrismicCategory: {edges}}}) => (
	<>
		<Helmet><title>Categories | EYESBOUND</title></Helmet>
		<Header/>
		<MainWrapper>
			<List title="Categories" data={edges} path="category"/>
		</MainWrapper>
	</>
);

Category.propTypes = {
	data: PropTypes.shape(Query)
};

export default Category;

export const pageQuery = graphql`
	query AllCategories {
		allPrismicCategory(sort: {order: ASC, fields: data___title}) {
			edges {
				node {
					uid
					data {
						title
					}
				}
			}
		}
	}
`;
