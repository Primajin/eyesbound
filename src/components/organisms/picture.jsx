import {graphql, StaticQuery} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

// TODO: WORK IN PROGRESS

const Picture = ({imgUID}) => {
	return (
		<StaticQuery
			query={graphql`
				query {
					allPrismicPicture {
						nodes {
							uid
							data {
								category {
									document {
										... on PrismicCategory {
											data {
												title
											}
											uid
										}
									}
								}
								coordinates {
									latitude
									longitude
								}
								datetime
								image {
									alt
									fixed(width: 1150, imgixParams: {q: 100}) {
										src
										srcSet
										srcSetWebp
									}
								}
								series {
									document {
										... on PrismicSeries {
											data {
												title
											}
											uid
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
												uid
											}
										}
									}
								}
							}
							id
						}
					}
				}
			`}
			render={data => {
				const image = data?.allPrismicPicture?.nodes?.find(edge => edge.uid === imgUID);
				console.log('image', image);
				return image ? <img src={image} alt=""/> : null;
			}}
		/>
	);
};

Picture.propTypes = {
	imgUID: PropTypes.string.isRequired
};

export default Picture;
