import React from 'react';
import { graphql } from 'gatsby';

import PictureComponent from '../components/picture';

const Picture = ({ data: { prismicPicture } }) => {
  const { data } = prismicPicture;
  return <PictureComponent data={data} />;
};

export default Picture;

export const pageQuery = graphql`
  query PictureBySlug($uid: String!) {
    prismicPicture(uid: { eq: $uid }) {
      uid
      data {
        category {
          document {
            ... on PrismicCategory {
              data {
                title
              }
            }
          }
        }
        coordinates {
          latitude
          longitude
        }
        datetime
        homepage
        image {
          alt
          dimensions {
            height
            width
          }
          thumbnails
          url
        }
        series {
          document {
            ... on PrismicSeries {
              data {
                title
              }
            }
          }
        }
        title
        tags {
          tag {
            document {
              ... on PrismicTags {
                data {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;
