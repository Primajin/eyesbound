import {css, Global} from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import Map from '../components/molecules/map.jsx';
import Query from '../types/proptypes.js';

const styles = css`
	body {
		overflow: hidden;
	}

	.gm-style {
		.gm-style-iw-d,
		.gm-style-iw-c {
			background: var(--background);
			color: var(--foreground);
			font-family: 'Montserrat', sans-serif;
			overflow: hidden !important;
			padding-bottom: 12px;

			> div {
				line-break: anywhere;
				padding-right: 12px;
				width: 185px;
			}
		}

		.gm-style-iw-a {
			transform: translate(-0.5px, -30px)
		}

		.gm-style-iw-t::after {
			background: var(--background);
			box-shadow: -2px 2px 2px 0 rgba(var(--backgroundRGB), 0.4);
		}

		.gm-ui-hover-effect > span {
			background-color: var(--foreground);
		}

		picture img {
			max-width: 100%;
		}
	}

	div[style*="rgb(229, 227, 223)"] {
		background: var(--background) !important;
	}

	.gm-fullscreen-control {
		width: 50px !important;
		margin: 0 !important;
		height: 50px !important;
		border-radius: 0 !important;
	}
`;

const Worldmap = ({data: {allPrismicPicture: {edges}}}) => (
	<>
		<HelmetMetaTags title="Worldmap" path="worldmap"/>
		<Global styles={styles}/>
		<Header/>
		{edges.length > 0 && <Map data={edges}/>}
	</>
);

Worldmap.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Worldmap;

export const pageQuery = graphql`
	query Map {
		allPrismicPicture(filter: {data: {coordinates: {latitude: {ne: 0}, longitude: {ne: 0}}}}) {
			edges {
				node {
					data {
						coordinates {
							latitude
							longitude
						}
						title
						image {
							alt
							thumbnails {
								thumbnail {
									gatsbyImageData(width: 164)
								}
							}
						}
					}
					id
					uid
				}
			}
		}
	}
`;
