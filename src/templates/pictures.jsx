import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Picture from '../components/molecules/picture.jsx';
import Query from '../types/proptypes.js';

const Pictures = ({
	data: {
		allPrismicPicture: {edges}
	}
}) => {
	return (
		<>
			<Helmet><title>Pictures | EYESBOUND</title></Helmet>
			<Header/>
			<MainWrapper>
				<h1>Pictures ({edges.length})</h1>
				{edges.map(({node: {data, id, uid}}) => (
					<a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
						<Picture data={data}/>
					</a>
				))}
			</MainWrapper>
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
