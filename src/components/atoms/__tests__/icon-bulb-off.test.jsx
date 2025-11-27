import React from 'react';
import {render} from '@testing-library/react';

import BulbOff from '../icons/bulb-off.jsx';

describe('BulbOff', () => {
	it('renders correctly', () => {
		const {container} = render(<BulbOff/>);
		expect(container).toMatchSnapshot();
	});
});
