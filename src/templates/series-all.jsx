import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Group from '../components/molecules/group.jsx';
import Query from '../types/proptypes.js';

const {SERIES: {path, plural}} = AssetTypes;

function Series({data: {allPrismicSeries: {edges}}}) {
	return <Group edges={edges} path={path} plural={plural}/>;
}

Series.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Series;

export const pageQuery = graphql`query AllSeries {
  allPrismicSeries(sort: {data: {title: ASC}}) {
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
