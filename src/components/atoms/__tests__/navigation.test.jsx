import React from 'react';
import {act, create} from 'react-test-renderer';

import Navigation from '../navigation.jsx';

describe('Navigation', () => {
	it('renders correctly without props', () => {
		const component = create(<Navigation/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<Navigation isFullscreen/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly when menu is toggled', async () => {
		const component = create(<Navigation/>);
		await act(() => {
			component.root.findByType('div').props.onClick();
		});
		expect(component).toMatchSnapshot();
	});
});
