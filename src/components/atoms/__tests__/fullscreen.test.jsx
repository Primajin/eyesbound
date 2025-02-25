import React from 'react';
import {act, create} from 'react-test-renderer';

import Fullscreen from '../fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly without props', () => {
		const component = create(<Fullscreen/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const callback = jest.fn();
		const selector = '';
		const component = create(<Fullscreen callback={callback} selector={selector}/>);
		expect(component).toMatchSnapshot();
	});

	it('calls back the callback', async () => {
		/* global document */
		document.addEventListener = jest.fn((_, callback) => {
			callback();
		});
		const callback = jest.fn();
		const selector = '';
		const component = create(<Fullscreen callback={callback} selector={selector}/>);
		await act(() => {
			component.root.findByType('button').props.onClick();
			globalThis.document.dispatchEvent(new Event('fullscreenchange'));
		});
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
