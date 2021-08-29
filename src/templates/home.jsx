import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {css, Global} from '@emotion/react';
import {graphql} from 'gatsby';

import EyesboundAward from '../../docs/Eyesbound_Award.jpg';
import Fullscreen from '../components/atoms/fullscreen.jsx';
import Header from '../components/molecules/header.jsx';
import InstagramLink from '../components/atoms/instagram-link.jsx';
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
				<title>{GATSBY_SITE_NAME}</title>,
				<meta name="title" content={GATSBY_SITE_NAME}/>,
				<link rel="canonical" href={GATSBY_SERVER_URL}/>,
				<meta property="og:image" content={`${GATSBY_SERVER_URL}${EyesboundAward}`}/>,
				<meta property="og:title" content={GATSBY_SITE_NAME}/>,
				<meta property="og:url" content={GATSBY_SERVER_URL}/>,
				<meta property="twitter:image" content={`${GATSBY_SERVER_URL}${EyesboundAward}`}/>,
				<meta property="twitter:title" content={GATSBY_SITE_NAME}/>
				<meta property="twitter:url" content={GATSBY_SERVER_URL}/>
			</Helmet>
			<Global styles={css` body { overflow: hidden; } `}/>
			<Header isFullscreen={fullScreen}/>
			<Fullscreen callback={fullscreenCallback}/>
			<Slideshow images={edges} isFullscreen={fullScreen}/>
			<InstagramLink/>
		</>
	);
};

Home.propTypes = {
	data: PropTypes.shape(Query),
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
							gatsbyImageData(width: 1280, imgixParams: {q: 100, fm: "pjpg"})
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
