import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Group from '../components/molecules/group.jsx';
import Query from '../types/proptypes.js';

const {TAG: {path, plural}} = AssetTypes;

const Tags = ({data: {allPrismicTags: {edges}}}) => <Group edges={edges} path={path} plural={plural}/>;

Tags.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Tags;

export const pageQuery = graphql`
	query AllTags {
		allPrismicTags(sort: {order: ASC, fields: data___title}) {
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
