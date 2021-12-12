import React from 'react';
import {create} from 'react-test-renderer';

import Navigation from '../navigation.jsx';

describe('Navigation', () => {
	it('renders correctly without props', () => {
		const component = create(<Navigation/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<Navigation isFullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
