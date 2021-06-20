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
					'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
				]
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
		{resolve: 'gatsby-plugin-sitemap'},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Eyesbound`,
				short_name: `Eyesbound`,
				description: `Portfolio Website for Eyesbound Photography – Berlin based photographer Jannis Hell. The focus lies on fine art photography with architecture and environmental images. Founded in 2005, Eyesbound switched from analogue to digital photography, using hdr and infrared techniques as well as extreme bulb exposure.`,
				start_url: `/`,
				background_color: `#fff`,
				theme_color: `#000`,
				display: `standalone`,
				icon: `static/logo.png`,
				icon_options: {purpose: `any maskable`},
				cache_busting_mode: 'none',
				theme_color_in_head: false
			}
		},
		{
			resolve: 'gatsby-plugin-offline',
			options: {
				workboxConfig: {
					globPatterns: ['**/static*']
				}
			}
		},
		{
			resolve: `gatsby-plugin-csp`,
			options: {
				disableOnDev: false,
				mergeScriptHashes: true,
				mergeStyleHashes: true,
				mergeDefaultDirectives: true,
				directives: {
					"connect-src": "'self' ws: localhost:* eyesbound.com:* dev.eyesbound.com:* *.gtsb.io:*",
					"font-src": "'self' fonts.gstatic.com",
					"img-src": "'self' data: maps.gstatic.com *.googleapis.com *.ggpht images.prismic.io",
					"script-src": "'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com",
					"style-src": "'self' 'unsafe-inline' fonts.googleapis.com"
				}
			}
		}
	]
};
