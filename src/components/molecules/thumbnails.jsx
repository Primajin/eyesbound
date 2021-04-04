import PropTypes from 'prop-types';
import React from 'react';
import {css} from '@emotion/react';

import Picture from './picture.jsx';
import {ThumbnailDataNode} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';

const thumbnailsWrapper = css`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 5px;

	${up('sm')} {
		gap: 10px;
	};

	li {
		content-visibility: auto;
	}
`;

const Thumbnails = ({edges, title, type}) => (
	<>
		<h1>
			{type}: {title} ({edges.length})
		</h1>
		<ul css={thumbnailsWrapper}>
			{edges.map(({node: {data, id, uid}}) => (
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
	edges: PropTypes.arrayOf(PropTypes.exact(ThumbnailDataNode)),
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired
};

export default Thumbnails;
