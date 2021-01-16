import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import {Helmet} from 'react-helmet';

import PictureComponent from '../components/picture.jsx';
import Query from '../types/proptypes.js';
import RootComponent from './root.jsx';

const Picture = ({data: {prismicPicture}}) => {
	const {data} = prismicPicture;
	return (
		<RootComponent>
			<Helmet><title>{data && data.title} | EYESBOUND</title></Helmet>
			<PictureComponent data={data}/>
		</RootComponent>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(Query)
};

export default Picture;

export const pageQuery = graphql`
	query PictureBySlug($uid: String!) {
		prismicPicture(uid: {eq: $uid}) {
			uid
			data {
				category {
					document {
						... on PrismicCategory {
							data {
								title
							}
						}
					}
				}
				coordinates {
					latitude
					longitude
				}
				datetime
				homepage
				image {
					alt
					dimensions {
						height
						width
					}
					thumbnails
					url
				}
				series {
					document {
						... on PrismicSeries {
							data {
								title
							}
						}
					}
				}
				title
				tags {
					tag {
						document {
							... on PrismicTags {
								data {
									title
								}
							}
						}
					}
				}
			}
		}
	}
`;
