require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`
});

const {GATSBY_SERVER_URL = 'https://eyesbound.com', GATSBY_SITE_NAME = 'EYESBOUND'} = process.env;

module.exports = {
	siteMetadata: {
		siteUrl: GATSBY_SERVER_URL
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
				repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
				accessToken: process.env.GATSBY_API_KEY,
				// linkResolver: doc => `/${doc.id}`,
				linkResolver: require('./link-resolver.js').linkResolver,
				schemas: {
					category: require('./src/schemas/category.json'),
					picture: require('./src/schemas/picture.json'),
					series: require('./src/schemas/series.json'),
					tags: require('./src/schemas/tags.json')
				}
			}
		},
		{
			resolve: 'gatsby-plugin-prismic-previews',
			options: {
				repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
			},
		},
		{resolve: 'gatsby-plugin-sitemap'},
		{resolve: 'gatsby-plugin-image'},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: GATSBY_SITE_NAME,
				short_name: GATSBY_SITE_NAME,
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
				mergeScriptHashes: false,
				mergeStyleHashes: false,
				mergeDefaultDirectives: true,
				directives: {
					"connect-src": "'self' ws: localhost:* eyesbound.com:* dev.eyesbound.com:* *.gtsb.io:* *.gatsbyjs.com:*",
					"font-src": "'self' fonts.gstatic.com",
					"frame-src": "'self' eyesbound.prismic.io",
					"img-src": "'self' data: maps.gstatic.com *.googleapis.com *.ggpht images.prismic.io",
					"prefetch-src": "'self' fonts.googleapis.com fonts.gstatic.com",
					"script-src": "'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com static.cdn.prismic.io",
					"style-src": "'self' 'unsafe-inline' fonts.googleapis.com"
				}
			}
		}
	]
};
