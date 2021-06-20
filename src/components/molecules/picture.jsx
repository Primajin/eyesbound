import PropTypes from 'prop-types';
import React from 'react';

import {Picture as PictureType, Size as SizeType} from '../../types/proptypes.js';

const Picture = ({data: {title, image}, size = {}}) => {
	let alt;
	let src;
	let srcSet;
	let srcSetWebp;
	const {height, width} = size;

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
			<img alt={alt || title} height={height} src={src} width={width}/>
		</picture>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(PictureType).isRequired,
	size: PropTypes.shape(SizeType)
};

export default Picture;
