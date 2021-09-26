import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {Fade} from 'react-slideshow-image';
import {css} from '@emotion/react';

import AssetTypes from '../../constants/asset-types.js';
import Picture from '../molecules/picture.jsx';
import {prismicPictureNode} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';

import '../../../static/slideshow.css';

const wrapper = css`
	height: calc(100vh - 50px);
	display: flex;
`;

const figCaption = css`
		display: none;
`;

// Indicators css here: src/styles/slideshow.css:115

const indicator = css`
	margin-left: 5px;
	width: 50px;
`;

const imageClass = css`
	border: 2px solid transparent;
	cursor: pointer;
	transition: border-color .333s;
	margin-bottom: -2px;
`;

const indicatorFigCaption = css`
	bottom: 15px;
	color: var(--background);
	display: none;
	font-weight: 700;
	opacity: 0;
	position: absolute;
	right: 20px;
	text-align: right;
	text-transform: uppercase;
	transition: opacity .333s;

	${up('md')} {
		display: block;
	};

	.active & {
		opacity: 1;
	}
`;

const arrowButtons = css`
	background: var(--foreground);
	color: var(--background);
	height: 180px;
	opacity: 1;
	position: fixed;
	text-align: center;
	top: 50%;
	transform: translateY(-50%);
	transition: background-color .333s, color .333s, opacity .333s;
	width: 40px;
	z-index: 5;

	${up('md')} {
		width: 20px;
	};

	&:hover,
	&:focus {
		background: var(--background);
		color: var(--foreground);
		outline: 0;
	}

	&.isFullscreen {
		opacity: 0.65;
	}

	&[data-type="next"] {
		right: 0;
	}
`;

const Slideshow = ({images, isFullscreen}) => {
	const properties = {
		indicators: i => {
			const {node: {data}} = images[i];
			return (
				<li className="indicator" css={indicator} title={data.title}>
					<figure>
						<Picture preferThumbnails data={data} css={imageClass} size={{height: 31, width: 46}}/>
						<figcaption css={indicatorFigCaption}>{data.title}</figcaption>
					</figure>
				</li>
			);
		},
		nextArrow: <button css={arrowButtons} className={classnames({isFullscreen})} tabIndex="11" type="button">»</button>,
		pauseOnHover: false,
		prevArrow: <button css={arrowButtons} className={classnames({isFullscreen})} tabIndex="10" type="button">«</button>,
	};
	const {PICTURE: {path}} = AssetTypes;

	return (
		<div className="slide-container">
			<Fade {...properties}>
				{images.map(({node: {data: {title, image}, id, uid}}) => (
					<a key={id} title={title} css={wrapper} href={`/${path}/${uid}`}>
						<figure>
							<Picture data={{title, image}} layout="FULL_WIDTH"/>
							<figcaption css={figCaption}>{title}</figcaption>
						</figure>
					</a>
				))}
			</Fade>
		</div>
	);
};

Slideshow.propTypes = {
	images: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	isFullscreen: PropTypes.bool,
};

export default Slideshow;
