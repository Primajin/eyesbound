import PropTypes from 'prop-types';
import React from 'react';

const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

/* eslint-disable react/no-danger */
const HTML = props => (
	<html lang="en" dir="ltr" {...props.htmlAttributes}>
		<head>
			<title>{GATSBY_SITE_NAME}</title>
			<meta charSet="utf-8"/>
			<meta httpEquiv="x-ua-compatible" content="ie=edge"/>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<link rel="preconnect" href="https://fonts.gstatic.com"/>
			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			{/* Open Graph / Facebook */}
			<meta property="og:type" content="website"/>
			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image"/>
			<meta name="twitter:site" content="@helljannis"/>
			<meta name="twitter:creator" content="@helljannis"/>
			{/* General */}
			<meta name="description" content="Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure."/>
			<meta name="abstract" content="Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure."/>
			<meta name="keywords" content="eyesbound, photography, berlin, photos, fotograf, photographer, jannis, hell"/>
			<meta name="author" content="Jannis Hell"/>
			<meta name="MobileOptimized" content="width"/>
			<meta name="HandheldFriendly" content="true"/>
			<link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon"/>
			{/* Favicon */}
			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
			<link rel="icon" href="/favicon.ico" type="image/x-icon"/>
			{/* Android */}
			<link rel="icon" sizes="192x192" href="/android.png"/>
			{/* Windows Tile */}
			<meta name="application-name" content={GATSBY_SITE_NAME}/>
			<meta name="msapplication-TileColor" content="#000000"/>
			<meta name="msapplication-TileImage" content="/metro-tile.png"/>
			<meta name="msapplication-starturl" content={GATSBY_SERVER_URL}/>
			<meta name="msapplication-square70x70logo" content="/tiny_70x70.png"/>
			<meta name="msapplication-square150x150logo" content="/square_150x150.png"/>
			<meta name="msapplication-wide310x150logo" content="/wide_310x150.png"/>
			<meta name="msapplication-square310x310logo" content="/large_310x310.png"/>
			<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
			<link href="/reset.css" rel="stylesheet"/>
			<link href="/global.css" rel="stylesheet"/>
			{props.headComponents}
		</head>
		<body {...props.bodyAttributes}>
			{props.preBodyComponents}
			<div key="body" dangerouslySetInnerHTML={{__html: props.body}} id="___gatsby"/>
			{props.postBodyComponents}
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
