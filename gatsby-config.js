require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
	siteMetadata: {
		siteUrl: `https://eyesbound.com`
	},
	plugins: [
		{
			resolve: 'gatsby-plugin-gatsby-cloud',
			options: {
				allPageHeaders: [
					"Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
				],
			}
		},
		{resolve: 'gatsby-plugin-emotion'},
		{resolve: 'gatsby-plugin-react-helmet'},
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
		},
		{resolve: 'gatsby-plugin-sitemap'}
	]
};
