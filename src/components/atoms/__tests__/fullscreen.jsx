import React from 'react';
import renderer from 'react-test-renderer';

import Fullscreen from '../fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly', () => {
		const callback = jest.fn();
		const selector = '';
		const tree = renderer.create(<Fullscreen callback={callback} selector={selector}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
