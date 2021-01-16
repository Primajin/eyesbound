import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import NotFoundLink from '../components/404-link.jsx';
import Picture from '../components/picture.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';

const Pictures = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<RootComponent>
			<Helmet><title>Pictures | EYESBOUND</title></Helmet>
			<NotFoundLink/>
			<h1>Pictures ({edges.length})</h1>
			{edges.map(({node: {data, id, uid}}) => (
				<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
					<Picture data={data}/>
				</a>
			))}
		</RootComponent>
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
