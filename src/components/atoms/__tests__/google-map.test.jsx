import React from 'react';
import {act, create} from 'react-test-renderer';

import GoogleMap from '../google-map.jsx';

describe('GoogleMap', () => {
	it('renders correctly with props and a list of zero', () => {
		const center = {latitude: 52.473_092, longitude: 13.327_628};

		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const data = [prismicPictureNode];

		const hasNoInfoWindow = true;
		const height = '100px';
		const mapId = 'map-id';
		const zoom = 1;
		const component = create(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);
		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props and a list of one', async () => {
		const center = {latitude: 52.473_092, longitude: 13.327_628};

		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const data = [prismicPictureNode];

		const hasNoInfoWindow = false;
		const height = '100px';
		const mapId = 'map-id';
		const zoom = 1;
		const component = create(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);
		expect(component).toMatchSnapshot();

		await act(() => {
			component.root.findByProps({title: 'title1'}).props.onClick();
		});

		const infoWindow = component.root.findByProps({className: 'mock-info-window'});
		expect(infoWindow).toBeDefined();

		expect(component).toMatchSnapshot();
	});

	it('renders correctly with props and a list of two', async () => {
		const center = {latitude: 52.473_092, longitude: 13.327_628};

		const picture1 = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture1 = {data: picture1, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode1 = {node: prismicPicture1};
		const picture2 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title2'};
		const prismicPicture2 = {data: picture2, id: 'id-bar', uid: 'uid-baz'};
		const prismicPictureNode2 = {node: prismicPicture2};
		const data = [prismicPictureNode1, prismicPictureNode2];

		const hasNoInfoWindow = true;
		const height = '100px';
		const mapId = 'map-id';
		const zoom = 1;
		const component = create(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);

		await act(() => {
			component.root.findByProps({title: 'title1'}).props.onClick();
		});

		expect(component).toMatchSnapshot();
	});
});
