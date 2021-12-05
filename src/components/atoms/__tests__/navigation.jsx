import React from 'react';
import renderer from 'react-test-renderer';

import Navigation from '../navigation.jsx';

describe('Navigation', () => {
	it('renders correctly', () => {
		const tree = renderer.create(<Navigation/>).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const tree = renderer.create(<Navigation isFullscreen/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
