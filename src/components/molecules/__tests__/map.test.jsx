import React from 'react';
import {render} from '@testing-library/react';

import Map from '../map.jsx';

describe('Map', () => {
	it('renders correctly with dark mode', () => {
		const {container} = render(<Map isDark data={[]}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with light mode', () => {
		const {container} = render(<Map isDark={false} data={[]}/>);
		expect(container).toMatchSnapshot();
	});
});
