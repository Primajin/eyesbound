import React from 'react';
import {create} from 'react-test-renderer';

import BulbOn from '../icons/bulb-on.jsx';

describe('BulbOn', () => {
	it('renders correctly', () => {
		const component = create(<BulbOn/>);
		expect(component).toMatchSnapshot();
	});
});
