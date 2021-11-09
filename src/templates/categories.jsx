import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Group from '../components/molecules/group.jsx';
import Query from '../types/proptypes.js';

const {CATEGORY: {path, plural}} = AssetTypes;

const Category = ({data: {allPrismicCategory: {edges}}}) => <Group edges={edges} path={path} plural={plural}/>;

Category.propTypes = {
	data: PropTypes.shape(Query),
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
