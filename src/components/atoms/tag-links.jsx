import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

import AssetTypes from '../../constants/asset-types.js';

const {TAG: {path}} = AssetTypes;

const TagLinks = ({tags}) => tags.map((tag, index) => {
	const uid = tag?.tag?.document?.uid;
	const title = tag?.tag?.document?.data?.title;
	return (
		<Fragment key={uid}>
			<a href={`/${path}/${uid}`}>{title}</a>{index < (tags.length - 1) && ' | '}
		</Fragment>
	);
});

TagLinks.propTypes = {
	tags: PropTypes.array.isRequired
};

export default TagLinks;
