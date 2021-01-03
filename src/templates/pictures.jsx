import React from 'react';
import { graphql } from 'gatsby';

import Picture from '../components/picture';
import NotFoundLink from '../components/404-link';

const Pictures = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  return (
    <>
      <NotFoundLink />
      <h1>Pictures ({edges.length})</h1>
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
    allPrismicPicture(sort: { fields: data___datetime, order: DESC }) {
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
