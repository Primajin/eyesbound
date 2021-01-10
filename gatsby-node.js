const path = require('path');

exports.createPages = async ({graphql, actions}) => {
	const {createPage} = actions;

	// --- Home ---
	createPage({
		path: '/',
		component: path.resolve('src/templates/home.jsx')
	});

	// --- Worldmap ---
	createPage({
		path: '/worldmap',
		component: path.resolve('src/templates/map.jsx')
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
		component: path.resolve('src/templates/pictures.jsx')
	});

	pages.data.allPrismicPicture.edges.forEach(edge => {
		createPage({
			path: `/picture/${edge.node.uid}`,
			component: path.resolve('src/templates/picture.jsx'),
			context: {
				uid: edge.node.uid
			}
		});
	});

	// --- Categories ---
	createPage({
		path: '/category',
		component: path.resolve('src/templates/categories.jsx')
	});

	pages.data.allPrismicCategory.edges.forEach(edge => {
		createPage({
			path: `/category/${edge.node.uid}`,
			component: path.resolve('src/templates/category.jsx'),
			context: {
				uid: edge.node.uid
			}
		});
	});

	// --- Series ---
	createPage({
		path: '/series',
		component: path.resolve('src/templates/series-all.jsx')
	});

	pages.data.allPrismicSeries.edges.forEach(edge => {
		createPage({
			path: `/series/${edge.node.uid}`,
			component: path.resolve('src/templates/series.jsx'),
			context: {
				uid: edge.node.uid
			}
		});
	});

	// --- Tags ---
	createPage({
		path: '/tag',
		component: path.resolve('src/templates/tags.jsx')
	});

	pages.data.allPrismicTags.edges.forEach(edge => {
		createPage({
			path: `/tag/${edge.node.uid}`,
			component: path.resolve('src/templates/tag.jsx'),
			context: {
				uid: edge.node.uid
			}
		});
	});
};
