import PropTypes from 'prop-types';
import React from 'react';
import {Fade} from 'react-slideshow-image';
import {css} from '@emotion/react';

import '../../styles/slideshow.css';

import {prismicPictureNode} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';

const wrapper = css`
	height: calc(100vh - 52px);
	display: flex;
`;

const figure = css`
	background: no-repeat center center fixed;
	background-size: cover;
	width: 100%;
`;

const imageDetails = css`
	display: none;
`;

// Indicators css here: src/styles/slideshow.css:115

const indicator = css`
	margin-left: 5px;
	width: 50px;
`;

const image = css`
	border: 2px solid transparent;
	cursor: pointer;
	transition: border-color .333s;
	margin-bottom: -2px;
`;

const indicatorFigCaption = css`
	bottom: 17px;
	color: var(--background);
	font-weight: 700;
	opacity: 0;
	position: absolute;
	right: 20px;
	text-align: right;
	text-transform: uppercase;
	transition: opacity .333s;

	.active & {
		opacity: 1;
	}
`;

const arrowButtons = css`
	background: var(--foreground);
	color: var(--background);
	height: 180px;
	position: fixed;
	text-align: center;
	top: 50%;
	transform: translateY(-50%);
	transition: background-color .333s, color .333s;
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

	&[data-type="next"] {
		right: 0;
	}
`;

const Slideshow = ({images}) => {
	const properties = {
		indicators: i => {
			const {
				node: {
					data: {
						title,
						image: {alt, url}
					}
				}
			} = images[i];
			return (
				<li className="indicator" css={indicator} title={title}>
					<figure>
						<img alt={alt || title} css={image} src={url}/>
						<figcaption css={indicatorFigCaption}>{title}</figcaption>
					</figure>
				</li>
			);
		},
		nextArrow: <button css={arrowButtons} tabIndex="11" type="button">»</button>,
		pauseOnHover: false,
		prevArrow: <button css={arrowButtons} tabIndex="10" type="button">«</button>
	};

	return (
		<div className="slide-container">
			<Fade {...properties}>
				{images.map(({node: {data: {title, image: {alt, url}}, id, uid}}) => (
					<a key={id} title={title} css={wrapper} href={`/picture/${uid}`}>
						<figure css={figure} style={{backgroundImage: `url(${url})`}}>
							<img css={imageDetails} src={url} alt={alt || title}/>
							<figcaption css={imageDetails}>{alt || title}</figcaption>
						</figure>
					</a>
				))}
			</Fade>
		</div>
	);
};

Slideshow.propTypes = {
	images: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode))
};

export default Slideshow;
