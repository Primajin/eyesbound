import React from 'react';
import {create} from 'react-test-renderer';

import TagLinks from '../tag-links.jsx';

describe('TagLinks', () => {
	it('renders correctly with empty list', () => {
		const tags = [];
		const component = create(<TagLinks tags={tags}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with tag list of one', () => {
		const tags = [
			{
				tag: {
					document: {
						data: {
							title: 'Hello',
						},
						uid: '1234-5678-90',
					},
				},
			},
		];
		const component = create(<TagLinks tags={tags}/>).toJSON();
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with tag list of more', () => {
		const tags = [
			{
				tag: {
					document: {
						data: {
							title: 'Hello',
						},
						uid: '1234-5678-90',
					},
				},
			},
			{
				tag: {
					document: {
						data: {
							title: 'There',
						},
						uid: '9876-5432-10',
					},
				},
			},
		];
		const component = create(<TagLinks tags={tags}/>).toJSON();
		expect(component).toMatchSnapshot();
	});
});
