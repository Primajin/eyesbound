import React from 'react';
import {create} from 'react-test-renderer';

import FullscreenExit from '../icons/fullscreen-exit.jsx';

describe('FullscreenExit', () => {
	it('renders correctly', () => {
		const component = create(<FullscreenExit/>);
		expect(component).toMatchSnapshot();
	});
});
