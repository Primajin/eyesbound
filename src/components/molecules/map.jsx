import PropTypes from 'prop-types';
import React, {memo, useState} from 'react';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';
import {css, Global} from '@emotion/react';

import AssetTypes from '../../constants/asset-types.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {prismicPictureNode} from '../../types/proptypes.js';
import {userPrefersDark} from '../../utils/theming.js';
import Picture from './picture.jsx';

const centerOfGermany = {
	latitude: 51.164_229_2,
	longitude: 10.454_119_4,
};

const styles = css`
	.gm-style {
		.gm-style-iw-d,
		.gm-style-iw-c {
			background: var(--background);
			color: var(--foreground);
			font-family: 'Montserrat', sans-serif;
			overflow: hidden !important;
			padding-bottom: 12px;

			> div {
				line-break: anywhere;
				padding-right: 12px;
				width: 185px;
			}
		}

		.gm-style-iw-a {
			transform: translate(-0.5px, -30px)
		}

		.gm-style-iw-t::after {
			background: var(--background);
			box-shadow: -2px 2px 2px 0 rgba(var(--backgroundRGB), 0.4);
		}

		.gm-ui-hover-effect > span {
			background-color: var(--foreground);
		}

		picture img {
			max-width: 100%;
		}
	}

	div[style*="rgb(229, 227, 223)"] {
		background: var(--background) !important;
	}

	.gm-fullscreen-control {
		width: 50px !important;
		margin: 0 !important;
		height: 50px !important;
		border-radius: 0 !important;
	}
`;

const Map = ({center, data, height, hasNoInfoWindow, zoom}) => {
	const [infoWindowOpen, setInfoWindowOpen] = useState(false);
	const [properties, setProperties] = useState({});
	const {image, position, title, uid} = properties;
	const mapCenter = {lat: center.latitude, lng: center.longitude};

	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const prefersDark = storagePrefersDark ?? userPrefersDark;

	const toggleInfoWindow = properties => () => {
		if (hasNoInfoWindow) {
			return;
		}

		setInfoWindowOpen(true);
		setProperties(properties);
	};

	const mapIdDark = '3337a3a753e88572';
	const mapIdLight = 'bb0e93992dc84f05';
	const mapId = prefersDark ? mapIdDark : mapIdLight;

	const {PICTURE: {path}} = AssetTypes;

	return (
		<LoadScript googleMapsApiKey={process.env.GATSBY_G_MAPS} mapIds={[mapIdDark, mapIdLight]} version='beta'>
			<Global styles={styles}/>
			<GoogleMap center={mapCenter} mapContainerStyle={{height}} options={{mapId}} zoom={zoom}>
				<>
					{data.map(({node: {data: {coordinates: {latitude, longitude}, image, title}, id, uid}}) => {
						const position = {lat: latitude, lng: longitude};
						const properties = {image, position, title, uid};
						return <Marker key={id} position={position} title={title} clickable={!hasNoInfoWindow} onClick={toggleInfoWindow(properties)}/>;
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
	hasNoInfoWindow: PropTypes.bool,
	zoom: PropTypes.number,
};

Map.defaultProps = {
	center: centerOfGermany,
	height: '100vh',
	hasNoInfoWindow: false,
	zoom: 5,
};

export default memo(Map);
