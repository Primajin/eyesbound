import {readFileSync} from 'node:fs';
import {describe, expect, test} from 'vitest';

import {
	buildRoutes,
	detailPath,
	diffRoutes,
	parseSitemap,
	routes,
} from '../routes.js';

const live = readFileSync(new URL('__fixtures__/live-routes.txt', new URL('../', import.meta.url)), 'utf8').split('\n').filter(Boolean);
const documents = {
	pictures: [{uid: 'exoplanet'}, {uid: 'holland-8664-z.z.g.'}],
	categories: [{uid: 'abstract'}],
	series: [{uid: 'berlin'}],
	tags: [{uid: 'hdr'}],
};

describe('buildRoutes', () => {
	test('covers all route families with trailing slashes and unnormalised uids', () => {
		expect(buildRoutes(documents)).toEqual([
			'/',
			'/category/',
			'/category/abstract/',
			'/imprint/',
			'/picture/',
			'/picture/exoplanet/',
			'/picture/holland-8664-z.z.g./',
			'/series/',
			'/series/berlin/',
			'/tag/',
			'/tag/hdr/',
			'/worldmap/',
		]);
	});

	test('still emits the static and list routes without documents', () => {
		expect(buildRoutes({
			pictures: [], categories: [], series: [], tags: [],
		})).toHaveLength(7);
	});

	test('rebuilds the live route list from its own uids', () => {
		const uidsOf = family => live.filter(route => route.startsWith(`/${family}/`)).map(route => ({uid: route.slice(family.length + 2, -1)})).filter(({uid}) => uid);
		const rebuilt = buildRoutes({
			pictures: uidsOf('picture'), categories: uidsOf('category'), series: uidsOf('series'), tags: uidsOf('tag'),
		});
		expect(live).toHaveLength(239);
		expect(diffRoutes(live, rebuilt)).toEqual({missing: [], extra: []});
	});
});

describe('diffRoutes', () => {
	test('reports missing and extra routes', () => {
		expect(diffRoutes(['/a/', '/b/'], ['/b/', '/c/'])).toEqual({missing: ['/a/'], extra: ['/c/']});
	});

	test('sorts missing and extra routes', () => {
		expect(diffRoutes(['/z/', '/a/'], ['/y/', '/b/'])).toEqual({missing: ['/a/', '/z/'], extra: ['/b/', '/y/']});
	});

	test('treats a trailing-slash difference as a failure', () => {
		expect(diffRoutes(['/a/'], ['/a'])).toEqual({missing: ['/a/'], extra: ['/a']});
	});
});

test('parseSitemap extracts pathnames', () => {
	const xml = '<urlset><url><loc>https://eyesbound.com/picture/a.b/</loc></url><url><loc> https://eyesbound.com/ </loc></url></urlset>';
	expect(parseSitemap(xml)).toEqual(['/picture/a.b/', '/']);
});

test('detailPath keeps uids as they are', () => {
	expect(detailPath({path: 'tag'}, 'a.b')).toBe('/tag/a.b/');
});

test('route helpers build trailing-slash detail paths per family and keep the uid unchanged', () => {
	expect(routes.picture('holland-8664-z.z.g.')).toBe('/picture/holland-8664-z.z.g./');
	expect(routes.category('floral')).toBe('/category/floral/');
	expect(routes.series('shuttered')).toBe('/series/shuttered/');
	expect(routes.tag('Infrared')).toBe('/tag/Infrared/');
});
