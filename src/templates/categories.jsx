import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import List from '../components/molecules/list.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';

const {CATEGORY: {path, plural}} = AssetTypes;

const Category = ({data: {allPrismicCategory: {edges}}}) => (
	<>
		<HelmetMetaTags title={plural} path={path}/>
		<Header/>
		<MainWrapper>
			<List title={plural} data={edges} path={path}/>
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
