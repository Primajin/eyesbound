import PropTypes from 'prop-types';
import React from 'react';
import {Fade} from 'react-slideshow-image';
import {css} from '@emotion/react';

import '../styles/slideshow.css';

import {prismicPictureNode} from '../types/proptypes.js';

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
	transition: border-color .33s;
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
	transition: opacity .33s;

	.active & {
		opacity: 1;
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
						<img css={image} src={url} alt={alt || title}/>
						<figcaption css={indicatorFigCaption}>{title}</figcaption>
					</figure>
				</li>
			);
		}
	};

	return (
		<div className="slide-container">
			<Fade {...properties} pauseOnHover={false}>
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
