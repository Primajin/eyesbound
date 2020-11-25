import React from 'react';
import { graphql } from 'gatsby';

const Category = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  return (
    <>
      <h2>Map</h2>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </>
  );
};

export default Category;

export const pageQuery = graphql`
  query Map {
    allPrismicPicture {
      edges {
        node {
          data {
            coordinates {
              latitude
              longitude
            }
          }
        }
      }
    }
  }
`;
