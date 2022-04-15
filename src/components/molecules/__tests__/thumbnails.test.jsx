import React from 'react';
import {create} from 'react-test-renderer';

import Thumbnails from '../thumbnails.jsx';

describe('Thumbnails', () => {
	it('renders correctly with list of zero', () => {
		const edges = [];
		const title = 'title';
		const type = 'type';
		const component = create(<Thumbnails edges={edges} title={title} type={type}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of one', () => {
		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const thumbnailData = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const thumbnailDataNode = {node: thumbnailData};
		const edges = [thumbnailDataNode];
		const title = 'title';
		const type = 'type';
		const component = create(<Thumbnails edges={edges} title={title} type={type}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of more', () => {
		const picture1 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title1'};
		const picture2 = {coordinates: {latitude: 52.789, longitude: 13.798}, image: {}, title: 'title2'};
		const thumbnailData1 = {data: picture1, id: 'id-1', uid: 'uid-1'};
		const thumbnailData2 = {data: picture2, id: 'id-2', uid: 'uid-2'};
		const thumbnailDataNode1 = {node: thumbnailData1};
		const thumbnailDataNode2 = {node: thumbnailData2};
		const edges = [thumbnailDataNode1, thumbnailDataNode2];
		const title = 'title';
		const type = 'type';
		const component = create(<Thumbnails edges={edges} title={title} type={type}/>);
		expect(component).toMatchSnapshot();
	});
});
