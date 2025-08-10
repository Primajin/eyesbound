import React from 'react';
import {css} from '@emotion/react';

import {children} from '../../types/proptypes.js';

const mainWrapper = css`
	width: clamp(16rem, 90vw, 70rem);
	margin: 170px auto 100px;
	padding: 0 1.5rem;

	h1, h3 {
		font-weight: 400;
		padding-bottom: 1em;
	}
`;

function MainWrapper({children = undefined}) {
	return <main css={mainWrapper}>{children}</main>;
}

MainWrapper.propTypes = {
	children,
};

export default MainWrapper;
