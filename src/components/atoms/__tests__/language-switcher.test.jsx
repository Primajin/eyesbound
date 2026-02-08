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
});
