import React, { memo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 52.123,
  lng: 12.123,
};

const Map = ({ data }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.G_MAPS} preventGoogleFontsLoading>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
        <>
          {data.map(({ node: { data: { coordinates: { latitude, longitude }, title }, id, uid } }) => (
            <Marker key={id} label={title} title={uid} position={{ lat: latitude, lng: longitude }} />
          ))}
        </>
      </GoogleMap>
    </LoadScript>
  );
};

export default memo(Map);
