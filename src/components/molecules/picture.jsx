import PropTypes from 'prop-types';
import React from 'react';
import {GatsbyImage} from 'gatsby-plugin-image';

import {Picture as PictureType, Size as SizeType} from '../../types/proptypes.js';

const Picture = ({data: {title, image}, preferThumbnails = false, size = {}}) => {
	let gatsbyImageData;
	const alt = image.alt ?? title;
	const {height: propsHeight, width: propsWidth} = size;

	if (preferThumbnails) {
		if (Object.prototype.hasOwnProperty.call(image, 'gatsbyImageData')) {
			({gatsbyImageData} = image);
		}

		if (Object.prototype.hasOwnProperty.call(image, 'thumbnails')) {
			({thumbnails: {thumbnail: {gatsbyImageData}}} = image);
		}
	} else {
		if (Object.prototype.hasOwnProperty.call(image, 'thumbnails')) {
			({thumbnails: {thumbnail: {gatsbyImageData}}} = image);
		}

		if (Object.prototype.hasOwnProperty.call(image, 'gatsbyImageData')) {
			({gatsbyImageData} = image);
		}
	}

	const height = propsHeight ?? gatsbyImageData.height;
	const width = propsWidth ?? gatsbyImageData.width;

	return (
		<picture>
			<GatsbyImage alt={alt} height={height} image={gatsbyImageData} width={width}/>
		</picture>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(PictureType).isRequired,
	preferThumbnails: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
	size: PropTypes.shape(SizeType),
};

export default Picture;
