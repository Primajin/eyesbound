import PropTypes from 'prop-types';
import React from 'react';
import {css} from '@emotion/react';

import {ThumbnailDataNode} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';
import Picture from './picture.jsx';

const thumbnailsWrapper = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 5px;

	${up(420)} {
		grid-template-columns: 1fr 1fr;
	};

	${up('sm')} {
		grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
	};

	${up('lg')} {
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 15px;
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
						<Picture preferThumbnails data={data} size={{height: 174, width: 261}}/>
					</a>
				</li>
			))}
		</ul>
	</>
);

Thumbnails.propTypes = {
	edges: PropTypes.arrayOf(PropTypes.exact(ThumbnailDataNode)).isRequired,
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

export default Thumbnails;
