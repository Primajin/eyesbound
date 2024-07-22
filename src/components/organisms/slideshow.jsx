import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {Fade} from 'react-slideshow-image';
import {css} from '@emotion/react';
import 'react-slideshow-image/dist/styles.css';

import AssetTypes from '../../constants/asset-types.js';
import Picture from '../molecules/picture.jsx';
import {prismicPictureNode} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';
import '../../../static/slideshow.css';

const slide = css`
	background: center center transparent no-repeat;
	background-size: cover;
	display: block;
	height: 100vh;
`;

const figure = css`
	height: 100%;
	backdrop-filter: blur(10px);
`;

const figCaption = css`
	display: none;
`;

// Indicators css here: static/slideshow.css:97

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
	}

	.active & {
		opacity: 1;
	}
`;

const arrowButtons = css`
	&&& { // specificity hack
		background: var(--foreground);
		color: var(--background);
		height: 180px;
		font-size: 2rem;
		font-weight: bold;
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
			font-size: 1rem;
		}

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
	}
`;

const Slideshow = ({images, isFullscreen = false}) => {
	const properties = {
		indicators(i) {
			const {node: {data}} = images[i];
			return (
				<li className='indicator' title={data.title}>
					<figure>
						<Picture preferThumbnails data={data} size={{height: 31, width: 46}}/>
						<figcaption css={indicatorFigCaption}>{data.title}</figcaption>
					</figure>
				</li>
			);
		},
		nextArrow: <button css={arrowButtons} className={classnames({isFullscreen})} tabIndex='11' type='button'>»</button>,
		pauseOnHover: false,
		prevArrow: <button css={arrowButtons} className={classnames({isFullscreen})} tabIndex='10' type='button'>«</button>,
	};
	const {PICTURE: {path}} = AssetTypes;

	return (
		<div className='slide-container'>
			<Fade {...properties}>
				{images.map(({node: {data: {title, image}, id, uid}}) => {
					const thumbnailSource = image.thumbnails?.thumbnail.gatsbyImageData.images.fallback.src;
					return (
						<a
							key={id} css={slide}
							style={thumbnailSource && {backgroundImage: `url(${thumbnailSource})`}}
							title={title} href={`/${path}/${uid}`}
						>
							<figure css={figure}>
								<Picture data={{title, image}} layout='FULL_WIDTH'/>
								<figcaption css={figCaption}>{title}</figcaption>
							</figure>
						</a>
					);
				})}
			</Fade>
		</div>
	);
};

Slideshow.propTypes = {
	images: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	isFullscreen: PropTypes.bool,
};

export default Slideshow;
