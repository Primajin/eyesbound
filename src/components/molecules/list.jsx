import PropTypes from 'prop-types';
import React from 'react';

import {ListDataNode} from '../../types/proptypes.js';

const List = ({data, path, title}) => (
	<>
		<h1>
			{title} ({data.length})
		</h1>
		<ul>
			{data.map(({node: {uid, data: {title}}}) => (
				<li key={uid}>
					<a href={`/${path}/${uid}`} aria-label={`link-to-${path}`}>
						{title}
					</a>
				</li>
			))}
		</ul>
	</>
);

List.propTypes = {
	data: PropTypes.arrayOf(PropTypes.exact(ListDataNode)).isRequired,
	path: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default List;
