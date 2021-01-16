import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import List from '../components/list.jsx';
import NotFoundLink from '../components/404-link.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';

const Category = ({data: {allPrismicCategory}}) => {
	const {edges} = allPrismicCategory;
	return (
		<RootComponent>
			<Helmet><title>Categories | EYESBOUND</title></Helmet>
			<NotFoundLink/>
			<List title="Categories" data={edges} path="category"/>
			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(edges, null, 2)}</pre>
		</RootComponent>
	);
};

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
