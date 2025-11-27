import React from 'react';
import {render} from '@testing-library/react';

import Picture from '../picture.jsx';

describe('Picture', () => {
	it('renders correctly without extra props', () => {
		const data = {title: 'title', image: {}};
		const {container} = render(<Picture data={data}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with preferThumbnails true', () => {
		let data = {title: 'title', image: {gatsbyImageData: {}}};
		const layout = 'FIXED';
		const preferThumbnails = true;
		const size = {height: 123, width: 456};
		const {container, rerender} = render(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(container).toMatchSnapshot();
		data = {title: 'title', image: {thumbnails: {thumbnail: {gatsbyImageData: {}}}}};
		rerender(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with preferThumbnails false', () => {
		let data = {title: 'title', image: {gatsbyImageData: {}}};
		const layout = 'FIXED';
		const preferThumbnails = false;
		const size = {height: 123, width: 456};
		const {container, rerender} = render(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(container).toMatchSnapshot();
		data = {title: 'title', image: {thumbnails: {thumbnail: {gatsbyImageData: {}}}}};
		rerender(<Picture data={data} layout={layout} preferThumbnails={preferThumbnails} size={size}/>);
		expect(container).toMatchSnapshot();
	});
});
