import * as prismic from '@prismicio/client';

import {AssetTypes} from '../constants/asset-types.js';
import categoryFixtures from './__fixtures__/categories.json' with {type: 'json'};
import pictureFixtures from './__fixtures__/pictures.json' with {type: 'json'};
import seriesFixtures from './__fixtures__/series.json' with {type: 'json'};
import tagFixtures from './__fixtures__/tags.json' with {type: 'json'};
import {
	homepagePictures as filterHomepage,
	mapPictures as filterMap,
	normalizePicture,
	normalizeTitled,
	picturesByCategory as filterCategory,
	picturesBySeries as filterSeries,
	picturesByTag as filterTag,
	sortByTitle,
	sortPictures,
} from './pictures.js';
import {buildRoutes, detailPath} from './routes.js';

const fixtures = {
	picture: pictureFixtures, category: categoryFixtures, series: seriesFixtures, tags: tagFixtures,
};
const fetchLinks = ['category.title', 'series.title', 'tags.title'];

const setting = name => import.meta.env?.[name] ?? process.env[name];

/**
Tells whether fixture data is used instead of the Prismic API (explicit opt-in only, so a missing token can never ship fixtures).
 @returns {boolean} True only when PRISMIC_FIXTURES is exactly "1".
 */
export const isUsingFixtures = () => setting('PRISMIC_FIXTURES') === '1';

let client;
const getClient = () => {
	const accessToken = setting('PRISMIC_ACCESS_TOKEN');
	if (!accessToken) {
		throw new Error('PRISMIC_ACCESS_TOKEN is missing. Set it for a real build, or set PRISMIC_FIXTURES=1 to build with local fixtures.');
	}

	client ??= prismic.createClient(setting('PRISMIC_REPO_NAME') ?? 'eyesbound', {accessToken});
	return client;
};

const fetchDocuments = async (type, options) => isUsingFixtures() ? fixtures[type] : getClient().getAllByType(type, options);

const cache = new Map();
const cached = (key, load) => {
	if (!cache.has(key)) {
		cache.set(key, load());
	}

	return cache.get(key);
};

/**
All pictures, newest first. Fetched once per build.
 @returns {Promise<object[]>} Normalised pictures, newest first.
 */
export const getAllPictures = () => cached('picture', async () => {
	const documents = await fetchDocuments('picture', {orderings: [{field: 'my.picture.datetime', direction: 'desc'}], fetchLinks});
	return sortPictures(documents.map(document => normalizePicture(document)));
});

const getAllByTitle = type => cached(type, async () => {
	const documents = await fetchDocuments(type, {orderings: [{field: `my.${type}.title`, direction: 'asc'}]});
	return sortByTitle(documents.map(document => normalizeTitled(document)));
});

/**
All categories by title.
 @returns {Promise<object[]>} Category uid/title objects, A to Z.
 */
export const getCategories = () => getAllByTitle('category');

/**
All series by title.
 @returns {Promise<object[]>} Series uid/title objects, A to Z.
 */
export const getSeries = () => getAllByTitle('series');

/**
All tags by title.
 @returns {Promise<object[]>} Tag uid/title objects, A to Z.
 */
export const getTags = () => getAllByTitle('tags');

/**
Latest pictures promoted to the homepage.
 @param {number} [limit] Maximum number of pictures to return.
 @returns {Promise<object[]>} Promoted pictures, newest first.
 */
export const getHomepagePictures = async (limit = 5) => filterHomepage(await getAllPictures(), limit);

/**
Pictures with usable coordinates.
 @returns {Promise<object[]>} Pictures that can be placed on the map.
 */
export const getMapPictures = async () => filterMap(await getAllPictures());

/**
Pictures of a category.
 @param {string} uid Prismic uid of the category to match.
 @returns {Promise<object[]>} Matching pictures, newest first.
 */
export const getPicturesByCategory = async uid => filterCategory(await getAllPictures(), uid);

/**
Pictures of a series.
 @param {string} uid Prismic uid of the series to match.
 @returns {Promise<object[]>} Matching pictures, newest first.
 */
export const getPicturesBySeries = async uid => filterSeries(await getAllPictures(), uid);

/**
Pictures with a tag.
 @param {string} uid Prismic uid of the tag to match.
 @returns {Promise<object[]>} Matching pictures, newest first.
 */
export const getPicturesByTag = async uid => filterTag(await getAllPictures(), uid);

const getters = {
	picture: getAllPictures,
	category: getCategories,
	series: getSeries,
	tag: getTags,
};

/**
Builds getStaticPaths output for a detail route family; uids stay unnormalised.
 @param {'picture'|'category'|'series'|'tag'} family Detail route family to list.
 @returns {Promise<{params: {uid: string}, props: {item: object}}[]>} One entry per document, item holds its normalised data.
 */
export const getStaticPathsFor = async family => {
	const items = await getters[family]();
	return items.map(item => ({params: {uid: item.uid}, props: {item}}));
};

/**
Every route the site generates.
 @returns {Promise<string[]>} Sorted site paths, each with a trailing slash.
 */
export const getRoutes = async () => {
	const [pictures, categories, series, tags] = await Promise.all([getAllPictures(), getCategories(), getSeries(), getTags()]);
	return buildRoutes({
		pictures, categories, series, tags,
	});
};

export const routes = {
	picture: uid => detailPath(AssetTypes.PICTURE, uid),
	category: uid => detailPath(AssetTypes.CATEGORY, uid),
	series: uid => detailPath(AssetTypes.SERIES, uid),
	tag: uid => detailPath(AssetTypes.TAG, uid),
};
