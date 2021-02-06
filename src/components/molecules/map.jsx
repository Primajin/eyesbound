import PropTypes from 'prop-types';
import React, {memo, useState} from 'react';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';

import {prismicPictureNode} from '../../types/proptypes.js';
import {userPrefersDark} from '../../utils/theming.js';

const containerStyle = {
	width: '100%',
	height: 'calc(100vh - 51px)'
};

const center = { // Of Germany
	lat: 51.1642292,
	lng: 10.4541194
};

const Map = ({data}) => {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});

	const toggleInfoWindow = properties => () => {
		setInfoWindowOpen(true);
		setProperties(properties);
	};

	const {image, position, title, uid} = properties;
	const mapId = userPrefersDark ? '3337a3a753e88572' : 'bb0e93992dc84f05';

	return (
		<LoadScript googleMapsApiKey={process.env.G_MAPS} mapIds={['3337a3a753e88572', 'bb0e93992dc84f05']} version="beta">
			<GoogleMap center={center} mapContainerStyle={containerStyle} options={{mapId}} zoom={5}>
				<>
					{data.map(({node: {data: {coordinates: {latitude, longitude}, image, title}, id, uid}}) => {
						const position = {lat: latitude, lng: longitude};
						const properties = {image, position, title, uid};
						return <Marker key={id} position={position} title={title} onClick={toggleInfoWindow(properties)}/>;
					})}
					{infoWindowOpen && title && (
						<InfoWindow position={position} options={{maxWidth: 200}} onCloseClick={() => setInfoWindowOpen(false)}>
							<a href={`/picture/${uid}`} className="map-marker-info-window">
								<h1>{title}</h1>
								<img alt={image.alt || title} src={image.url} width="200"/>
							</a>
						</InfoWindow>)}
				</>
			</GoogleMap>
		</LoadScript>
	);
};

Map.propTypes = {
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode))
};

export default memo(Map);
