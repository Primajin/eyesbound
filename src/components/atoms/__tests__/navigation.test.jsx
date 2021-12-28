import React from 'react';
import {act, create} from 'react-test-renderer';

import Navigation from '../navigation.jsx';

describe('Navigation', () => {
	it('renders correctly without props', () => {
		const component = create(<Navigation/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const component = create(<Navigation isFullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly when menu is toggled', () => {
		const component = create(<Navigation/>);
		act(() => {
			component.root.findByType('div').props.onClick();
		});
		expect(component.toJSON()).toMatchSnapshot();
	});
});
