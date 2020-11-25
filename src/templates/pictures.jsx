import React from 'react';
import { graphql } from 'gatsby';

import Picture from '../components/picture';

const Pictures = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  return (
    <>
      <h1>Pictures</h1>
      {edges.map(({ node: { data, id, uid } }) => (
        <a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
          <Picture data={data} />
        </a>
      ))}
    </>
  );
};

export default Pictures;

export const pageQuery = graphql`
  query AllPictures {
    allPrismicPicture {
      edges {
        node {
          id
          uid
          data {
            title
            image {
              alt
              url
            }
          }
        }
      }
    }
  }
`;
