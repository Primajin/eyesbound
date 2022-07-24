import React from 'react';
import {act, create} from 'react-test-renderer';

import Member from '../member.jsx';

describe('Member', () => {
	it('renders correctly with a list of zero', () => {
		const name = 'name';
		const title = 'title';
		const component = create(<Member edges={[]} title={title} name={name}/>);
		act(() => {
			component.root.findByType('button').props.onClick();
		});
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with a list of one', () => {
		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const thumbnailData = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const thumbnailDataNode = {node: thumbnailData};
		const edges = [thumbnailDataNode];
		const name = 'name';
		const title = 'title';
		const component = create(<Member edges={edges} title={title} name={name}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with a list of more', () => {
		const picture1 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title1'};
		const picture2 = {coordinates: {latitude: 52.789, longitude: 13.798}, image: {}, title: 'title2'};
		const thumbnailData1 = {data: picture1, id: 'id-1', uid: 'uid-1'};
		const thumbnailData2 = {data: picture2, id: 'id-2', uid: 'uid-2'};
		const thumbnailDataNode1 = {node: thumbnailData1};
		const thumbnailDataNode2 = {node: thumbnailData2};
		const edges = [thumbnailDataNode1, thumbnailDataNode2];
		const name = 'name';
		const title = 'title';
		const component = create(<Member edges={edges} title={title} name={name}/>);
		expect(component).toMatchSnapshot();
	});
});
