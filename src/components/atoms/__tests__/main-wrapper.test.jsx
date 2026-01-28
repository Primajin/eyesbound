import React from 'react';
import {render} from '@testing-library/react';

import MainWrapper from '../main-wrapper.jsx';

describe('MainWrapper', () => {
	it('renders correctly without props', () => {
		const {container} = render(<MainWrapper/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const {container} = render(<MainWrapper><h1>Hello there!</h1></MainWrapper>);
		expect(container).toMatchSnapshot();
	});
});
