import React from 'react';
import {create} from 'react-test-renderer';

import Header from '../header.jsx';

describe('Header', () => {
	it('renders correctly without props', () => {
		const component = create(<Header/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<Header isFullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
