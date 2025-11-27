import React from 'react';
import {fireEvent, render} from '@testing-library/react';

import Group from '../group.jsx';

describe('Group', () => {
	it('renders correctly with a list of zero', () => {
		const path = 'path';
		const plural = 'plural';
		const {container} = render(<Group edges={[]} plural={plural} path={path}/>);
		const button = container.querySelector('button');
		fireEvent.click(button);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with a list of one', () => {
		const listData = {data: {title: 'List Data Title'}, uid: '1234-5678-90'};
		const listDataNode = {node: listData};
		const edges = [listDataNode];
		const path = 'path';
		const plural = 'plural';
		const {container} = render(<Group edges={edges} plural={plural} path={path}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with a list of more', () => {
		const listData1 = {data: {title: 'List Data Title 1'}, uid: '1234-5678-90'};
		const listData2 = {data: {title: 'List Data Title 2'}, uid: '9876-5432-10'};
		const listDataNode1 = {node: listData1};
		const listDataNode2 = {node: listData2};
		const edges = [listDataNode1, listDataNode2];
		const path = 'path';
		const plural = 'plural';
		const {container} = render(<Group edges={edges} plural={plural} path={path}/>);
		expect(container).toMatchSnapshot();
	});
});
