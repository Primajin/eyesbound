import PropTypes from 'prop-types';
import React from 'react';

import Header from './header.jsx';
import HelmetMetaTags from '../atoms/helmet-meta-tags.jsx';
import List from './list.jsx';
import MainWrapper from '../atoms/main-wrapper.jsx';
import {ListDataNode} from '../../types/proptypes.js';

const Group = ({edges, path, plural}) => (
	<>
		<HelmetMetaTags title={plural} path={path}/>
		<Header/>
		<MainWrapper>
			<List title={plural} data={edges} path={path}/>
		</MainWrapper>
	</>
);

Group.propTypes = {
	edges: PropTypes.arrayOf(PropTypes.exact(ListDataNode)).isRequired,
	path: PropTypes.string.isRequired,
	plural: PropTypes.string.isRequired
};

export default Group;
