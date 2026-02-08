import PropTypes from 'prop-types';
import React from 'react';

const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

const fallBackValues = {
	body: {},
	bodyAttributes: [],
	headComponents: {},
	htmlAttributes: [],
	postBodyComponents: '',
	preBodyComponents: [],
};

function HTML({
	body = fallBackValues.body,
	bodyAttributes = fallBackValues.bodyAttributes,
	headComponents = fallBackValues.headComponents,
	htmlAttributes = fallBackValues.htmlAttributes,
	postBodyComponents = fallBackValues.postBodyComponents,
	preBodyComponents = fallBackValues.preBodyComponents,
}) {
	return (
		<html lang='en' dir='ltr' {...(htmlAttributes)}>
			<head>
				{/* eslint-disable react/no-danger */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
									var storagePrefersDark = localStorage.getItem('userPrefersDark');
									var isDark = userPrefersDark;
									
									if (storagePrefersDark !== null) {
										try {
											isDark = JSON.parse(storagePrefersDark);
										} catch (parseError) {
											// If parsing fails, fall back to system preference
											isDark = userPrefersDark;
										}
									}
									
									if (isDark) {
										document.documentElement.style.setProperty('--background', '#000');
										document.documentElement.style.setProperty('--backgroundRGB', '0, 0, 0');
										document.documentElement.style.setProperty('--foreground', '#fff');
										document.documentElement.style.colorScheme = 'dark';
									} else {
										document.documentElement.style.setProperty('--background', '#fff');
										document.documentElement.style.setProperty('--backgroundRGB', '255, 255, 255');
										document.documentElement.style.setProperty('--foreground', '#000');
										document.documentElement.style.colorScheme = 'light';
									}
								} catch (e) {
									// Silently fail if localStorage is not available or script execution fails
								}
							})();
						`,
					}}
				/>
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
				{/* eslint-disable @stylistic/max-len */}
				<meta name='description' content='Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.'/>
				<meta name='abstract' content='Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.'/>
				{/* eslint-enable @stylistic/max-len */}
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
				{headComponents}
				{/* eslint-enable react/no-danger */}
			</head>
			<body {...(bodyAttributes)}>
				{preBodyComponents}
				{/* eslint-disable-next-line react/no-danger */}
				<div key='body' dangerouslySetInnerHTML={{__html: body}} id='___gatsby'/>
				{postBodyComponents}
			</body>
		</html>
	);
}

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array,
};

export default HTML;
