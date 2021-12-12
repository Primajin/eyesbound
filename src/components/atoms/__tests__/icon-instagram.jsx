import React from 'react';
import {create} from 'react-test-renderer';

import Instagram from '../icons/instagram.jsx';

describe('Instagram', () => {
	it('renders correctly', () => {
		const component = create(<Instagram/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
