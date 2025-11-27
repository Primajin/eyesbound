import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import Imprint from '../imprint.jsx';

describe('Imprint', () => {
	it('renders correctly', () => {
		const {container} = render(<Imprint/>);
		const button = container.querySelector('button');
		fireEvent.click(button);
		expect(container).toMatchSnapshot();
	});
});
