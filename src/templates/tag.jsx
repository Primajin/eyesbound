import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';

import AssetTypes from '../constants/asset-types.js';
import Member from '../components/molecules/member.jsx';
import Query from '../types/proptypes.js';

const {TAG: {name, path}} = AssetTypes;

const Tag = ({data: {prismicTags, allPrismicPicture}}) => {
	const {data: tagData} = prismicTags;
	const {edges} = allPrismicPicture;
	return <Member edges={edges} name={name} path={path} uid={prismicTags.uid} title={tagData.title}/>;
};

Tag.propTypes = {
	data: PropTypes.shape(Query).isRequired,
};

export default Tag;

export const pageQuery = graphql`query TagBySlug($uid: String!) {
  prismicTags(uid: {eq: $uid}) {
    uid
    data {
      title
    }
  }
  allPrismicPicture(
    filter: {data: {tags: {elemMatch: {tag: {uid: {eq: $uid}}}}}}
    sort: {data: {datetime: DESC}}
  ) {
    edges {
      node {
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
        uid
        id
      }
    }
  }
}`;
