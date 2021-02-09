import PropTypes from 'prop-types';
import React from 'react';

import {Picture as PictureType} from '../../types/proptypes.js';

const Picture = ({data: {title, image: {url, alt}}}) => (
	<img src={url} alt={alt || title}/>
);

Picture.propTypes = {
	data: PropTypes.shape(PictureType)
};

export default Picture;
