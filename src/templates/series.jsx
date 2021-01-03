import React from 'react';
import { graphql } from 'gatsby';

const Series = ({ data: { prismicSeries } }) => {
  const { data } = prismicSeries;
  return (
    <>
      <h1>Series: {data.title}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Series;

export const pageQuery = graphql`
  query SeriesBySlug($uid: String!) {
    prismicSeries(uid: { eq: $uid }) {
      uid
      data {
        title
      }
    }
  }
`;
