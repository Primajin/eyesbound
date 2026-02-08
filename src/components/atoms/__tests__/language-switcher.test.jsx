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

	it('displays German when starting from German language', () => {
		// Mock i18n to start with German
		const mockUseTranslation = require('react-i18next').useTranslation;
		const originalImplementation = mockUseTranslation;

		jest.spyOn(require('react-i18next'), 'useTranslation').mockImplementation(() => ({
			t(key, options) {
				if (key === 'language.switchTo') {
					return `Wechseln zu ${options?.language || ''}`;
				}

				if (key === 'language.english') {
					return 'Englisch';
				}

				if (key === 'language.german') {
					return 'Deutsch';
				}

				return key;
			},
			i18n: {
				language: 'de',
				changeLanguage: jest.fn(),
			},
		}));

		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');

		// Should display "DE" when language is German
		expect(button.textContent).toBe('DE');
		expect(button).toHaveAttribute('title', 'Wechseln zu Englisch');

		// Restore original mock
		require('react-i18next').useTranslation.mockRestore();
	});
});
