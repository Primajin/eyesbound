import {inspect} from 'node:util';
import React from 'react';
import renderer from 'react-test-renderer';

import HelmetMetaTags from '../helmet-meta-tags.jsx';

describe('HelmetMetaTags', () => {
	const options = {
		depth: 6,
		sorted: true,
	};

	it('renders correctly without any props given', () => {
		const tree = inspect(renderer.create(<HelmetMetaTags/>).toTree(), options);
		expect(tree).toMatchSnapshot();
	});

	it('renders correctly with props given', () => {
		const coordinates = [52.473_092, 13.327_628];
		const dateTime = '1986-03-14T11:25:00+0000';
		const description = 'Anyone can hold the helm when the sea is calm';
		const imageSource = 'https://images.prismic.io/eyesbound/d4b035f1-21c8-476a-bd8f-6335f44ced7d__DSC2116.jpg';
		const path = 'picture';
		const title = 'Libeskind';
		const uid = 'libeskind';
		const tree = inspect(renderer.create(
			<HelmetMetaTags
				coordinates={coordinates}
				dateTime={dateTime}
				description={description}
				imageSource={imageSource}
				path={path}
				title={title}
				uid={uid}
			/>,
		).toTree(), options);
		expect(tree).toMatchSnapshot();
	});
});
