import React from 'react';
import { graphql } from 'gatsby';

import Picture from '../components/picture';

const Tag = ({ data: { prismicTags, allPrismicPicture } }) => {
  const { data: tagData } = prismicTags;
  const { edges: pictureData } = allPrismicPicture;
  return (
    <>
      <h1>
        Tag: {tagData.title} ({pictureData.length})
      </h1>
      <pre>{JSON.stringify(tagData, null, 2)}</pre>
      {pictureData.map(({ node: { data, id, uid } }) => (
        <a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
          <Picture data={data} />
        </a>
      ))}
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
    allPrismicPicture(filter: { data: { tags: { elemMatch: { tag: { uid: { eq: $uid } } } } } }) {
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
