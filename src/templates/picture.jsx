import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {css} from '@emotion/react';
import {graphql} from 'gatsby';

import Fullscreen from '../components/atoms/fullscreen.jsx';
import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Map from '../components/molecules/map.jsx';
import PictureComponent from '../components/molecules/picture.jsx';
import Query from '../types/proptypes.js';
import TagLinks from '../components/atoms/tag-links.jsx';

const details = css`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	margin: 20px 0;

	> div {
		padding: 10px;

		&:not(:first-of-type) {
			border-left: 1px solid var(--foreground);
		}
	}
`;

const Picture = ({data: {prismicPicture}}) => {
	const [fullScreen, setFullScreen] = useState(false);

	const fullscreenCallback = isFullscreen => {
		setFullScreen(isFullscreen);
	};

	const {data} = prismicPicture;
	const {category, coordinates, datetime, series, title, tags} = data;
	const categoryTitle = category?.document?.data?.title;
	const categoryUID = category?.document?.uid;
	const seriesTitle = series?.document?.data?.title;
	const seriesUID = series?.document?.uid;
	const shortenedCoords = Object.keys(coordinates).map(key => coordinates[key].toFixed(5));

	return (
		<>
			<Header isFullscreen={fullScreen}/>
			<Fullscreen callback={fullscreenCallback} selector="img"/>
			{Boolean(title) && <Helmet><title>{title} | EYESBOUND</title></Helmet>}
			<MainWrapper>
				{Boolean(title) && <h1>{title}</h1>}
				<section>
					{Boolean(categoryTitle) && <h3>Category: <a href={`/category/${categoryUID}`}>{categoryTitle}</a></h3>}
					{Boolean(seriesTitle) && <h3>Series: <a href={`/series/${seriesUID}`}>{seriesTitle}</a></h3>}
					<figure>
						<PictureComponent data={data}/>
					</figure>
					<div css={details}>
						{tags?.length > 0 && <div>Tags: <TagLinks tags={tags}/></div>}
						{datetime?.length > 0 && <div>Captured: {new Date(datetime).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: '2-digit'})}</div>}
						{shortenedCoords?.length > 0 && <div>Location: {shortenedCoords.join(' | ')}</div>}
					</div>
					{shortenedCoords.length > 0 && <Map center={coordinates} data={[{node: prismicPicture}]} height="500px" zoom={11}/>}
				</section>
			</MainWrapper>
		</>
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
`;
