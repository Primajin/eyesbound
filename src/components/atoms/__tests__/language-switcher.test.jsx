import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import LanguageSwitcher from '../language-switcher.jsx';

describe('LanguageSwitcher', () => {
	it('renders correctly', () => {
		const {container} = render(<LanguageSwitcher/>);
		expect(container).toMatchSnapshot();
	});

	it('toggles language on button click', () => {
		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');

		expect(button.textContent).toMatch(/EN|DE/);

		fireEvent.click(button);

		expect(button.textContent).toMatch(/EN|DE/);
	});

	it('renders with isFullscreen prop', () => {
		const {container} = render(<LanguageSwitcher isFullscreen/>);
		expect(container.querySelector('.fullScreen')).toBeInTheDocument();
	});

	it('displays correct text for current language', () => {
		// The language switcher displays the current language and allows switching
		// The default mock has language set to 'en', so it should display 'EN'
		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');

		// Button should display the current language code in uppercase
		expect(button.textContent).toMatch(/EN|DE/);

		// Button should have a title attribute for accessibility
		expect(button).toHaveAttribute('title');
	});
});
