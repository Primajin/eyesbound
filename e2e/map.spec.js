import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {expect, test} from '@playwright/test';

import {enforcePolicy, policyFor, strictPolicy} from './helpers.js';

const apiPattern = 'https://maps.googleapis.com/maps/api/js?*';

const pictureWithMap = () => {
	const directory = path.resolve('dist/picture');
	const uid = readdirSync(directory).find(name => {
		try {
			return readFileSync(path.join(directory, name, 'index.html'), 'utf8').includes('data-map');
		} catch {
			return false;
		}
	});
	if (!uid) {
		throw new Error('No built picture page with a map, build with real or fixture data first');
	}

	return `/picture/${uid}/`;
};

// Stands in for the Maps JavaScript API so the island's wiring can be tested offline; the real API is covered by map-live.spec.js.
const stubApi = `(() => {
	class GoogleMap {
		constructor(element, options) {
			const layer = document.createElement('div');
			layer.className = 'gm-style';
			layer.dataset.mapId = options.mapId;
			element.append(layer);
		}
	}
	class InfoWindow {
		setContent(content) { this.content = content; }
		open() {
			const element = document.createElement('div');
			element.className = 'gm-style-iw';
			element.append(this.content);
			document.body.append(element);
		}
	}
	class Marker {
		constructor(options) {
			this.element = document.createElement('button');
			this.element.className = 'stub-marker';
			this.element.title = options.title;
			document.body.append(this.element);
		}
		addEventListener(name, listener) { this.element.addEventListener('click', listener); }
	}
	globalThis.google = {maps: {importLibrary: async name => name === 'maps' ? {Map: GoogleMap, InfoWindow} : {AdvancedMarkerElement: Marker}}};
	globalThis[new URL(document.currentScript.src).searchParams.get('callback')]();
})();`;

const stubMaps = async page => {
	const requests = [];
	await page.route(apiPattern, route => {
		requests.push(route.request().url());
		return route.fulfill({contentType: 'text/javascript', body: stubApi});
	});
	return requests;
};

test.describe('map policy', () => {
	test('only the map routes may talk to Google', () => {
		expect(strictPolicy()).not.toMatch(/google|gstatic/v);
		for (const rule of ['/worldmap/*', '/picture/:uid/']) {
			expect(policyFor(rule)).toMatch(/script-src [^;]*https:\/\/maps\.googleapis\.com/v);
		}
	});
});

test.describe('worldmap', () => {
	test('loads the Maps API when visible, shows markers and an info window linking to the picture, with no CSP violations', async ({page}) => {
		const violations = await enforcePolicy(page, policyFor('/worldmap/*'));
		const requests = await stubMaps(page);
		const errors = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});

		await page.goto('/worldmap/');
		const map = page.locator('[data-map]');
		await expect(map).toHaveAttribute('role', 'region');
		await expect(map).toBeVisible();
		await expect(map).toHaveAttribute('data-map-ready', '');
		expect(requests).toHaveLength(1);
		expect(new URL(requests[0]).searchParams.get('key')).toBeTruthy();

		const markers = page.locator('.stub-marker');
		expect(await markers.count()).toBeGreaterThan(0);
		await markers.first().dispatchEvent('click');
		const link = page.locator('.gm-style-iw a');
		await expect(link).toHaveAttribute('href', /^\/picture\/[^\/]+\/$/v);
		await expect(link.locator('h1')).not.toBeEmpty();
		const image = link.locator('img');
		if (await image.count() > 0) {
			await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
		}

		expect(violations).toEqual([]);
		expect(errors).toEqual([]);
	});

	test('creates the second theme map only when the theme is switched', async ({page}) => {
		await page.emulateMedia({colorScheme: 'light'});
		await stubMaps(page);
		await page.goto('/worldmap/');
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-ready', '');
		await expect(page.locator('.map-layer')).toHaveCount(1);
		await expect(page.locator('.gm-style')).toHaveAttribute('data-map-id', 'bb0e93992dc84f05');

		await page.locator('[data-theme-switcher]').click();
		await expect(page.locator('.map-layer')).toHaveCount(2);
		await expect(page.locator('.map-layer[data-map-theme="dark"]')).toBeVisible();
		await expect(page.locator('.map-layer[data-map-theme="light"]')).toBeHidden();
		await expect(page.locator('.map-layer[data-map-theme="dark"] .gm-style')).toHaveAttribute('data-map-id', '3337a3a753e88572');
	});

	test('flags the map when the Maps script cannot load', async ({page}) => {
		await page.route(apiPattern, route => route.abort());
		await page.goto('/worldmap/');
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-error', '');
	});
});

test.describe('picture map', () => {
	test('stays unloaded until scrolled near, then shows one non-clickable marker', async ({page}) => {
		const violations = await enforcePolicy(page, policyFor('/picture/:uid/'));
		const requests = await stubMaps(page);

		await page.goto(pictureWithMap());
		await page.waitForLoadState('networkidle');
		expect(requests).toHaveLength(0);
		await expect(page.locator('[data-map]')).not.toHaveAttribute('data-map-ready', '');

		await page.locator('[data-map]').scrollIntoViewIfNeeded();
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-ready', '');
		expect(requests).toHaveLength(1);
		await expect(page.locator('.stub-marker')).toHaveCount(1);
		await expect(page.locator('[data-map]')).toHaveAccessibleName(/\S/v);
		expect(violations).toEqual([]);
	});
});
