import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import List from '../components/list.jsx';
import NotFoundLink from '../components/404-link.jsx';
import Query from '../types/proptypes.js';

const Tags = ({data: {allPrismicTags}}) => {
	const {edges} = allPrismicTags;
	return (
		<>
			<Helmet><title>Tags | EYESBOUND</title></Helmet>
			<NotFoundLink/>
			<List title="Tags" data={edges} path="tag"/>
			<h2>Raw Data:</h2>
			<pre>{JSON.stringify(edges, null, 2)}</pre>
		</>
	);
};

Tags.propTypes = {
	data: PropTypes.shape(Query)
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
