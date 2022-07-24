import React from 'react';
import {create} from 'react-test-renderer';

import Slideshow from '../slideshow.jsx';

describe('Slideshow', () => {
	it('renders correctly with a list of zero', () => {
		const component = create(<Slideshow images={[]}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with a list of one', () => {
		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const images = [prismicPictureNode];
		const component = create(<Slideshow isFullscreen images={images}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with a list of more', () => {
		const picture1 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title1'};
		const picture2 = {coordinates: {latitude: 52.789, longitude: 13.798}, image: {}, title: 'title2'};
		const prismicPicture1 = {data: picture1, id: 'id-1', uid: 'uid-1'};
		const prismicPicture2 = {data: picture2, id: 'id-2', uid: 'uid-2'};
		const prismicPictureNode1 = {node: prismicPicture1};
		const prismicPictureNode2 = {node: prismicPicture2};
		const images = [prismicPictureNode1, prismicPictureNode2];
		const component = create(<Slideshow isFullscreen images={images}/>);
		expect(component).toMatchSnapshot();
	});
});
