import React from 'react';
import { graphql } from 'gatsby';
import Picture from '../components/picture';

const Home = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  return (
    <>
      <h1>Home</h1>
      <p>Get only homepage=true pictures:</p>
      {edges.map(({ node: { data, id, uid } }) => (
        <a key={id} href={`/picture/${uid}`} aria-label="link-to-picture">
          <Picture data={data} />
        </a>
      ))}
      <pre>{JSON.stringify(edges, null, 2)}</pre>
    </>
  );
};

export default Home;

export const pageQuery = graphql`
  query Homepage {
    allPrismicPicture(filter: { data: { homepage: { eq: true } } }, limit: 5) {
      edges {
        node {
          id
          uid
          data {
            title
            image {
              alt
              url
            }
          }
        }
      }
    }
  }
`;
