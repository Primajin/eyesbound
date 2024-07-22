import PropTypes from 'prop-types';
import React from 'react';
import {GatsbyImage} from 'gatsby-plugin-image';
import {css} from '@emotion/react';

import {Picture as PictureType, Size as SizeType} from '../../types/proptypes.js';

const fullSize = css`
	height: calc(100vh - 50px);
	width: 100vw;
`;

// Calculate image aspect ratio
const inverseAspectRatio = 4912 / 7360;
const normal = css`
	padding-top: ${inverseAspectRatio * 100}%;
`;

const Picture = ({data: {title, image}, layout = 'CONSTRAINED', preferThumbnails = false, size = {}}) => {
	let gatsbyImageData = {};
	const alt = image.alt ?? title;
	const {height: propertiesHeight, width: propertiesWidth} = size;

	if (preferThumbnails) {
		if (Object.hasOwn(image, 'gatsbyImageData')) {
			({gatsbyImageData} = image);
		}

		if (Object.hasOwn(image, 'thumbnails')) {
			({thumbnails: {thumbnail: {gatsbyImageData}}} = image);
		}
	} else {
		if (Object.hasOwn(image, 'thumbnails')) {
			({thumbnails: {thumbnail: {gatsbyImageData}}} = image);
		}

		if (Object.hasOwn(image, 'gatsbyImageData')) {
			({gatsbyImageData} = image);
		}
	}

	const height = propertiesHeight ?? gatsbyImageData.height;
	const width = propertiesWidth ?? gatsbyImageData.width;

	const cssClass = layout === 'FULL_WIDTH' ? fullSize : normal;

	gatsbyImageData.layout = layout;

	return (
		<picture>
			<GatsbyImage css={cssClass} alt={alt} height={height} image={gatsbyImageData} width={width}/>
		</picture>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(PictureType).isRequired,
	layout: PropTypes.oneOf(['CONSTRAINED', 'FIXED', 'FULL_WIDTH']),
	preferThumbnails: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
	size: PropTypes.shape(SizeType),
};

export default Picture;
