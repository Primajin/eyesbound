import {AssetTypes} from '../constants/asset-types.js';

const staticPaths = ['/', '/worldmap/', '/imprint/'];

/**
Builds a list path.
 @param {{path: string}} type Asset type.
 @returns {string} Path with trailing slash.
 */
export const listPath = type => `/${type.path}/`;

/**
Builds a detail path; the uid is used unchanged, never slugified.
 @param {{path: string}} type Asset type.
 @param {string} uid Prismic uid.
 @returns {string} Path with trailing slash.
 */
export const detailPath = (type, uid) => `/${type.path}/${uid}/`;

export const routes = {
	picture: uid => detailPath(AssetTypes.PICTURE, uid),
	category: uid => detailPath(AssetTypes.CATEGORY, uid),
	series: uid => detailPath(AssetTypes.SERIES, uid),
	tag: uid => detailPath(AssetTypes.TAG, uid),
};

/**
Lists every route the site generates, identical to the pre-Astro URLs (with trailing slashes).
 @param {{pictures: {uid: string}[], categories: {uid: string}[], series: {uid: string}[], tags: {uid: string}[]}} documents Normalised documents.
 @returns {string[]} Sorted unique paths.
 */
export const buildRoutes = ({pictures, categories, series, tags}) => {
	const families = [
		[AssetTypes.PICTURE, pictures],
		[AssetTypes.CATEGORY, categories],
		[AssetTypes.SERIES, series],
		[AssetTypes.TAG, tags],
	];
	const paths = [
		...staticPaths,
		...families.flatMap(([type, items]) => [listPath(type), ...items.map(({uid}) => detailPath(type, uid))]),
	];
	return [...new Set(paths)].toSorted((a, b) => a.localeCompare(b));
};

/**
Compares expected and actual route lists exactly (a trailing-slash difference counts).
 @param {string[]} expected Reference routes.
 @param {string[]} actual Generated routes.
 @returns {{missing: string[], extra: string[]}} Routes only in expected, and only in actual.
 */
export const diffRoutes = (expected, actual) => {
	const expectedSet = new Set(expected);
	const actualSet = new Set(actual);
	return {
		missing: expected.filter(route => !actualSet.has(route)).toSorted((a, b) => a.localeCompare(b)),
		extra: actual.filter(route => !expectedSet.has(route)).toSorted((a, b) => a.localeCompare(b)),
	};
};

/**
Extracts route pathnames from a sitemap XML string.
 @param {string} xml Sitemap content.
 @returns {string[]} Pathnames.
 */
export const parseSitemap = xml => xml.matchAll(/<loc>(?<location>[^<]+)<\/loc>/gv).map(({groups}) => new URL(groups.location.trim()).pathname).toArray();
