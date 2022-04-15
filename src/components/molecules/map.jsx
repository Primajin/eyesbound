import PropTypes from 'prop-types';
import React, {memo, useState} from 'react';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';

import AssetTypes from '../../constants/asset-types.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {prismicPictureNode} from '../../types/proptypes.js';
import {userPrefersDark} from '../../utils/theming.js';
import Picture from './picture.jsx';

const centerOfGermany = {
	latitude: 51.164_229_2,
	longitude: 10.454_119_4,
};

const Map = ({center, data, height, zoom}) => {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});
	const mapCenter = {lat: center.latitude, lng: center.longitude};

	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const prefersDark = storagePrefersDark ?? userPrefersDark;

	const toggleInfoWindow = properties => () => {
		setInfoWindowOpen(true);
		setProperties(properties);
	};

	const {image, position, title, uid} = properties;
	const mapIdDark = '3337a3a753e88572';
	const mapIdLight = 'bb0e93992dc84f05';
	const mapId = prefersDark ? mapIdDark : mapIdLight;

	const {PICTURE: {path}} = AssetTypes;

	return (
		<LoadScript googleMapsApiKey={process.env.GATSBY_G_MAPS} mapIds={[mapIdDark, mapIdLight]} version="beta">
			<GoogleMap center={mapCenter} mapContainerStyle={{height}} options={{mapId}} zoom={zoom}>
				<>
					{data.map(({node: {data: {coordinates: {latitude, longitude}, image, title}, id, uid}}) => {
						const position = {lat: latitude, lng: longitude};
						const properties = {image, position, title, uid};
						return <Marker key={id} position={position} title={title} onClick={toggleInfoWindow(properties)}/>;
					})}
					{infoWindowOpen && title && (
						<InfoWindow position={position} options={{maxWidth: 200}} onCloseClick={() => setInfoWindowOpen(false)}>
							<a href={`/${path}/${uid}`}>
								<h1>{title}</h1>
								<Picture preferThumbnails data={{title, image}} size={{height: 110, width: 164}}/>
							</a>
						</InfoWindow>
					)}
				</>
			</GoogleMap>
		</LoadScript>
	);
};

Map.propTypes = {
	center: PropTypes.exact({latitude: PropTypes.number, longitude: PropTypes.number}),
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	height: PropTypes.string,
	zoom: PropTypes.number,
};

Map.defaultProps = {
	center: centerOfGermany,
	height: '100vh',
	zoom: 5,
};

export default memo(Map);
