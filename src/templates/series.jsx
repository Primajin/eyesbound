import React from 'react';
import { graphql } from 'gatsby';

import Picture from '../components/picture';

const Series = ({ data: { prismicSeries, allPrismicPicture } }) => {
  const { data: seriesData } = prismicSeries;
  const { edges: pictureData } = allPrismicPicture;
  return (
    <>
      <h1>
        Series: {seriesData.title} ({pictureData.length})
      </h1>
      <pre>{JSON.stringify(seriesData, null, 2)}</pre>
      {pictureData.map(({ node: { data, id, uid } }) => (
        <a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
          <Picture data={data} />
        </a>
      ))}
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
    allPrismicPicture(filter: { data: { series: { uid: { eq: $uid } } } }) {
      edges {
        node {
          data {
            title
            image {
              url
            }
          }
          uid
          id
        }
      }
    }
  }
`;
