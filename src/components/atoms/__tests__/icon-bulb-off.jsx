import React from 'react';
import {create} from 'react-test-renderer';

import BulbOff from '../icons/bulb-off.jsx';

describe('BulbOff', () => {
	it('renders correctly', () => {
		const component = create(<BulbOff/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
