import React from 'react';
import { graphql } from 'gatsby';

const Home = ({ data }) => {
  return (
    <>
      <h1>Home</h1>
      <p>Get only homepage=true pictures:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Home;

export const pageQuery = graphql`
  query Home {
    allPrismicPicture(filter: { data: { homepage: { eq: true } } }) {
      edges {
        node {
          uid
        }
      }
    }
  }
`;
