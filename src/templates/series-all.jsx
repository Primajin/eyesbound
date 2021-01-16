import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import List from '../components/list.jsx';
import NotFoundLink from '../components/404-link.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';

const Series = ({data: {allPrismicSeries}}) => {
	const {edges} = allPrismicSeries;
	return (
		<RootComponent>
			<Helmet><title>Series | EYESBOUND</title></Helmet>
			<NotFoundLink/>
			<List title="Series" data={edges} path="series"/>
			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(edges, null, 2)}</pre>
		</RootComponent>
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
