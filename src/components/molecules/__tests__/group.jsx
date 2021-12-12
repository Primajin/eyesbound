import React from 'react';
import {create} from 'react-test-renderer';

import Group from '../group.jsx';

describe('Group', () => {
	it('renders correctly with list of zero', () => {
		const edges = [];
		const path = 'path';
		const plural = 'plural';
		const component = create(<Group plural={plural} path={path} edges={edges}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of one', () => {
		const listData = {data: {title: 'List Data Title'}, uid: '1234-5678-90'};
		const listDataNode = {node: listData};
		const edges = [listDataNode];
		const path = 'path';
		const plural = 'plural';
		const component = create(<Group plural={plural} path={path} edges={edges}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with list of more', () => {
		const listData1 = {data: {title: 'List Data Title 1'}, uid: '1234-5678-90'};
		const listData2 = {data: {title: 'List Data Title 2'}, uid: '9876-5432-10'};
		const listDataNode1 = {node: listData1};
		const listDataNode2 = {node: listData2};
		const edges = [listDataNode1, listDataNode2];
		const path = 'path';
		const plural = 'plural';
		const component = create(<Group plural={plural} path={path} edges={edges}/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
