import React from 'react';
import {render} from '@testing-library/react';

import FullscreenExit from '../icons/fullscreen-exit.jsx';

describe('FullscreenExit', () => {
	it('renders correctly', () => {
		const {container} = render(<FullscreenExit/>);
		expect(container).toMatchSnapshot();
	});
});
