import React from 'react';
import { graphql } from 'gatsby';

import List from '../components/list';

const Category = ({ data: { allPrismicCategory } }) => {
  const { edges } = allPrismicCategory;
  return (
    <>
      <List title="Categories" data={edges} path="category" />
      <h2>Raw Data:</h2>
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </>
  );
};

export default Category;

export const pageQuery = graphql`
  query AllCategories {
    allPrismicCategory {
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
