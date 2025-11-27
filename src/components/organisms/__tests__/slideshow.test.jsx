import React from 'react';
import {render} from '@testing-library/react';

import Slideshow from '../slideshow.jsx';

describe('Slideshow', () => {
	it('renders correctly with a list of zero', () => {
		const {container} = render(<Slideshow images={[]}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with a list of one', () => {
		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const images = [prismicPictureNode];
		const {container} = render(<Slideshow isFullscreen images={images}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with a list of more', () => {
		const picture1 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title1'};
		const picture2 = {coordinates: {latitude: 52.789, longitude: 13.798}, image: {}, title: 'title2'};
		const prismicPicture1 = {data: picture1, id: 'id-1', uid: 'uid-1'};
		const prismicPicture2 = {data: picture2, id: 'id-2', uid: 'uid-2'};
		const prismicPictureNode1 = {node: prismicPicture1};
		const prismicPictureNode2 = {node: prismicPicture2};
		const images = [prismicPictureNode1, prismicPictureNode2];
		const {container} = render(<Slideshow isFullscreen images={images}/>);
		expect(container).toMatchSnapshot();
	});
});
