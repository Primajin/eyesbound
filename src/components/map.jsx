import PropTypes from 'prop-types';
import React, {memo} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

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
	return (
		<LoadScript preventGoogleFontsLoading googleMapsApiKey={process.env.G_MAPS}>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
				<>
					{data.map(({node: {data: {coordinates: {latitude, longitude}, title}, id, uid}}) => (
						<Marker key={id} label={title} title={uid} position={{lat: latitude, lng: longitude}}/>
					))}
				</>
			</GoogleMap>
		</LoadScript>
	);
};

Map.propTypes = {
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode))
};

export default memo(Map);
