import React from 'react';
import {create} from 'react-test-renderer';

import InstagramIcon from '../instagram-link.jsx';

describe('InstagramIcon', () => {
	it('renders correctly', () => {
		const component = create(<InstagramIcon/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
