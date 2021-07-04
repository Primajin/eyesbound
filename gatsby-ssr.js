// Import React so that you can use JSX in Components
const React = require('react');
const {GATSBY_IS_PREVIEW = false} = process.env;

const HeadComponents = [
	<link key={0} href="/global.css" rel="stylesheet" media="none" onLoad="if(media!='all')media='all'"/>
];

const PostBodyComponents = [
	<script key={1} async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=eyesbound"/>
];

exports.onRenderBody = ({setHeadComponents, setPostBodyComponents}) => {
	setHeadComponents(HeadComponents);
	GATSBY_IS_PREVIEW && setPostBodyComponents(PostBodyComponents);
};
