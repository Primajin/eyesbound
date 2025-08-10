import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Member from '../components/molecules/member.jsx';
import Query from '../types/proptypes.js';

const {PICTURE: {path, plural}} = AssetTypes;

function Pictures({data: {allPrismicPicture: {edges}}}) {
	return <Member edges={edges} name={plural} path={path} title={plural}/>;
}

Pictures.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Pictures;

export const pageQuery = graphql`query AllPictures {
  allPrismicPicture(sort: {data: {datetime: DESC}}) {
    edges {
      node {
        id
        uid
        data {
          title
          image {
            alt
            thumbnails {
              thumbnail {
                gatsbyImageData(width: 261)
              }
            }
          }
        }
      }
    }
  }
}`;
