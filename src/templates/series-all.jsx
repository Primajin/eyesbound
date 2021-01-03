import React from 'react';
import { graphql } from 'gatsby';

import List from '../components/list';
import NotFoundLink from '../components/404-link';

const Series = ({ data: { allPrismicSeries } }) => {
  const { edges } = allPrismicSeries;
  return (
    <>
      <NotFoundLink />
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
