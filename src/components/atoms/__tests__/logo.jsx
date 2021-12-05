import React from 'react';
import renderer from 'react-test-renderer';

import Logo from '../logo.jsx';

describe('Logo', () => {
	it('renders correctly', () => {
		const tree = renderer.create(<Logo/>).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const tree = renderer.create(<Logo isFullscreen/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
