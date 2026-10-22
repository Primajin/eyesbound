import {describe, expect, test} from 'vitest';

import pictureFixtures from '../__fixtures__/pictures.json' with {type: 'json'};
import tagFixtures from '../__fixtures__/tags.json' with {type: 'json'};
import {
	homepagePictures,
	hasLocation,
	mapPictures,
	normalizePicture,
	normalizeTitled,
	picturesByCategory,
	picturesBySeries,
	picturesByTag,
	sortByTitle,
	sortPictures,
} from '../pictures.js';

const pictures = sortPictures(pictureFixtures.map(document => normalizePicture(document)));
const uids = list => list.map(({uid}) => uid);

describe('normalizePicture', () => {
	test('maps a full document', () => {
		const picture = pictures.find(({uid}) => uid === 'holland-8664-z.z.g.');
		expect(picture).toMatchObject({
			title: 'Holland Z.Z.G.',
			homepage: true,
			category: {uid: 'architecture', title: 'Architecture'},
			series: {uid: 'holland', title: 'Holland'},
			image: {width: 1500, height: 1000},
			thumbnail: {width: 280},
			coordinates: {latitude: 52.1, longitude: 5.1},
		});
		expect(uids(picture.tags)).toEqual(['hdr', 'infrared']);
	});

	test('turns empty links, coordinates and images into explicit null', () => {
		const picture = pictures.find(({uid}) => uid === 'no-image');
		expect(picture).toMatchObject({
			image: null, thumbnail: null, series: null, tags: [],
		});
		expect(pictures.find(({uid}) => uid === 'no-date')).toMatchObject({coordinates: null, datetime: null, category: {uid: 'abstract'}});
	});

	test('ignores broken links', () => {
		const picture = normalizePicture({uid: 'a', data: {category: {uid: 'x', isBroken: true}}});
		expect(picture.category).toBeNull();
	});

	test('throws without uid', () => {
		expect(() => normalizePicture({id: 'abc', data: {}})).toThrow('abc');
		expect(() => normalizeTitled({id: 'abc', type: 'tags'})).toThrow('tags document abc');
	});

	test('keeps a missing link title as null', () => {
		expect(normalizeTitled({uid: 'a'})).toEqual({uid: 'a', title: null});
	});
});

describe('sorting', () => {
	test('sorts pictures newest first with undated last', () => {
		expect(uids(pictures)).toEqual(['home-7', 'home-6', 'home-5', 'home-4', 'zirkuszelt', 'exoplanet', 'holland-8664-z.z.g.', 'no-image', 'no-date']);
	});

	test('breaks ties by uid', () => {
		const same = [{uid: 'b', datetime: '2020-01-01T00:00:00+0000'}, {uid: 'a', datetime: '2020-01-01T00:00:00+0000'}];
		expect(uids(sortPictures(same))).toEqual(['a', 'b']);
	});

	test('sorts by title ascending with untitled last', () => {
		const items = tagFixtures.map(document => normalizeTitled(document));
		expect(uids(sortByTitle([{uid: 'z', title: null}, ...items, {uid: 'y', title: null}]))).toEqual(['hdr', 'infrared', 'unused', 'y', 'z']);
	});

	test('sorts titles by code point like the live site: upper case, then lower case, umlauts after plain letters', () => {
		const titles = ['digital', 'Dänemark', 'Dresden', 'Zons', 'Dessau'].map(title => ({uid: title, title}));
		expect(uids(sortByTitle(titles))).toEqual(['Dessau', 'Dresden', 'Dänemark', 'Zons', 'digital']);
	});

	test('does not mutate its input', () => {
		const input = [{uid: 'b', datetime: null}, {uid: 'a', datetime: null}];
		sortPictures(input);
		expect(uids(input)).toEqual(['b', 'a']);
	});
});

describe('filters', () => {
	test('homepage returns the latest 5 promoted pictures', () => {
		expect(uids(homepagePictures(pictures))).toEqual(['home-7', 'home-6', 'home-5', 'home-4', 'zirkuszelt']);
		expect(homepagePictures(pictures, 2)).toHaveLength(2);
	});

	test('map excludes 0/0 and unknown coordinates but keeps a single zero axis', () => {
		const mapped = uids(mapPictures(pictures));
		expect(mapped).not.toContain('exoplanet');
		expect(mapped).not.toContain('no-date');
		expect(mapped).toContain('no-image');
		expect(mapped).toContain('holland-8664-z.z.g.');
	});

	test('filters by category, series and tag', () => {
		expect(uids(picturesByCategory(pictures, 'abstract'))).toEqual(['home-5', 'exoplanet', 'no-image', 'no-date']);
		expect(uids(picturesBySeries(pictures, 'holland'))).toEqual(['home-6', 'holland-8664-z.z.g.']);
		expect(uids(picturesByTag(pictures, 'infrared'))).toEqual(['exoplanet', 'holland-8664-z.z.g.']);
	});

	test('returns an empty list for unknown or unused uids', () => {
		expect(picturesByTag(pictures, 'unused')).toEqual([]);
		expect(picturesByCategory(pictures, 'nope')).toEqual([]);
	});
});

describe('hasLocation', () => {
	test.each([
		[{latitude: 52.5, longitude: 13.4}, true],
		[{latitude: 0, longitude: 13.4}, true],
		[{latitude: 0, longitude: 0}, false],
		[null, false],
	])('%j gives %s', (coordinates, expected) => {
		expect(hasLocation(coordinates)).toBe(expected);
	});
});
