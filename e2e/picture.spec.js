/* global document */
import {expect, test} from '@playwright/test';

import {enforceStrictCsp, firstPicturePath} from './helpers.js';

const picturePath = firstPicturePath();

test.describe('picture detail page', () => {
	test('renders hero, metadata and has no CSP violations under the STRICT policy', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		const errors = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});

		const response = await page.goto(picturePath);
		expect(await response.headerValue('content-security-policy')).toContain('default-src \'none\'');
		await page.waitForLoadState('networkidle');

		const hero = page.locator('figure img');
		await expect(hero).toBeVisible();
		await expect(hero).toHaveAttribute('fetchpriority', 'high');
		await expect(hero).toHaveAttribute('width', /\d+/v);
		await expect(hero).toHaveAttribute('height', /\d+/v);
		expect(await hero.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
		expect(new URL(await hero.evaluate(image => image.currentSrc)).origin).toBe(new URL(page.url()).origin);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/picture\/[^\/]+\/$/v);

		expect(violations).toEqual([]);
		expect(errors).toEqual([]);
	});

	test('the violation check is live: an injected inline script is reported', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		await page.goto(picturePath);
		await page.evaluate(() => {
			const script = document.createElement('script');
			script.textContent = 'globalThis.injected = true';
			document.head.append(script);
		});
		await expect.poll(() => violations.length).toBeGreaterThan(0);
	});

	test('theme toggle flips data-theme and persists across reload', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		await page.emulateMedia({colorScheme: 'light'});
		await page.goto(picturePath);

		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-theme', 'light');
		await page.locator('[data-theme-switcher]').click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await page.reload();
		await expect(html).toHaveAttribute('data-theme', 'dark');

		expect(violations).toEqual([]);
	});

	test('language toggle switches visible text and persists', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		await page.goto(picturePath);

		const html = page.locator('html');
		const menu = page.locator('nav button');
		await expect(html).toHaveAttribute('lang', 'en');
		await expect(menu).toHaveText(/^menu$/iv, {useInnerText: true});
		await page.locator('[data-language-switcher]').click();
		await expect(html).toHaveAttribute('lang', 'de');
		await expect(menu).toHaveText(/^menü$/iv, {useInnerText: true});
		await page.reload();
		await expect(html).toHaveAttribute('lang', 'de');

		expect(violations).toEqual([]);
	});

	test('navigation menu opens from the button and by keyboard focus', async ({page}) => {
		await page.goto(picturePath);
		const button = page.locator('nav button');
		const firstLink = page.locator('nav a').first();
		await expect(button).toHaveAttribute('aria-expanded', 'false');
		await expect(firstLink).toBeHidden();
		await button.click();
		await expect(button).toHaveAttribute('aria-expanded', 'true');
		await expect(firstLink).toBeVisible();
		await button.click();
		await expect(firstLink).toBeHidden();

		await page.reload();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(firstLink).toBeVisible();
	});

	test('fullscreen toggle is wired', async ({page}) => {
		await page.goto(picturePath);
		const toggle = page.locator('[data-fullscreen-toggle]');
		await expect(toggle).toHaveAttribute('aria-pressed', 'false');
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('html')).toHaveAttribute('data-fullscreen', '');
	});
});
