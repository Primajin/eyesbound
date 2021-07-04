import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

const HelmetMetaTags = ({coordinates, dateTime, imageSource, path, title, uid}) => {
	const hasCoords = coordinates?.length > 0;
	const hasDateTime = Boolean(dateTime);
	const hasImageSource = Boolean(imageSource);
	const hasPath = Boolean(path);
	const hasTitle = Boolean(title);
	const {SERVER_URL = 'https://eyesbound.com', SITE_NAME = 'EYESBOUND', GATSBY_IS_PREVIEW = false} = process.env;

	return (
		<Helmet>
			{hasTitle && [
				<title key={1}>{title} | {SITE_NAME}</title>,
				<meta key={2} name="title" content={`${title} | ${SITE_NAME}`}/>
			]}
			{hasImageSource && [
				<meta key={3} property="og:image" content={imageSource}/>
			]}
			{hasPath && [
				<link key={4} rel="canonical" href={`${SERVER_URL}/${path}/${uid}`}/>,
				<meta key={5} property="og:url" content={`${SERVER_URL}/${path}/${uid}`}/>
			]}
			{hasCoords && [
				<meta key={6} name="geo.position" content={coordinates.join(';')}/>,
				<meta key={7} name="ICBM" content={coordinates.join(', ')}/>
			]}
			{hasDateTime && [
				<meta key={8} name="date" content={dateTime}/>
			]}
			<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" media="none" onLoad="if(media!='all')media='all'"/>
			<link href="/global.css" rel="stylesheet" media="none" onLoad="if(media!='all')media='all'"/>
			GATSBY_IS_PREVIEW && <script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=eyesbound"/>
		</Helmet>
	);
};

HelmetMetaTags.propTypes = {
	coordinates: PropTypes.array,
	dateTime: PropTypes.string,
	imageSource: PropTypes.string,
	path: PropTypes.string,
	title: PropTypes.string,
	uid: PropTypes.string
};

HelmetMetaTags.defaultProps = {
	coordinates: [],
	dateTime: '',
	imageSource: '',
	path: '',
	title: '',
	uid: ''
};

export default HelmetMetaTags;
