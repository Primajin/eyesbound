import React from 'react';
import {act, create} from 'react-test-renderer';

import Picture from '../picture.jsx';

describe('Picture', () => {
	it('renders correctly without extra props', () => {
		const data = {title: 'title', image: {}};
		const component = create(<Picture data={data}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with preferThumbnails true', () => {
		let data = {title: 'title', image: {gatsbyImageData: {}}};
		const layout = 'FIXED';
		const preferThumbnails = true;
		const size = {height: 123, width: 456};
		const component = create(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(component).toMatchSnapshot();
		data = {title: 'title', image: {thumbnails: {thumbnail: {gatsbyImageData: {}}}}};
		act(() => {
			component.update(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		});
	});

	it('renders correctly with preferThumbnails false', () => {
		let data = {title: 'title', image: {gatsbyImageData: {}}};
		const layout = 'FIXED';
		const preferThumbnails = false;
		const size = {height: 123, width: 456};
		const component = create(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(component).toMatchSnapshot();
		data = {title: 'title', image: {thumbnails: {thumbnail: {gatsbyImageData: {}}}}};
		act(() => {
			component.update(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		});
	});
});
