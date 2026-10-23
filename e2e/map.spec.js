import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {expect, test} from '@playwright/test';

import {
	enforcePolicy,
	enforceStrictCsp,
	policyFor,
	strictPolicy,
} from './helpers.js';

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

const consentKey = 'eyesbound.mapConsent';

const presetConsent = page => page.addInitScript(key => {
	localStorage.setItem(key, 'granted');
}, consentKey);

const watchGoogle = page => {
	const urls = [];
	page.on('request', request => {
		if (/google|gstatic|ggpht/v.test(new URL(request.url()).hostname)) {
			urls.push(request.url());
		}
	});
	return urls;
};

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

test.describe('without consent', () => {
	for (const [name, getPath, rule] of [['worldmap', () => '/worldmap/', '/worldmap/*'], ['picture page', pictureWithMap, '/picture/:uid/']]) {
		test(`${name} shows only the consent panel and never contacts Google`, async ({page}) => {
			const violations = await enforcePolicy(page, policyFor(rule));
			const requests = await stubMaps(page);
			const google = watchGoogle(page);

			await page.goto(getPath());
			const map = page.locator('[data-map]');
			const panel = map.locator('[data-map-consent]');
			await expect(panel).toBeVisible();
			await expect(panel.getByRole('button', {name: 'Load map'})).toBeVisible();
			await expect(panel.getByRole('link', {name: 'Privacy policy'})).toHaveAttribute('href', '/imprint/#privacy-policy');
			await map.scrollIntoViewIfNeeded();
			await page.waitForLoadState('networkidle');
			expect(requests).toHaveLength(0);
			expect(google).toEqual([]);
			expect(await page.evaluate(key => localStorage.getItem(key), consentKey)).toBeNull();
			expect(violations).toEqual([]);
		});
	}

	test('the panel is as large as the map, so loading it does not shift the layout', async ({page}) => {
		await stubMaps(page);
		await page.goto('/worldmap/');
		const map = page.locator('[data-map]');
		const before = await map.boundingBox();
		expect(await map.locator('[data-map-consent]').boundingBox()).toEqual(before);
		await page.getByRole('button', {name: 'Load map'}).click();
		await expect(map).toHaveAttribute('data-map-ready', '');
		expect(await map.boundingBox()).toEqual(before);
	});

	test('the button works from the keyboard: it loads the API, stores consent and shows the markers', async ({page}) => {
		const violations = await enforcePolicy(page, policyFor('/worldmap/*'));
		const requests = await stubMaps(page);
		await page.goto('/worldmap/');
		await page.getByRole('link', {name: 'Privacy policy'}).focus();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', {name: 'Load map'})).toBeFocused();
		await page.keyboard.press('Enter');

		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-ready', '');
		await expect(page.locator('[data-map-consent]')).toHaveCount(0);
		expect(requests).toHaveLength(1);
		expect(await page.evaluate(key => localStorage.getItem(key), consentKey)).toBe('granted');
		expect(violations).toEqual([]);
	});

	test('shows the German texts when the page language is German', async ({page}) => {
		await page.addInitScript(() => {
			localStorage.setItem('userLanguage', 'de');
		});
		await page.goto('/worldmap/');
		await expect(page.getByRole('button', {name: 'Karte laden'})).toBeVisible();
		await expect(page.getByRole('button', {name: 'Load map'})).toBeHidden();
	});

	test('flags the map when the Maps script cannot load after consent', async ({page}) => {
		await page.route(apiPattern, route => route.abort());
		await page.goto('/worldmap/');
		await page.getByRole('button', {name: 'Load map'}).click();
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-error', '');
	});
});

test.describe('worldmap with stored consent', () => {
	test('loads the Maps API when visible without a click, shows markers and an info window linking to the picture, with no CSP violations', async ({page}) => {
		await presetConsent(page);
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
		await expect(page.locator('[data-map-consent]')).toBeHidden();
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
		await presetConsent(page);
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
});

test.describe('picture map with stored consent', () => {
	test('stays unloaded until scrolled near, then shows one non-clickable marker', async ({page}) => {
		await presetConsent(page);
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

	test('consent given on one page carries over to the next map page', async ({page}) => {
		const requests = await stubMaps(page);
		await page.goto('/worldmap/');
		await page.getByRole('button', {name: 'Load map'}).click();
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-ready', '');

		await page.goto(pictureWithMap());
		await page.locator('[data-map]').scrollIntoViewIfNeeded();
		await expect(page.locator('[data-map]')).toHaveAttribute('data-map-ready', '');
		await expect(page.locator('[data-map-consent]')).toBeHidden();
		expect(requests).toHaveLength(2);
	});
});

test.describe('withdrawing consent', () => {
	test('the imprint control removes the stored consent and the map asks again', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		const google = watchGoogle(page);
		await stubMaps(page);
		await page.goto('/imprint/');
		await page.evaluate(key => localStorage.setItem(key, 'granted'), consentKey);
		await expect(page.locator('[data-map-consent-done]')).toBeHidden();

		await page.getByRole('button', {name: 'Forget map consent'}).click();
		await expect(page.locator('[data-map-consent-done]')).toBeVisible();
		expect(await page.evaluate(key => localStorage.getItem(key), consentKey)).toBeNull();

		await page.goto('/worldmap/');
		await expect(page.locator('[data-map-consent]')).toBeVisible();
		expect(google).toEqual([]);
		expect(violations).toEqual([]);
	});

	test('pages without a map show no consent UI at all', async ({page}) => {
		await page.goto('/imprint/');
		await expect(page.locator('[data-map-consent]')).toHaveCount(0);
		await page.goto('/');
		await expect(page.locator('[data-map-consent]')).toHaveCount(0);
	});
});
