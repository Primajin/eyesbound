import PropTypes from 'prop-types';
import {GatsbyImage} from 'gatsby-plugin-image';
import {css} from '@emotion/react';

import {Picture as PictureType, Size as SizeType} from '../../types/proptypes.js';

const Picture = ({data: {title, image}, layout = 'CONSTRAINED', preferThumbnails = false, size = {}}) => {
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

	const fullSize = css`
	height: calc(100vh - 50px);
	width: 100vw;
`;

	const normal = css`
	height: ${height}px;
	width: 100%;
`;

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
