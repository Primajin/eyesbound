import React from 'react';
import {create} from 'react-test-renderer';

import Fullscreen from '../fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly without props', () => {
		const component = create(<Fullscreen/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const callback = jest.fn();
		const selector = '';
		const component = create(<Fullscreen callback={callback} selector={selector}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('calls back the callback', () => {
		/* global document */
		document.addEventListener = jest.fn((_, callback) => {
			callback();
		});
		document.removeEventListener = jest.fn((_, callback) => {
			callback();
		});
		const callback = jest.fn();
		const selector = '';
		const component = create(<Fullscreen callback={callback} selector={selector}/>);
		component.root.findByType('button').props.onClick();
		expect(callback).toHaveBeenCalled();
	});
});
