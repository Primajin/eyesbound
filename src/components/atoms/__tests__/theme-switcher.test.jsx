import React from 'react';
import {act, create} from 'react-test-renderer';

import ThemeSwitcher from '../theme-switcher.jsx';

describe('ThemeSwitcher', () => {
	it('renders correctly with minimum props', () => {
		const component = create(<ThemeSwitcher isDark switchTheme={jest.fn()}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with all props', () => {
		const component = create(<ThemeSwitcher isDark isFullscreen switchTheme={jest.fn()}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly when theme is toggled', () => {
		let isDark = true;
		const switchTheme = jest.fn(() => {
			isDark = !isDark;
		});

		let component;
		act(() => {
			component = create(<ThemeSwitcher isDark={isDark} switchTheme={switchTheme}/>);
		});

		expect(isDark).toBe(true);
		expect(component).toMatchSnapshot();
		act(() => {
			component.root.findByType('button').props.onClick();
			component.update(<ThemeSwitcher isDark={isDark} switchTheme={switchTheme}/>);
		});
		expect(isDark).toBe(false);
		expect(switchTheme).toHaveBeenCalled();
		expect(component).toMatchSnapshot();
	});
});
