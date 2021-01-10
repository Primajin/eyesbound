import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import List from '../components/list.jsx';
import NotFoundLink from '../components/404-link.jsx';
import Query from '../types/proptypes.js';

const Series = ({data: {allPrismicSeries}}) => {
	const {edges} = allPrismicSeries;
	return (
		<>
			<NotFoundLink/>
			<List title="Series" data={edges} path="series"/>
			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(edges, null, 2)}</pre>
		</>
	);
};

Series.propTypes = {
	data: PropTypes.shape(Query)
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
