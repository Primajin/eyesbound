import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {css, Global} from '@emotion/react';
import {graphql} from 'gatsby';

import SocialImage from '../../static/social-image.png';
import Fullscreen from '../components/atoms/fullscreen.jsx';
import Header from '../components/molecules/header.jsx';
import Query from '../types/proptypes.js';
import Slideshow from '../components/organisms/slideshow.jsx';

const Home = ({data: {allPrismicPicture: {edges}}}) => {
	const [fullScreen, setFullScreen] = useState(false);

	const fullscreenCallback = isFullscreen => {
		setFullScreen(isFullscreen);
	};

	const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

	return (
		<>
			<Helmet>
				<title>{GATSBY_SITE_NAME}</title>
				<meta name='title' content={GATSBY_SITE_NAME}/>
				<link rel='canonical' href={GATSBY_SERVER_URL}/>
				<meta property='og:image' content={`${GATSBY_SERVER_URL}${SocialImage}`}/>
				<meta property='og:title' content={GATSBY_SITE_NAME}/>
				<meta property='og:url' content={GATSBY_SERVER_URL}/>
				<meta property='og:description' content='Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.'/>
				<meta name='twitter:image' content={`${GATSBY_SERVER_URL}${SocialImage}`}/>
				<meta name='twitter:title' content={GATSBY_SITE_NAME}/>
				<meta name='twitter:url' content={GATSBY_SERVER_URL}/>
			</Helmet>
			<Global styles={css` body { height: 100vh; overflow: hidden; width: 100vw; } `}/>
			<Header isFullscreen={fullScreen}/>
			<Fullscreen callback={fullscreenCallback}/>
			<Slideshow images={edges} isFullscreen={fullScreen}/>
		</>
	);
};

Home.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Home;

export const pageQuery = graphql`
	query Homepage {
		allPrismicPicture(filter: {data: {homepage: {eq: true}}}, limit: 5, sort: {fields: data___datetime, order: DESC}) {
			edges {
				node {
					id
					uid
					data {
						title
						image {
							alt
							gatsbyImageData(width: 1280, imgixParams: {q: 100})
							thumbnails {
								thumbnail {
									gatsbyImageData(width: 50)
								}
							}
						}
					}
				}
			}
		}
	}
`;
