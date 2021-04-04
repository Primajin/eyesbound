import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import List from '../components/molecules/list.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';

const {SERIES: {path, plural}} = AssetTypes;

const Series = ({data: {allPrismicSeries: {edges}}}) => (
	<>
		<HelmetMetaTags title={plural} path={path}/>
		<Header/>
		<MainWrapper>
			<List title={plural} data={edges} path={path}/>
		</MainWrapper>
	</>
);

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
