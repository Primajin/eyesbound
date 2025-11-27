import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import Navigation from '../navigation.jsx';

describe('Navigation', () => {
	it('renders correctly without props', () => {
		const {container} = render(<Navigation/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const {container} = render(<Navigation isFullscreen/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly when menu is toggled', () => {
		const {container} = render(<Navigation/>);
		const div = container.querySelector('div');
		fireEvent.click(div);
		expect(container).toMatchSnapshot();
	});
});
