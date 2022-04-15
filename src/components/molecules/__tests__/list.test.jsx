import React from 'react';
import {create} from 'react-test-renderer';

import List from '../list.jsx';

describe('List', () => {
	it('renders correctly with list of zero', () => {
		const data = [];
		const path = 'path';
		const title = 'title';
		const component = create(<List data={data} title={title} path={path}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of one', () => {
		const listData = {data: {title: 'List Data Title'}, uid: '1234-5678-90'};
		const listDataNode = {node: listData};
		const data = [listDataNode];
		const path = 'path';
		const title = 'title';
		const component = create(<List data={data} title={title} path={path}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of more', () => {
		const listData1 = {data: {title: 'List Data Title 1'}, uid: '1234-5678-90'};
		const listData2 = {data: {title: 'List Data Title 2'}, uid: '9876-5432-10'};
		const listDataNode1 = {node: listData1};
		const listDataNode2 = {node: listData2};
		const data = [listDataNode1, listDataNode2];
		const path = 'path';
		const title = 'title';
		const component = create(<List data={data} title={title} path={path}/>);
		expect(component).toMatchSnapshot();
	});
});
