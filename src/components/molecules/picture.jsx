import PropTypes from 'prop-types';
import React from 'react';

import {Picture as PictureType} from '../../types/proptypes.js';

const Picture = ({data: {title, image}}) => {
	let alt;
	let src;
	let srcSet;
	let srcSetWebp;

	if (Object.prototype.hasOwnProperty.call(image, 'thumbnails')) {
		({thumbnails: {thumbnail: {fixed: {src, srcSet, srcSetWebp}}, alt}} = image);
	}

	if (Object.prototype.hasOwnProperty.call(image, 'fixed')) {
		({fixed: {src, srcSet, srcSetWebp}, alt} = image);
	}

	return (
		<picture>
			{srcSetWebp && <source srcSet={srcSetWebp} type="image/webp"/>}
			{srcSet && <source srcSet={srcSet} type="image/jpeg"/>}
			<img alt={alt || title} src={src}/>
		</picture>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(PictureType)
};

export default Picture;
