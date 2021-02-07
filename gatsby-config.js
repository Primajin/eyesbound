require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
	plugins: [
		{ resolve: `gatsby-plugin-emotion` },
		{ resolve: `gatsby-plugin-react-helmet` },
		{
			resolve: 'gatsby-source-prismic',
			options: {
				repositoryName: 'eyesbound',
				accessToken: `${process.env.API_KEY}`,
				linkResolver: ({node, key, value}) => post => `/${post.uid}`,
				schemas: {
					category: require('./src/schemas/category.json'),
					picture: require('./src/schemas/picture.json'),
					series: require('./src/schemas/series.json'),
					tags: require('./src/schemas/tags.json')
				}
			}
		}
	]
};
