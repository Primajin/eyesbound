import React from 'react';
import { graphql } from 'gatsby';

const Tag = ({ data: { prismicTags } }) => {
  const { data } = prismicTags;
  return (
    <>
      <h1>{data.title}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Tag;

export const pageQuery = graphql`
  query TagBySlug($uid: String!) {
    prismicTags(uid: { eq: $uid }) {
      uid
      data {
        title
      }
    }
  }
`;
