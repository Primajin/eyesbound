import PropTypes from 'prop-types';
import React, {memo, useMemo, useState} from 'react';
import {GoogleMap as ReactGoogleMap, InfoWindow, Marker} from '@react-google-maps/api';

import AssetTypes from '../../constants/asset-types.js';
import Picture from '../molecules/picture.jsx';
import {prismicPictureNode} from '../../types/proptypes.js';

function GoogleMap({center, data, height, hasNoInfoWindow, mapId, zoom}) {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});
	const {image, position, title, uid} = properties;
	const mapCenter = useMemo(() => ({lat: center.latitude, lng: center.longitude}), [center.latitude, center.longitude]);

	const toggleInfoWindow = markerProperties => () => {
		if (hasNoInfoWindow) {
			return;
		}

		setInfoWindowOpen(true);
		setProperties(markerProperties);
	};

	const options = useMemo(() => ({mapId, streetViewControl: false}), [mapId]);
	const mapContainerStyle = useMemo(() => ({height}), [height]);
	const infoWindowOptions = useMemo(() => ({maxWidth: 200}), []);

	const {PICTURE: {path}} = AssetTypes;

	return (
		<ReactGoogleMap center={mapCenter} mapContainerStyle={mapContainerStyle} options={options} zoom={zoom}>
			<>
				{data.map(({node}) => {
					const {id, uid: markerUid, data: markerData} = node;
					const {image: markerImage, title: markerTitle, coordinates: {latitude, longitude}} = markerData;
					const markerPosition = {lat: latitude, lng: longitude};
					const markerProperties = {
						image: markerImage, position: markerPosition, title: markerTitle, uid: markerUid,
					};
					return <Marker key={id} position={markerPosition} title={markerTitle} clickable={!hasNoInfoWindow} onClick={toggleInfoWindow(markerProperties)}/>;
				})}
				{ infoWindowOpen && title
					? (
						<InfoWindow position={position} options={infoWindowOptions} onCloseClick={() => setInfoWindowOpen(false)}>
							<a href={`/${path}/${uid}`}>
								<h1>{title}</h1>
								<Picture preferThumbnails data={{title, image}} size={{height: 110, width: 164}}/>
							</a>
						</InfoWindow>
					)
					: null}
			</>
		</ReactGoogleMap>
	);
}

GoogleMap.propTypes = {
	center: PropTypes.exact({latitude: PropTypes.number, longitude: PropTypes.number}).isRequired,
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	hasNoInfoWindow: PropTypes.bool.isRequired,
	height: PropTypes.string.isRequired,
	mapId: PropTypes.string.isRequired,
	zoom: PropTypes.number.isRequired,
};

export default memo(GoogleMap);
