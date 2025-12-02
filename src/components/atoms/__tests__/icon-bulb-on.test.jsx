import React from 'react';
import {render} from '@testing-library/react';

import BulbOn from '../icons/bulb-on.jsx';

describe('BulbOn', () => {
	it('renders correctly', () => {
		const {container} = render(<BulbOn/>);
		expect(container).toMatchSnapshot();
	});
});
