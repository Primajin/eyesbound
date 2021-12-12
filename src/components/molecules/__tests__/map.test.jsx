import React from 'react';
import {create} from 'react-test-renderer';

import Map from '../map.jsx';

describe('Map', () => {
	it('renders correctly with list of zero', () => {
		const data = [];
		const component = create(<Map data={data}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	/* eslint-disable jest/no-commented-out-tests */
	/*
	Shows only "Loading..." in snapshot, needs async rendering
	it('renders correctly with list of one', () => {
		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const data = [prismicPictureNode];
		const center = {
			latitude: 52.473_092,
			longitude: 13.327_628,
		};
		const height = '100px';
		const zoom = 1;
		const component = create(<Map data={data} center={center} height={height} zoom={zoom}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of more', () => {
		const picture1 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title1'};
		const prismicPicture1 = {data: picture1, id: 'id-1', uid: 'uid-1'};
		const prismicPictureNode1 = {node: prismicPicture1};
		const picture2 = {coordinates: {latitude: 52.789, longitude: 13.798}, image: {}, title: 'title2'};
		const prismicPicture2 = {data: picture2, id: 'id-2', uid: 'uid-2'};
		const prismicPictureNode2 = {node: prismicPicture2};
		const data = [prismicPictureNode1, prismicPictureNode2];
		const center = {
			latitude: 52.473_092,
			longitude: 13.327_628,
		};
		const height = '100%';
		const zoom = 2;
		const component = create(<Map data={data} center={center} height={height} zoom={zoom}/>).toJSON();
		expect(component).toMatchSnapshot();
	});
	 */
});
