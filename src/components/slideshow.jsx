import PropTypes from 'prop-types';
import React from 'react';
import {Fade} from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';

import {prismicPictureNode} from '../types/proptypes.js';

const Slideshow = ({images}) => {
	const {
		node: {
			id,
			data: {
				title,
				image: {alt, url}
			}
		}
	} = images[0];

	console.log('url', url);

	const properties = {
		indicators: i => (
			<li className="indicator">
				<figure>
					<img src={`https://placeimg.com/${i + 300}/${i + 200}`} alt={`${alt} ${i + 1}`} width="25" height="25"/>
					<figcaption>{i + 1}</figcaption>
				</figure>
			</li>
		)
	};

	return (
		<div className="slide-container">
			<Fade {...properties}>
				<figure key={id}>
					<img src="https://placeimg.com/300/200" alt={`${alt} 1`} width="300" height="200"/>
					<figcaption>{title} 1</figcaption>
				</figure>
				<figure key={id}>
					<img src="https://placeimg.com/301/201" alt={`${alt} 2`} width="300" height="200"/>
					<figcaption>{title} 2</figcaption>
				</figure>
				<figure key={id}>
					<img src="https://placeimg.com/302/202" alt={`${alt} 3`} width="300" height="200"/>
					<figcaption>{title} 3</figcaption>
				</figure>
			</Fade>
		</div>
	);
};

Slideshow.propTypes = {
	images: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode))
};

export default Slideshow;
