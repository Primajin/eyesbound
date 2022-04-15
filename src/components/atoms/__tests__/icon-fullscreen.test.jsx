import React from 'react';
import {create} from 'react-test-renderer';

import Fullscreen from '../icons/fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly', () => {
		const component = create(<Fullscreen/>);
		expect(component).toMatchSnapshot();
	});
});
