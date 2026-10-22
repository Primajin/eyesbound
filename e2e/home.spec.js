/* global document */
import {expect, test} from '@playwright/test';

import {enforceStrictCsp} from './helpers.js';

const current = page => page.locator('[data-slide-to][aria-current="true"]');

test.describe('home slideshow', () => {
	test('renders an eager high-priority hero, lazy remaining slides and no CSP violations', async ({page}) => {
		const violations = await enforceStrictCsp(page);
		const errors = [];
		page.on('pageerror', error => {
			errors.push(error.message);
		});
		await page.goto('/');

		const images = page.locator('.slide img');
		const count = await images.count();
		expect(count).toBeGreaterThan(1);
		await expect(images.first()).toHaveAttribute('fetchpriority', 'high');
		await expect(images.first()).toHaveAttribute('loading', 'eager');
		await expect(images.first()).toHaveAttribute('width', /\d+/v);
		expect(await images.evaluateAll(elements => elements.slice(1).map(element => element.loading))).toEqual(Array.from({length: count - 1}, () => 'lazy'));

		await expect(page.locator('[data-slide-to]')).toHaveCount(count);
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
		expect(violations).toEqual([]);
		expect(errors).toEqual([]);
	});

	test('arrow buttons and indicators move between slides and wrap around', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'reduce'});
		await page.goto('/');
		const total = await page.locator('[data-slide-to]').count();

		await page.locator('[data-slide="next"]').click();
		await expect(current(page)).toHaveAttribute('data-slide-to', '1');
		await page.locator('[data-slide="previous"]').click();
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
		await page.locator('[data-slide="previous"]').click();
		await expect(current(page)).toHaveAttribute('data-slide-to', String(total - 1));
		await page.locator('[data-slide-to="1"]').click();
		await expect(current(page)).toHaveAttribute('data-slide-to', '1');
	});

	test('is usable from the keyboard', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'reduce'});
		await page.goto('/');
		await page.locator('[data-slides]').focus();
		await page.keyboard.press('ArrowRight');
		await expect(current(page)).toHaveAttribute('data-slide-to', '1');

		await page.locator('[data-slide="next"]').focus();
		await page.keyboard.press('Enter');
		await expect(current(page)).toHaveAttribute('data-slide-to', '2');
		await page.locator('[data-slide-to="0"]').focus();
		await page.keyboard.press('Space');
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
	});

	test('advances by itself without reduced motion, and stops after the user takes over', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		await expect(current(page)).toHaveAttribute('data-slide-to', '1', {timeout: 8000});

		await page.locator('[data-slide="next"]').click();
		await expect(current(page)).toHaveAttribute('data-slide-to', '2');
		await page.mouse.move(0, 0);
		await page.waitForTimeout(6500);
		await expect(current(page)).toHaveAttribute('data-slide-to', '2');
	});

	test('does not advance by itself with reduced motion', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'reduce'});
		await page.goto('/');
		await page.waitForTimeout(6500);
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
	});
});
