import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import ThemeSwitcher from '../theme-switcher.jsx';

describe('ThemeSwitcher', () => {
	it('renders correctly with minimum props', () => {
		const {container} = render(<ThemeSwitcher isDark switchTheme={jest.fn()}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with all props', () => {
		const {container} = render(<ThemeSwitcher isDark isFullscreen switchTheme={jest.fn()}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly when theme is toggled', () => {
		let isDark = true;
		const switchTheme = jest.fn(() => {
			isDark = !isDark;
		});

		const {container, rerender} = render(<ThemeSwitcher isDark={isDark} switchTheme={switchTheme}/>);

		expect(isDark).toBe(true);
		expect(container).toMatchSnapshot();

		const button = container.querySelector('button');
		fireEvent.click(button);
		rerender(<ThemeSwitcher isDark={isDark} switchTheme={switchTheme}/>);

		expect(isDark).toBe(false);
		expect(switchTheme).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});
});
