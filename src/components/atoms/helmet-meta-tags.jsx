import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

const HelmetMetaTags = ({coordinates, dateTime, imageSource, path, description, title, uid}) => {
	const hasCoords = coordinates?.length > 0;
	const hasDateTime = Boolean(dateTime);
	const hasImageSource = Boolean(imageSource);
	const hasPath = Boolean(path);
	const hasDescription = Boolean(description);
	const hasTitle = Boolean(title);
	const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

	return (
		<Helmet>
			{hasTitle && <title>{title} | {GATSBY_SITE_NAME}</title>}
			{hasTitle && <meta name="title" content={`${title} | ${GATSBY_SITE_NAME}`}/>}
			{hasTitle && <meta property="og:title" content={`${title} | ${GATSBY_SITE_NAME}`}/>}
			{hasTitle && <meta name="twitter:title" content={`${title} | ${GATSBY_SITE_NAME}`}/>}
			{hasDescription && <meta property="og:description" content={description}/>}
			{hasDescription && <meta name="twitter:description" content={description}/>}
			{hasImageSource && <meta property="og:image" content={imageSource}/>}
			{hasImageSource && <meta name="twitter:image" content={imageSource}/>}
			{hasPath && <link rel="canonical" href={`${GATSBY_SERVER_URL}/${path}/${uid}`}/>}
			{hasPath && <meta property="og:url" content={`${GATSBY_SERVER_URL}/${path}/${uid}`}/>}
			{hasCoords && <meta name="geo.position" content={coordinates.join(';')}/>}
			{hasCoords && <meta name="ICBM" content={coordinates.join(', ')}/>}
			{hasDateTime && <meta name="date" content={dateTime}/>}
		</Helmet>
	);
};

HelmetMetaTags.propTypes = {
	coordinates: PropTypes.array,
	dateTime: PropTypes.string,
	description: PropTypes.string,
	imageSource: PropTypes.string,
	path: PropTypes.string,
	title: PropTypes.string,
	uid: PropTypes.string,
};

HelmetMetaTags.defaultProps = {
	coordinates: [],
	dateTime: '',
	description: '',
	imageSource: '',
	path: '',
	title: '',
	uid: '',
};

export default HelmetMetaTags;
