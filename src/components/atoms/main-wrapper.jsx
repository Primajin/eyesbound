import React from 'react';
import {css} from '@emotion/react';

import {children} from '../../types/proptypes.js';
import {up} from '../../utils/theming.js';

const mainWrapper = css`
	margin: 170px auto 100px;

	${up('md')} {
		max-width: 80%;
	};

	${up('xl')} {
		max-width: 1150px;
	};

	h1, h3 {
		font-weight: 400;
		padding-bottom: 1em;
	}
`;

const MainWrapper = ({children}) => <main css={mainWrapper}>{children}</main>;

MainWrapper.propTypes = {
	children
};

export default MainWrapper;
