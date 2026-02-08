import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';

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

	it('calls focus event handler when navigation link is focused', async () => {
		const {container} = render(<Navigation/>);
		
		// Find a navigation link
		const link = container.querySelector('a[href="/picture"]');
		expect(link).toBeInTheDocument();
		
		// Set the link as the active element (simulating browser behavior)
		link.focus();
		
		// Verify link is focused
		expect(document.activeElement).toBe(link);
		
		// Trigger the focus event that the component listens for
		// The handler will check if document.activeElement is one of the nav links
		const focusEvent = new FocusEvent('focus', {bubbles: true});
		document.dispatchEvent(focusEvent);
		
		// After the focus event, menu should be open (wait for state update)
		await waitFor(() => {
			const nav = container.querySelector('nav');
			expect(nav).toHaveClass('open');
		});
	});
});
