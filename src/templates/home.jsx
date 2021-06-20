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

	return (
		<>
			<Helmet>
				<title>EYESBOUND</title>,
				<meta name="title" content="EYESBOUND"/>,
				<link rel="canonical" href="https://eyesbound.com"/>,
				<meta property="og:image" content={EyesboundAward}/>,
				<meta property="og:title" content="EYESBOUND"/>,
				<meta property="og:url" content="https://eyesbound.com"/>,
				<meta property="twitter:image" content={EyesboundAward}/>
				<meta property="twitter:title" content="EYESBOUND"/>
				<meta property="twitter:url" content="https://eyesbound.com"/>
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
							fixed(width: 1280, imgixParams: {q: 100}) {
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
