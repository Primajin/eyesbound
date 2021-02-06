import PropTypes from 'prop-types';
import React from 'react';

import {OrderingRecordNode} from '../../types/proptypes.js';

const List = ({title, data, path}) => (
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
	title: PropTypes.string,
	data: PropTypes.arrayOf(PropTypes.exact(OrderingRecordNode)),
	path: PropTypes.string
};

export default List;
