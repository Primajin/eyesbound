import React from 'react';
import { graphql } from 'gatsby';

import List from '../components/list';

const Tag = ({ data: { allPrismicTags } }) => {
  const { edges } = allPrismicTags;
  return (
    <>
      <List title="Tags" data={edges} path="tag" />
      <h2>Raw Data:</h2>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </>
  );
};

export default Tag;

export const pageQuery = graphql`
  query AllTags {
    allPrismicTags {
      edges {
        node {
          uid
          data {
            title
          }
        }
      }
    }
  }
`;
