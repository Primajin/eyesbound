import React from 'react';
import {render} from '@testing-library/react';

import Fullscreen from '../icons/fullscreen.jsx';

describe('Fullscreen', () => {
	it('renders correctly', () => {
		const {container} = render(<Fullscreen/>);
		expect(container).toMatchSnapshot();
	});
});
