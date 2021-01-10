import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import NotFoundLink from '../components/404-link.jsx';
import Picture from '../components/picture.jsx';
import Query from '../types/proptypes.js';

const Pictures = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<>
			<NotFoundLink/>
			<h1>Pictures ({edges.length})</h1>
			{edges.map(({node: {data, id, uid}}) => (
				<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
					<Picture data={data}/>
				</a>
			))}
		</>
	);
};

Pictures.propTypes = {
	data: PropTypes.shape(Query)
};

export default Pictures;

export const pageQuery = graphql`
	query AllPictures {
		allPrismicPicture(sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					id
					uid
					data {
						title
						image {
							alt
							url
						}
					}
				}
			}
		}
	}
`;
