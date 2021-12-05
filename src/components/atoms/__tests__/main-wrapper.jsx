import React from 'react';
import {create} from 'react-test-renderer';

import MainWrapper from '../main-wrapper.jsx';

describe('MainWrapper', () => {
	it('renders correctly', () => {
		const component = create(<MainWrapper/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<MainWrapper><h1>Hello there!</h1></MainWrapper>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
