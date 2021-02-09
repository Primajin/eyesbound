import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

const TagLinks = ({tags}) => tags.map((tag, index) => {
	const uid = tag?.tag?.document?.uid;
	const title = tag?.tag?.document?.data?.title;
	return (
		<Fragment key={uid}>
			<a href={`/tag/${uid}`}>{title}</a>{index < (tags.length - 1) && ' | '}
		</Fragment>
	);
});

TagLinks.propTypes = {
	tags: PropTypes.array.isRequired
};

export default TagLinks;
