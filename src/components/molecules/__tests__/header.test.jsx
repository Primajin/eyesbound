import React from 'react';
import {render} from '@testing-library/react';

import Header from '../header.jsx';

describe('Header', () => {
	it('renders correctly without props', () => {
		const {container} = render(<Header/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const {container} = render(<Header isFullscreen/>);
		expect(container).toMatchSnapshot();
	});
});
