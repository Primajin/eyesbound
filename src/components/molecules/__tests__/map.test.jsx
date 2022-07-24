import React from 'react';
import {create} from 'react-test-renderer';

import Map from '../map.jsx';

describe('Map', () => {
	it('renders correctly with dark mode', () => {
		const component = create(<Map isDark data={[]}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with light mode', () => {
		const component = create(<Map isDark={false} data={[]}/>);
		expect(component).toMatchSnapshot();
	});
});
