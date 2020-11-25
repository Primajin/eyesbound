import React from 'react';
import { graphql } from 'gatsby';

import Map from '../components/map.jsx';

const Worldmap = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  return (
    <>
      <h1>Map</h1>
      <pre>{process.env.G_MAPS}</pre>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
      <Map data={edges} />
      <br />
      <br />
    </>
  );
};

export default Worldmap;

export const pageQuery = graphql`
  query Map {
    allPrismicPicture(filter: { data: { coordinates: { latitude: { ne: 0 }, longitude: { ne: 0 } } } }) {
      edges {
        node {
          data {
            coordinates {
              latitude
              longitude
            }
            title
          }
          id
          uid
        }
      }
    }
  }
`;
