const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function findHtmlFiles(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...findHtmlFiles(fullPath));
		} else if (entry.name.endsWith('.html')) {
			files.push(fullPath);
		}
	}

	return files;
}

function injectScriptHashes(html) {
	const hashes = new Set();
	for (const [fullMatch, , content] of html.matchAll(/<script(\s[^>]*)?>([^]*?)<\/script>/g)) {
		if (!fullMatch.includes(' src=') && content.trim()) {
			const hash = crypto.createHash('sha256').update(content).digest('base64');
			hashes.add(`'sha256-${hash}'`);
		}
	}

	if (hashes.size === 0) {
		return html;
	}

	const hashString = [...hashes].join(' ');

	return html.replace(
		/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/i,
		cspTag => cspTag.replace(/content="([^"]*)"/, (_, cspContent) => {
			const decoded = cspContent.replaceAll('&#x27;', '\'');
			const updated = decoded.replace(/(script-src\s[^;]*)/, `$1 ${hashString}`);
			return `content="${updated.replaceAll('\'', '&#x27;')}"`;
		}),
	);
}

exports.onPostBuild = async () => {
	const publicDir = path.join(__dirname, 'public');
	for (const file of findHtmlFiles(publicDir)) {
		const html = fs.readFileSync(file, 'utf8');
		const updatedHtml = injectScriptHashes(html);
		if (updatedHtml !== html) {
			fs.writeFileSync(file, updatedHtml);
		}
	}
};

exports.findHtmlFiles = findHtmlFiles;
exports.injectScriptHashes = injectScriptHashes;

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
