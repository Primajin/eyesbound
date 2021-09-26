import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {css} from '@emotion/react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Fullscreen from '../components/atoms/fullscreen.jsx';
import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import Map from '../components/molecules/map.jsx';
import PictureComponent from '../components/molecules/picture.jsx';
import Query from '../types/proptypes.js';
import TagLinks from '../components/atoms/tag-links.jsx';
import {up} from '../utils/theming.js';

const details = css`
	margin: 20px 0;

	> div {
		padding: 10px;
	}

	${up('md')} {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		> div:not(:first-of-type) {
			border-left: 1px solid var(--foreground);
		}
	};

	& ~ div {
		content-visibility: auto;
	}
`;

const Picture = ({data: {prismicPicture = {}}}) => {
	const [fullScreen, setFullScreen] = useState(false);

	const fullscreenCallback = isFullscreen => {
		setFullScreen(isFullscreen);
	};

	const {data = {}} = prismicPicture;
	const {category, coordinates, datetime, image, series, title, tags} = data;

	const categoryTitle = category?.document?.data?.title;
	const categoryUID = category?.document?.uid;
	const imageSource = image?.gatsbyImageData?.images.fallback.src ?? image?.thumbnails?.thumbnail.gatsbyImageData?.images.fallback.src;
	const seriesTitle = series?.document?.data?.title;
	const seriesUID = series?.document?.uid;
	const shortenedCoords = coordinates && Object.keys(coordinates).map(key => coordinates[key].toFixed(5));

	const hasCoords = shortenedCoords?.length > 0;
	const hasDateTime = datetime?.length > 0;
	const hasTags = tags?.length > 0;
	const hasTitle = Boolean(title);

	const {CATEGORY: {path: categoryPath}, PICTURE: {path: picturePath}, SERIES: {path: seriesPath}} = AssetTypes;

	return (
		<>
			<HelmetMetaTags coordinates={shortenedCoords} dateTime={datetime} imageSource={imageSource} path={picturePath} tags={tags} title={title} uid={prismicPicture.uid}/>
			<Header isFullscreen={fullScreen}/>
			<Fullscreen callback={fullscreenCallback} selector="img"/>
			<MainWrapper>
				{hasTitle && <h1>{title}</h1>}
				<section>
					{Boolean(categoryTitle) && <h3>Category: <a href={`/${categoryPath}/${categoryUID}`}>{categoryTitle}</a></h3>}
					{Boolean(seriesTitle) && <h3>Series: <a href={`/${seriesPath}/${seriesUID}`}>{seriesTitle}</a></h3>}
					<figure>
						<PictureComponent data={data} size={{height: 715, width: 1072}}/>
					</figure>
					<div css={details}>
						{hasTags && <div>Tags: <TagLinks tags={tags}/></div>}
						{hasDateTime && <div>Captured: <time dateTime={datetime}>{new Date(datetime).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: '2-digit'})}</time></div>}
						{hasCoords && <div>Location: {shortenedCoords.join(' | ')}</div>}
					</div>
					{shortenedCoords.length > 0 && <Map center={coordinates} data={[{node: prismicPicture}]} height="500px" zoom={11}/>}
				</section>
			</MainWrapper>
		</>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(Query),
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
					gatsbyImageData(imgixParams: {q: 100}, width: 1072)
					thumbnails {
						thumbnail {
							gatsbyImageData(width: 164)
						}
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
