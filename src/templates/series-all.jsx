import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import List from '../components/molecules/list.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Query from '../types/proptypes.js';

const Series = ({data: {allPrismicSeries: {edges}}}) => (
	<>
		<Helmet><title>Series | EYESBOUND</title></Helmet>
		<Header/>
		<MainWrapper>
			<List title="Series" data={edges} path="series"/>
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
