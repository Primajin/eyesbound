const path = require('node:path');

const {codecovWebpackPlugin} = require('@codecov/webpack-plugin');
const {processHtmlFiles} = require('./csp-utils.js');

exports.onPostBuild = async () => {
	processHtmlFiles(path.join(__dirname, 'public'));
};

// Disable Gatsby's built-in eslint-webpack-plugin — its options are incompatible
// with ESLint v10. Linting is handled externally by XO.
exports.onCreateWebpackConfig = ({actions, getConfig}) => {
	const config = getConfig();
	config.plugins = config.plugins.filter(
		plugin => plugin.constructor.name !== 'ESLintWebpackPlugin',
	);
	// Put the Codecov webpack plugin after all other plugins
	config.plugins.push(
		codecovWebpackPlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: 'eyesbound',
			uploadToken: process.env.CODECOV_TOKEN,
			gitService: 'github',
		}),
	);
	actions.replaceWebpackConfig(config);
};

exports.createPages = async ({graphql, actions}) => {
	const {createPage} = actions;

	// --- Home ---
	createPage({
		path: '/',
		component: path.resolve('src/templates/home.jsx'),
	});

	// --- Worldmap ---
	createPage({
		path: '/worldmap',
		component: path.resolve('src/templates/map.jsx'),
	});

	const pages = await graphql(`
		{
			allPrismicCategory {
				edges {
					node {
						uid
					}
				}
			}
			allPrismicPicture {
				edges {
					node {
						uid
					}
				}
			}
			allPrismicSeries {
				edges {
					node {
						uid
					}
				}
			}
			allPrismicTags {
				edges {
					node {
						uid
					}
				}
			}
		}
	`);
	// --- Pictures ---
	createPage({
		path: '/picture',
		component: path.resolve('src/templates/pictures.jsx'),
	});

	for (const edge of pages.data.allPrismicPicture.edges) {
		createPage({
			path: `/picture/${edge.node.uid}`,
			component: path.resolve('src/templates/picture.jsx'),
			context: {
				uid: edge.node.uid,
			},
		});
	}

	// --- Categories ---
	createPage({
		path: '/category',
		component: path.resolve('src/templates/categories.jsx'),
	});

	for (const edge of pages.data.allPrismicCategory.edges) {
		createPage({
			path: `/category/${edge.node.uid}`,
			component: path.resolve('src/templates/category.jsx'),
			context: {
				uid: edge.node.uid,
			},
		});
	}

	// --- Series ---
	createPage({
		path: '/series',
		component: path.resolve('src/templates/series-all.jsx'),
	});

	for (const edge of pages.data.allPrismicSeries.edges) {
		createPage({
			path: `/series/${edge.node.uid}`,
			component: path.resolve('src/templates/series.jsx'),
			context: {
				uid: edge.node.uid,
			},
		});
	}

	// --- Tags ---
	createPage({
		path: '/tag',
		component: path.resolve('src/templates/tags.jsx'),
	});

	for (const edge of pages.data.allPrismicTags.edges) {
		createPage({
			path: `/tag/${edge.node.uid}`,
			component: path.resolve('src/templates/tag.jsx'),
			context: {
				uid: edge.node.uid,
			},
		});
	}
};
