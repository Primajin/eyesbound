import React from 'react';
import { graphql } from 'gatsby';

import Picture from '../components/picture';

const Category = ({ data: { prismicCategory, allPrismicPicture } }) => {
  const { data: categoryData } = prismicCategory;
  const { edges: pictureData } = allPrismicPicture;
  return (
    <>
      <h1>Category: {categoryData.title}</h1>
      <pre>{JSON.stringify(categoryData, null, 2)}</pre>
      {pictureData.map(({ node: { data, id, uid } }) => (
        <a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
          <Picture data={data} />
        </a>
      ))}
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
    allPrismicPicture(filter: { data: { category: { uid: { eq: $uid } } } }) {
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
