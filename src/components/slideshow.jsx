import PropTypes from 'prop-types';
import React from 'react';
import {css} from '@emotion/react';
import {Fade} from 'react-slideshow-image';

import {prismicPictureNode} from '../types/proptypes.js';

import 'react-slideshow-image/dist/styles.css';
import '../styles/slideshow.css';

const Slideshow = ({images}) => {
	const figure = css`
		background-repeat: no-repeat;
		background-size: cover;
		background-color: #cccccc;
		height: 80vh;
		display: flex;
	`;

	const figCaption = css`
		align-self: flex-end;
		color: #000;
		text-align: center;
		width: 100%;
	`;

	const indicator = css`
		background-color: #cccccc;
		border: 2px solid transparent;
		cursor: pointer;
		height: 50px !important;
		transition: border-color .33s;
		width: 50px !important;
	`;

	const indicatorFigCaption = css`
		display: none;
	`;

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
						<img src={url} alt={alt} width="25" height="25"/>
						<figcaption css={indicatorFigCaption}>{title}</figcaption>
					</figure>
				</li>
			);
		}
	};

	return (
		<div className="slide-container">
			<Fade {...properties}>
				{images.map(({node: {data: {title, image: {alt, url}}, id, uid}}) => (
					<figure key={id} title={title} css={figure} style={{backgroundImage: `url(${url})`}}>
						<figcaption css={figCaption}>{uid} {alt}</figcaption>
					</figure>
				))}
			</Fade>
		</div>
	);
};

Slideshow.propTypes = {
	images: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode))
};

export default Slideshow;
