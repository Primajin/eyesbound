import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Group from '../components/molecules/group.jsx';
import Query from '../types/proptypes.js';

const {CATEGORY: {path, plural}} = AssetTypes;

function Category({data: {allPrismicCategory: {edges}}}) {
	return <Group edges={edges} path={path} plural={plural}/>;
}

Category.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Category;

export const pageQuery = graphql`query AllCategories {
  allPrismicCategory(sort: {data: {title: ASC}}) {
    edges {
      node {
        uid
        data {
          title
        }
      }
    }
  }
}`;
