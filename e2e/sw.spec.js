/* global caches */
import {expect, test} from '@playwright/test';

import {enforceStrictCsp} from './helpers.js';

test.describe('service worker', () => {
	test('is served, registers under strict CSP and deletes foreign caches on activation', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		const response = await page.request.get('/sw.js');
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toMatch(/javascript/v);

		await page.route('**/register-sw.js', route => route.fulfill({body: '', contentType: 'text/javascript'}));
		await page.goto('/');
		await page.evaluate(() => caches.open('workbox-precache-v2-https://eyesbound.com/'));
		await page.evaluate(() => caches.open('gatsby-plugin-offline-runtime'));
		expect(await page.evaluate(() => caches.keys())).toHaveLength(2);

		await page.unroute('**/register-sw.js');
		await page.reload();
		await page.evaluate(() => navigator.serviceWorker.ready);
		await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
		expect(await page.evaluate(() => caches.keys())).toEqual([]);
		expect(violations).toEqual([]);
	});

	test('links the manifest and it is valid JSON with resolvable icons', async ({page}) => {
		await page.goto('/');
		await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
		const manifestResponse = await page.request.get('/manifest.webmanifest');
		const manifest = await manifestResponse.json();
		expect(manifest.display).toBe('standalone');
		const statuses = await Promise.all(manifest.icons.map(async icon => {
			const iconResponse = await page.request.get(icon.src);
			return iconResponse.status();
		}));
		expect(statuses).toEqual(manifest.icons.map(() => 200));
	});
});
