import PropTypes from 'prop-types';
import React, {memo, useState} from 'react';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';

import {prismicPictureNode} from '../types/proptypes.js';

const containerStyle = {
	width: '100%',
	height: '400px'
};

const center = {
	lat: 52.123,
	lng: 12.123
};

const Map = ({data}) => {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});

	const toggleInfoWindow = properties => () => {
		setInfoWindowOpen(true);
		setProperties(properties);
	};

	const {image, position, title, uid} = properties;

	return (
		<LoadScript googleMapsApiKey={process.env.G_MAPS}>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
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
								<img alt={image.alt} src={image.url} width="200"/>
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
