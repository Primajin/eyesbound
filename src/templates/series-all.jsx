import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Group from '../components/molecules/group.jsx';
import Query from '../types/proptypes.js';

const {SERIES: {path, plural}} = AssetTypes;

const Series = ({data: {allPrismicSeries: {edges}}}) => <Group edges={edges} path={path} plural={plural}/>;

Series.propTypes = {
	data: PropTypes.shape(Query),
};

export default Series;

export const pageQuery = graphql`
	query AllSeries {
		allPrismicSeries(sort: {order: ASC, fields: data___title}) {
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
