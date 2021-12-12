import React from 'react';
import {create} from 'react-test-renderer';

import Imprint from '../imprint.jsx';

describe('Imprint', () => {
	it('renders correctly', () => {
		const component = create(<Imprint/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
