import PropTypes from 'prop-types';
import React from 'react';

import Query from '../types/proptypes.js';

const List = ({title, data, path}) => {
	return (
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
};

List.propTypes = {
	title: PropTypes.string,
	data: PropTypes.shape(Query),
	path: PropTypes.string
};

export default List;
