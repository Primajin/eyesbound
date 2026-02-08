import React from 'react';
import {fireEvent, render} from '@testing-library/react';

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
		const {container} = render(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);
		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props and a list of one', () => {
		const center = {latitude: 52.473_092, longitude: 13.327_628};

		const picture = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture = {data: picture, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode = {node: prismicPicture};
		const data = [prismicPictureNode];

		const hasNoInfoWindow = false;
		const height = '100px';
		const mapId = 'map-id';
		const zoom = 1;
		const {container} = render(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);
		expect(container).toMatchSnapshot();

		const marker = container.querySelector('[title="title1"]');
		fireEvent.click(marker);

		const infoWindow = container.querySelector('.mock-info-window');
		expect(infoWindow).toBeDefined();

		expect(container).toMatchSnapshot();
	});

	it('renders correctly with props and a list of two', () => {
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
		const {container} = render(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);

		const marker = container.querySelector('[title="title1"]');
		fireEvent.click(marker);

		expect(container).toMatchSnapshot();
	});

	it('maintains correct InfoWindow position when clicking different markers', () => {
		const center = {latitude: 52.473_092, longitude: 13.327_628};

		const picture1 = {coordinates: {latitude: 52.123, longitude: 13.123}, image: {}, title: 'title1'};
		const prismicPicture1 = {data: picture1, id: 'id-foo', uid: 'uid-bar'};
		const prismicPictureNode1 = {node: prismicPicture1};
		const picture2 = {coordinates: {latitude: 52.456, longitude: 13.456}, image: {}, title: 'title2'};
		const prismicPicture2 = {data: picture2, id: 'id-bar', uid: 'uid-baz'};
		const prismicPictureNode2 = {node: prismicPicture2};
		const data = [prismicPictureNode1, prismicPictureNode2];

		const hasNoInfoWindow = false;
		const height = '100px';
		const mapId = 'map-id';
		const zoom = 1;
		const {container} = render(<GoogleMap center={center} data={data} hasNoInfoWindow={hasNoInfoWindow} height={height} mapId={mapId} zoom={zoom}/>);

		// Click on first marker
		const marker1 = container.querySelector('[title="title1"]');
		fireEvent.click(marker1);

		// Check that InfoWindow is shown at correct position
		let infoWindow = container.querySelector('.mock-info-window');
		expect(infoWindow).toBeDefined();
		expect(infoWindow.dataset.positionLat).toBe('52.123');
		expect(infoWindow.dataset.positionLng).toBe('13.123');

		// Click on second marker
		const marker2 = container.querySelector('[title="title2"]');
		fireEvent.click(marker2);

		// Check that InfoWindow is now at the second marker's position
		infoWindow = container.querySelector('.mock-info-window');
		expect(infoWindow).toBeDefined();
		expect(infoWindow.dataset.positionLat).toBe('52.456');
		expect(infoWindow.dataset.positionLng).toBe('13.456');

		expect(container).toMatchSnapshot();
	});
});
