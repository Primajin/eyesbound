import PropTypes from 'prop-types';
import React from 'react';

import {ThumbnailDataNode} from '../../types/proptypes.js';
import Picture from './picture.jsx';

const Thumbnails = ({data, title, type}) => (
	<>
		<h1>
			{type}: {title} ({data.length})
		</h1>
		<ul>
			{data.map(({node: {data, id, uid}}) => (
				<li key={id}>
					<a href={`/picture/${uid}`} aria-label="link-to-picture">
						<Picture data={data}/>
					</a>
				</li>
			))}
		</ul>
	</>
);

Thumbnails.propTypes = {
	data: PropTypes.arrayOf(PropTypes.exact(ThumbnailDataNode)),
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired
};

export default Thumbnails;
