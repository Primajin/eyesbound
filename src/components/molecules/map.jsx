import PropTypes from 'prop-types';
import React, {memo} from 'react';
import {LoadScript} from '@react-google-maps/api';
import {css, Global} from '@emotion/react';

import {prismicPictureNode} from '../../types/proptypes.js';
import GoogleMap from '../atoms/google-map.jsx';
import {centerOfGermany, mapIdDark, mapIdLight} from '../../constants/map.js';

const styles = css`
	.gm-style {
		* {
			font-family: 'Montserrat', sans-serif !important;
		}

		.gm-style-iw-d,
		.gm-style-iw-c {
			background: var(--background);
			color: var(--foreground);
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

const Map = ({center, data, height, hasNoInfoWindow, isDark, zoom}) =>
	(
		<LoadScript googleMapsApiKey={process.env.GATSBY_G_MAPS} mapIds={[mapIdDark, mapIdLight]} version='beta'>
			<Global styles={styles}/>
			<div css={{display: isDark ? 'none' : undefined}}>
				<GoogleMap data={data} height={height} center={center} hasNoInfoWindow={hasNoInfoWindow} mapId={mapIdLight} zoom={zoom}/>
			</div>
			<div css={{display: isDark ? undefined : 'none'}}>
				<GoogleMap data={data} height={height} center={center} hasNoInfoWindow={hasNoInfoWindow} mapId={mapIdDark} zoom={zoom}/>
			</div>
		</LoadScript>
	);

Map.propTypes = {
	center: PropTypes.exact({latitude: PropTypes.number, longitude: PropTypes.number}),
	data: PropTypes.arrayOf(PropTypes.exact(prismicPictureNode)).isRequired,
	hasNoInfoWindow: PropTypes.bool,
	height: PropTypes.string,
	isDark: PropTypes.bool.isRequired,
	zoom: PropTypes.number,
};

Map.defaultProps = {
	center: centerOfGermany,
	height: '100vh',
	hasNoInfoWindow: false,
	zoom: 5,
};

export default memo(Map);
