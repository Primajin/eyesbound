import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import Fullscreen from '../fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly without props', () => {
		const {container} = render(<Fullscreen/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const callback = jest.fn();
		const selector = '';
		const {container} = render(<Fullscreen callback={callback} selector={selector}/>);
		expect(container).toMatchSnapshot();
	});

	it('calls back the callback', () => {
		/* global document */
		document.addEventListener = jest.fn((_, callback) => {
			callback();
		});
		const callback = jest.fn();
		const selector = '';
		const {container} = render(<Fullscreen callback={callback} selector={selector}/>);
		const button = container.querySelector('button');
		fireEvent.click(button);
		globalThis.document.dispatchEvent(new Event('fullscreenchange'));
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
