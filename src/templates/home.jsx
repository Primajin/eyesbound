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

	const {SERVER_URL = 'https://eyesbound.com', SITE_NAME = 'EYESBOUND'} = process.env;

	if (GATSBY_IS_PREVIEW) {
		typeof window !== 'undefined' && window && window.console.info('PREVIEW MODE');
		typeof window !== 'undefined' && window && window.console.log(process.env)
	}
	typeof window !== 'undefined' && window && window.console.log(process.env)

	return (
		<>
			<Helmet>
				<title>{SITE_NAME}</title>,
				<meta name="title" content={SITE_NAME}/>,
				<link rel="canonical" href={SERVER_URL}/>,
				<meta property="og:image" content={`${SERVER_URL}${EyesboundAward}`}/>,
				<meta property="og:title" content={SITE_NAME}/>,
				<meta property="og:url" content={SERVER_URL}/>,
				<meta property="twitter:image" content={`${SERVER_URL}${EyesboundAward}`}/>,
				<meta property="twitter:title" content={SITE_NAME}/>
				<meta property="twitter:url" content={SERVER_URL}/>
				<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" media="none" onLoad="if(media!='all')media='all'"/>
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
	data: PropTypes.shape(Query)
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
							fixed(width: 1280, imgixParams: {q: 100, fm: "pjpg"}) {
								height
								src
								width
							}
						}
					}
				}
			}
		}
	}
`;
