import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import Picture from '../components/picture.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';

const Series = ({data: {prismicSeries, allPrismicPicture}}) => {
	const {data: seriesData} = prismicSeries;
	const {edges: pictureData} = allPrismicPicture;
	return (
		<RootComponent>
			<Helmet><title>{seriesData.title} | EYESBOUND</title></Helmet>
			<h1>
				Series: {seriesData.title} ({pictureData.length})
			</h1>
			<pre>{JSON.stringify(seriesData, null, 2)}</pre>
			{pictureData.map(({node: {data, id, uid}}) => (
				<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
					<Picture data={data}/>
				</a>
			))}
		</RootComponent>
	);
};

Series.propTypes = {
	data: PropTypes.shape(Query)
};

export default Series;

export const pageQuery = graphql`
	query SeriesBySlug($uid: String!) {
		prismicSeries(uid: {eq: $uid}) {
			uid
			data {
				title
			}
		}
		allPrismicPicture(filter: {data: {series: {uid: {eq: $uid}}}}, sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					data {
						title
						image {
							url
						}
					}
					uid
					id
				}
			}
		}
	}
`;
