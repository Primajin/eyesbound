import React from 'react';
import {create} from 'react-test-renderer';

import Picture from '../picture.jsx';

describe('Picture', () => {
	it('renders correctly without extra props', () => {
		const data = {title: 'title', image: {}};
		const component = create(<Picture data={data}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props', () => {
		const data = {title: 'title', image: {}};
		const layout = 'FIXED';
		const preferThumbnails = true;
		const size = {height: 123, width: 456};
		const component = create(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
