import PropTypes from 'prop-types';
import React, {memo, useState} from 'react';
import {GoogleMap as ReactGoogleMap, InfoWindow, Marker} from '@react-google-maps/api';

import AssetTypes from '../../constants/asset-types.js';
import Picture from '../molecules/picture.jsx';
import {prismicPictureNode} from '../../types/proptypes.js';

const GoogleMap = ({center, data, height, hasNoInfoWindow, mapId, zoom}) => {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});
	const {image, position, title, uid} = properties;
	const mapCenter = {lat: center.latitude, lng: center.longitude};

	const toggleInfoWindow = properties => () => {
		if (hasNoInfoWindow) {
			return;
		}

		setInfoWindowOpen(true);
		setProperties(properties);
	};

	const options = {mapId, streetViewControl: false};

	const {PICTURE: {path}} = AssetTypes;

	return (
		<ReactGoogleMap center={mapCenter} mapContainerStyle={{height}} options={options} zoom={zoom}>
			<>
				{data.map(({node: {data: {coordinates: {latitude, longitude}, image, title}, id, uid}}) => {
					const position = {lat: latitude, lng: longitude};
					const properties = {
						image, position, title, uid,
					};
					return <Marker key={id} position={position} title={title} clickable={!hasNoInfoWindow} onClick={toggleInfoWindow(properties)}/>;
				})}
				{ infoWindowOpen && title
					? (
						<InfoWindow position={position} options={{maxWidth: 200}} onCloseClick={() => setInfoWindowOpen(false)}>
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
};

GoogleMap.propTypes = {
	center: PropTypes.exact({latitude: PropTypes.number, longitude: PropTypes.number}).isRequired,
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	hasNoInfoWindow: PropTypes.bool.isRequired,
	height: PropTypes.string.isRequired,
	mapId: PropTypes.string.isRequired,
	zoom: PropTypes.number.isRequired,
};

export default memo(GoogleMap);
