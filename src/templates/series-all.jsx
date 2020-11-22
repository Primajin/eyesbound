import React from 'react';
import { graphql } from 'gatsby';

import List from '../components/list';

const Series = ({ data: { allPrismicSeries } }) => {
  const { edges } = allPrismicSeries;
  return (
    <>
      <List title="Series" data={edges} path="series" />
      <h2>Raw Data:</h2>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </>
  );
};

export default Series;

export const pageQuery = graphql`
  query AllSeries {
    allPrismicSeries {
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
