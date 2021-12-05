import React from 'react';
import renderer from 'react-test-renderer';

import MainWrapper from '../main-wrapper.jsx';

describe('MainWrapper', () => {
	it('renders correctly', () => {
		const tree = renderer.create(<MainWrapper/>).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const tree = renderer.create(<MainWrapper><h1>Hello there!</h1></MainWrapper>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
