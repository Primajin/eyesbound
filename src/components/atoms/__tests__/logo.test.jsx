import React from 'react';
import {create} from 'react-test-renderer';

import Logo from '../logo.jsx';

describe('Logo', () => {
	it('renders correctly without props', () => {
		const component = create(<Logo/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<Logo isFullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
