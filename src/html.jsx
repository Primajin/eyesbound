import PropTypes from 'prop-types';
import React from 'react';

const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

/* eslint-disable react/no-danger */
const HTML = properties => (
	<html lang='en' dir='ltr' {...properties.htmlAttributes}>
		<head>
			<title>{GATSBY_SITE_NAME}</title>
			<meta charSet='utf-8'/>
			<meta httpEquiv='x-ua-compatible' content='ie=edge'/>
			<meta name='viewport' content='width=device-width, initial-scale=1'/>
			{/* Open Graph / Facebook */}
			<meta property='og:type' content='website'/>
			{/* Twitter */}
			<meta name='twitter:card' content='summary_large_image'/>
			<meta name='twitter:site' content='@helljannis'/>
			<meta name='twitter:creator' content='@helljannis'/>
			{/* General */}
			<meta name='description' content='Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.'/>
			<meta name='abstract' content='Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.'/>
			<meta name='keywords' content='eyesbound, photography, berlin, photos, fotograf, photographer, jannis, hell'/>
			<meta name='author' content='Jannis Hell'/>
			<meta name='MobileOptimized' content='width'/>
			<meta name='HandheldFriendly' content='true'/>
			{/* Windows Tile */}
			<meta name='application-name' content={GATSBY_SITE_NAME}/>
			<meta name='msapplication-TileColor' content='#000000'/>
			<meta name='msapplication-TileImage' content='/metro-tile.png'/>
			<meta name='msapplication-starturl' content={GATSBY_SERVER_URL}/>
			<meta name='msapplication-square70x70logo' content='/tiny_70x70.png'/>
			<meta name='msapplication-square150x150logo' content='/square_150x150.png'/>
			<meta name='msapplication-wide310x150logo' content='/wide_310x150.png'/>
			<meta name='msapplication-square310x310logo' content='/large_310x310.png'/>
			{properties.headComponents}
		</head>
		<body {...properties.bodyAttributes}>
			{properties.preBodyComponents}
			<div key='body' dangerouslySetInnerHTML={{__html: properties.body}} id='___gatsby'/>
			{properties.postBodyComponents}
		</body>
	</html>
);
/* eslint-enable */

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array,
};

HTML.defaultProps = {
	htmlAttributes: {},
	headComponents: [],
	bodyAttributes: {},
	preBodyComponents: [],
	body: '',
	postBodyComponents: [],
};

export default HTML;
