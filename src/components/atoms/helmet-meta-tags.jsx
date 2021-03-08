import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

const HelmetMetaTags = ({imageSource, path, title, uid}) => {
	const hasImageSource = Boolean(imageSource);
	const hasPath = Boolean(path);
	const hasTitle = Boolean(title);

	return (
		<Helmet>
			{hasTitle && [
				<title key={1}>{title} | EYESBOUND</title>,
				<meta key={2} name="title" content={`${title} | EYESBOUND`}/>,
				<meta key={3} property="og:title" content={`${title} | EYESBOUND`}/>,
				<meta key={4} property="twitter:title" content={`${title} | EYESBOUND`}/>
			]}
			{hasImageSource && [
				<meta key={5} property="og:image" content={imageSource}/>,
				<meta key={6} property="twitter:image" content={imageSource}/>
			]}
			{hasPath && [
				<link key={7} rel="canonical" href={`https://eyesbound.com/${path}/${uid}`}/>,
				<meta key={8} property="og:url" content={`https://eyesbound.com/${path}/${uid}`}/>,
				<meta key={9} property="twitter:url" content={`https://eyesbound.com/${path}/${uid}`}/>
			]}
		</Helmet>
	);
};

HelmetMetaTags.propTypes = {
	imageSource: PropTypes.string,
	path: PropTypes.string,
	title: PropTypes.string,
	uid: PropTypes.string
};

HelmetMetaTags.defaultProps = {
	imageSource: '',
	path: '',
	title: '',
	uid: ''
};

export default HelmetMetaTags;
