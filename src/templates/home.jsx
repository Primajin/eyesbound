import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Picture from '../components/picture.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';
import Slideshow from '../components/slideshow.jsx';

const Home = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<RootComponent>
			<h1>Home ({edges.length})</h1>
			<p>Get only top 5 homepage=true pictures:</p>
			{edges.map(({node: {data, id, uid}}) => (
				<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
					<Picture data={data}/>
				</a>
			))}
			<pre>{JSON.stringify(edges, null, 2)}</pre>
			<Slideshow images={edges}/>
		</RootComponent>
	);
};

Home.propTypes = {
	data: PropTypes.shape(Query)
};

export default Home;

export const pageQuery = graphql`
	query Homepage {
		allPrismicPicture(filter: {data: {homepage: {eq: true}}}, limit: 5, sort: {fields: data___datetime, order: DESC}) {
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
