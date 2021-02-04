import PropTypes from 'prop-types';
import React from 'react';
import {css} from '@emotion/react';

import {Picture as PictureType} from '../types/proptypes.js';

const imageTemporary = css`
	background-color: grey;
`;

const Picture = ({data: {title, image: {url, alt}}}) => (
	<>
		<h1>{title}</h1>
		<img css={imageTemporary} src={url} alt={alt || title} width="300"/>
	</>
);

Picture.propTypes = {
	data: PropTypes.shape(PictureType)
};

export default Picture;
