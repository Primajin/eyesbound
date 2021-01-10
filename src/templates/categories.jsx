import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Query from '../types/proptypes.js';
import List from '../components/list.jsx';
import NotFoundLink from '../components/404-link.jsx';

const Category = ({data: {allPrismicCategory}}) => {
	const {edges} = allPrismicCategory;
	return (
		<>
			<NotFoundLink/>
			<List title="Categories" data={edges} path="category"/>
			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(edges, null, 2)}</pre>
		</>
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
