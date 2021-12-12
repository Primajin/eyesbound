import React from 'react';
import {create} from 'react-test-renderer';

import ThemeSwitcher from '../theme-switcher.jsx';

describe('ThemeSwitcher', () => {
	it('renders correctly without props', () => {
		const component = create(<ThemeSwitcher/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<ThemeSwitcher isFullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
