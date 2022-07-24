import React from 'react';
import {act, create} from 'react-test-renderer';

import Imprint from '../imprint.jsx';

describe('Imprint', () => {
	it('renders correctly', () => {
		const component = create(<Imprint/>);
		act(() => {
			component.root.findByType('button').props.onClick();
		});
		expect(component).toMatchSnapshot();
	});
});
