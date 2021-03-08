import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import List from '../components/molecules/list.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';

const Tags = ({data: {allPrismicTags: {edges}}}) => (
	<>
		<HelmetMetaTags title="Tags" path="tag"/>
		<Header/>
		<MainWrapper>
			<List title="Tags" data={edges} path="tag"/>
		</MainWrapper>
	</>
);

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
