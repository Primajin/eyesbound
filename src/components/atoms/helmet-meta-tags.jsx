import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

const defaultCoordinates = [];
// eslint-disable-next-line complexity
function HelmetMetaTags({coordinates = defaultCoordinates, dateTime = '', imageSource = '', path = '', description = '', title = '', uid = ''}) {
	const hasCoords = coordinates?.length > 0;
	const hasDateTime = Boolean(dateTime);
	const hasImageSource = Boolean(imageSource);
	const hasPath = Boolean(path);
	const hasDescription = Boolean(description);
	const hasTitle = Boolean(title);
	const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;
	const titleText = `${title} | ${GATSBY_SITE_NAME}`;

	return (
		<Helmet>
			{hasTitle ? <title>{titleText}</title> : null}
			{hasTitle ? <meta name='title' content={titleText}/> : null}
			{hasTitle ? <meta property='og:title' content={titleText}/> : null}
			{hasTitle ? <meta name='twitter:title' content={titleText}/> : null}
			{hasDescription ? <meta property='og:description' content={description}/> : null}
			{hasDescription ? <meta name='twitter:description' content={description}/> : null}
			{hasImageSource ? <meta property='og:image' content={imageSource}/> : null}
			{hasImageSource ? <meta name='twitter:image' content={imageSource}/> : null}
			{hasPath ? <link rel='canonical' href={`${GATSBY_SERVER_URL}/${path}/${uid}`}/> : null}
			{hasPath ? <meta property='og:url' content={`${GATSBY_SERVER_URL}/${path}/${uid}`}/> : null}
			{hasCoords ? <meta name='geo.position' content={coordinates.join(';')}/> : null}
			{hasCoords ? <meta name='ICBM' content={coordinates.join(', ')}/> : null}
			{hasDateTime ? <meta name='date' content={dateTime}/> : null}
		</Helmet>
	);
}

HelmetMetaTags.propTypes = {
	coordinates: PropTypes.array,
	dateTime: PropTypes.string,
	description: PropTypes.string,
	imageSource: PropTypes.string,
	path: PropTypes.string,
	title: PropTypes.string,
	uid: PropTypes.string,
};

export default HelmetMetaTags;
