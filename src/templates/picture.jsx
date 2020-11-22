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
        title
        image {
          url
          alt
          dimensions {
            height
            width
          }
        }
        datetime
        coordinates {
          latitude
          longitude
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
        category {
          document {
            ... on PrismicCategory {
              data {
                title
              }
            }
          }
        }
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
