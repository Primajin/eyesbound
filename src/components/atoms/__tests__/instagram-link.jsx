import React from 'react';
import renderer from 'react-test-renderer';

import InstagramIcon from '../instagram-link.jsx';

describe('InstagramIcon', () => {
	it('renders correctly', () => {
		const tree = renderer.create(<InstagramIcon/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
