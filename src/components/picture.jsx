import PropTypes from 'prop-types';
import React from 'react';

import Query from '../types/proptypes.js';

const Picture = ({data}) => {
	return (
		<>
			<h1>{data && data.title}</h1>
			{data && data.image && <img src={data.image.url} alt={data.image.alt} width="300"/>}
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</>
	);
};

Picture.propTypes = {
	data: PropTypes.shape(Query)
};

export default Picture;
