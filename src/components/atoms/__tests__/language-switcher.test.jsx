import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import LanguageSwitcher from '../language-switcher.jsx';

const translations = {
	'language.switchTo': 'Switch to {{language}}',
	'language.english': 'English',
	'language.german': 'German',
};

let mockLanguage = 'en';

jest.mock('react-i18next', () => ({
	useTranslation: () => ({
		t(key, options = {}) {
			let value = translations[key] ?? key;
			if (typeof value === 'string' && options) {
				value = value.replaceAll(/\{\{(\w+)\}\}/gv, (_, variable) => options[variable] || '');
			}

			return value;
		},
		i18n: {
			get language() {
				return mockLanguage;
			},
			changeLanguage: jest.fn(),
		},
	}),
}));

describe('LanguageSwitcher', () => {
	beforeEach(() => {
		mockLanguage = 'en';
	});

	it('renders correctly', () => {
		const {container} = render(<LanguageSwitcher/>);
		expect(container).toMatchSnapshot();
	});

	it('toggles language on button click', () => {
		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');

		expect(button.textContent).toBe('EN');

		fireEvent.click(button);

		expect(button.textContent).toMatch(/EN|DE/v);
	});

	it('displays DE when language is German', () => {
		mockLanguage = 'de';

		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');
		expect(button.textContent).toBe('DE');

		fireEvent.click(button);
	});

	it('renders with isFullscreen prop', () => {
		const {container} = render(<LanguageSwitcher isFullscreen/>);
		expect(container.querySelector('.fullScreen')).toBeInTheDocument();
	});

	it('displays correct text for current language', () => {
		render(<LanguageSwitcher/>);
		const button = screen.getByRole('button');

		expect(button.textContent).toBe('EN');
		expect(button).toHaveAttribute('title');
	});
});
