import React from 'react';
import { graphql } from 'gatsby';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import Picture from '../components/picture';

const Home = ({
  data: {
    allPrismicPicture: { edges },
  },
}) => {
  const {
    node: { id, uid },
  } = edges[0];

  const properties = {
    indicators: i => (
      <li className="indicator">
        <figure>
          <img src={`https://placebear.com/${i + 300}/${i + 200}`} alt={`Bear ${i + 1}`} width="25" height="25" />
          <figcaption>{i + 1}</figcaption>
        </figure>
      </li>
    ),
  };

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

      <div className="slide-container">
        <Fade {...properties}>
          <figure key={id}>
            <img src="https://placebear.com/300/200" alt="Bear 1" width="300" height="200" />
            <figcaption>{uid} 1</figcaption>
          </figure>
          <figure key={id}>
            <img src="https://placebear.com/301/201" alt="Bear 2" width="300" height="200" />
            <figcaption>{uid} 2</figcaption>
          </figure>
          <figure key={id}>
            <img src="https://placebear.com/302/202" alt="Bear 3" width="300" height="200" />
            <figcaption>{uid} 3</figcaption>
          </figure>
        </Fade>
      </div>
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
