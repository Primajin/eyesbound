import React from 'react';
import { graphql } from 'gatsby';

const Category = ({ data: { prismicCategory } }) => {
  const { data } = prismicCategory;
  return (
    <>
      <h1>{data.title}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Category;

export const pageQuery = graphql`
  query CategoryBySlug($uid: String!) {
    prismicCategory(uid: { eq: $uid }) {
      uid
      data {
        title
      }
    }
  }
`;
