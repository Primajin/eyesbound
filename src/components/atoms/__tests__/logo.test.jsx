import React from 'react';
import {render} from '@testing-library/react';

import Logo from '../logo.jsx';

describe('Logo', () => {
	it('renders correctly without props', () => {
		const {container} = render(<Logo/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const {container} = render(<Logo isFullscreen/>);
		expect(container).toMatchSnapshot();
	});
});
