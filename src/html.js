import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/no-danger */
const HTML = props => {
	return (
		<html lang="en" dir="ltr" {...props.htmlAttributes}>
			<head>
				<title>EYESBOUND</title>
				<meta charSet="utf-8"/>
				<meta httpEquiv="x-ua-compatible" content="ie=edge"/>
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
				<meta name="theme-color" content="#000000"/>
				<link rel="shortlink" href="https://eyesbound.com/"/>
				<link rel="canonical" href="https://eyesbound.com/"/>
				<meta name="description" content="Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure."/>
				<meta name="abstract" content="Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure."/>
				<meta name="keywords" content="eyesbound, photography, berlin, photos, fotograf, jannis, hell"/>
				<meta name="MobileOptimized" content="width"/>
				<meta name="HandheldFriendly" content="true"/>
				<link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon"/>
				{/* Favicon */}
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
				<link rel="icon" href="/favicon.ico" type="image/x-icon"/>
				{/* Android */}
				<link rel="icon" sizes="192x192" href="/android.png"/>
				{/* Windows Tile */}
				<meta name="application-name" content="EYESBOUND"/>
				<meta name="msapplication-TileColor" content="#000000"/>
				<meta name="msapplication-TileImage" content="/metro-tile.png"/>
				<meta name="msapplication-starturl" content="http://eyesbound.com"/>
				<meta name="msapplication-square70x70logo" content="/tiny_70x70.png"/>
				<meta name="msapplication-square150x150logo" content="/square_150x150.png"/>
				<meta name="msapplication-wide310x150logo" content="/wide_310x150.png"/>
				<meta name="msapplication-square310x310logo" content="/large_310x310.png"/>
				{/* Apple Stuff */}
				<link rel="apple-touch-icon" href="/apple-touch-icon_57x57.png"/>
				<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon_76x76.png"/>
				<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon_120x120.png"/>
				<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon_152x152.png"/>
				<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" media="all"/>
				{props.headComponents}
			</head>
			<body {...props.bodyAttributes}>
				{props.preBodyComponents}
				<div key="body" dangerouslySetInnerHTML={{__html: props.body}} id="___gatsby"/>
				{props.postBodyComponents}
			</body>
		</html>
	);
};
/* eslint-enable */

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array
};

export default HTML;
