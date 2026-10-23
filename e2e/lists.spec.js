import {readFileSync} from 'node:fs';
import path from 'node:path';
import {expect, test} from '@playwright/test';

import {enforceStrictCsp} from './helpers.js';

const sitemap = readFileSync(path.resolve('dist/sitemap-0.xml'), 'utf8');
const firstOf = family => {
	const match = new RegExp(String.raw`<loc>[^<]*?(?<path>/${family}/[^\/<]+/)</loc>`, 'v').exec(sitemap);
	if (!match) {
		throw new Error(`No /${family}/<uid>/ page in dist/sitemap-0.xml, build first`);
	}

	return match.groups.path;
};

const pages = [
	{name: 'picture list', path: '/picture/', heading: /^pictures:\s+\(\d+\)$/iv},
	{name: 'category list', path: '/category/', heading: /^categories \(\d+\)$/iv},
	{name: 'series list', path: '/series/', heading: /^series \(\d+\)$/iv},
	{name: 'tag list', path: '/tag/', heading: /^tags \(\d+\)$/iv},
	{name: 'category detail', path: firstOf('category'), heading: /^category: .+ \(\d+\)$/iv},
	{name: 'series detail', path: firstOf('series'), heading: /^series: .+ \(\d+\)$/iv},
	{name: 'tag detail', path: firstOf('tag'), heading: /^tag: .+ \(\d+\)$/iv},
	{name: 'imprint', path: '/imprint/', heading: /^contact & imprint$/iv},
];

test.describe('list, detail and static pages', () => {
	for (const {name, path: pagePath, heading} of pages) {
		test(`${name} renders under the STRICT policy without violations`, async ({page}) => {
			const violations = await enforceStrictCsp(page);
			const errors = [];
			page.on('pageerror', error => {
				errors.push(error.message);
			});

			const response = await page.goto(pagePath);
			expect(response.status()).toBe(200);
			expect(await response.headerValue('content-security-policy')).toContain('default-src \'none\'');
			await page.waitForLoadState('networkidle');

			await expect(page.locator('main h1')).toHaveText(heading, {useInnerText: true});
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${pagePath.replaceAll('.', '[.]')}$`, 'v'));
			expect(violations).toEqual([]);
			expect(errors).toEqual([]);
		});
	}

	test('only the first thumbnail is eager; all are sized, same-origin and link to picture pages', async ({page}) => {
		await page.goto('/picture/');
		const images = page.locator('main img');
		expect(await images.count()).toBeGreaterThan(1);
		const attributes = await images.evaluateAll(elements => elements.map(element => ({
			loading: element.getAttribute('loading'),
			width: element.getAttribute('width'),
			height: element.getAttribute('height'),
			alt: element.getAttribute('alt'),
		})));
		for (const [index, {loading, width, height, alt}] of attributes.entries()) {
			expect(loading).toBe(index === 0 ? 'eager' : 'lazy');
			expect(width).toMatch(/^\d+$/v);
			expect(height).toMatch(/^\d+$/v);
			expect(alt).toBeTruthy();
		}

		await images.last().scrollIntoViewIfNeeded();
		await expect.poll(() => images.last().evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
		expect(new URL(await images.last().evaluate(image => image.currentSrc)).origin).toBe(new URL(page.url()).origin);
		await expect(page.locator('main a[href^="/picture/"]').first()).toHaveAttribute('href', /^\/picture\/[^\/]+\/$/v);
	});

	test('a list links through to a detail page', async ({page}) => {
		await page.goto('/category/');
		await page.locator('main a').first().click();
		await expect(page).toHaveURL(/\/category\/[^\/]+\/$/v);
		await expect(page.locator('main h1')).toContainText(/category:/iv, {useInnerText: true});
	});

	test('404 page is served at dist root as 404.html', async ({page}) => {
		expect(readFileSync(path.resolve('dist/404.html'), 'utf8')).toContain('404 - Page Not Found');
		await page.goto('/404.html');
		await expect(page.locator('main h1')).toHaveText(/^404 - page not found$/iv, {useInnerText: true});
		await expect(page.locator('main a[href="/"]')).toBeVisible();
	});
});
