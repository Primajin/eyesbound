import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import NotFoundPage from '../404.jsx';

describe('404 Page', () => {
	it('renders correctly', () => {
		const {container} = render(<NotFoundPage/>);
		const button = container.querySelector('button');
		fireEvent.click(button);
		expect(container).toMatchSnapshot();
	});

	it('displays the correct heading', () => {
		const {container} = render(<NotFoundPage/>);
		const heading = container.querySelector('main h1');
		expect(heading).toBeTruthy();
		expect(heading.textContent).toBe('404 - Page Not Found');
	});

	it('has a link back to home', () => {
		const {container} = render(<NotFoundPage/>);
		const link = container.querySelector('main a[href="/"]');
		expect(link).toBeTruthy();
		expect(link.textContent).toBe('Return to Home');
	});
});
