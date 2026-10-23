/* global document, getComputedStyle, requestAnimationFrame */
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

	const interactions = {
		'mouse press': page => page.mouse.move(300, 300).then(() => page.mouse.down()),
		'mouse wheel': page => page.mouse.move(300, 300).then(() => page.mouse.wheel(0, 100)),
		'key press': page => page.keyboard.press('Tab'),
		'focus of an arrow': page => page.locator('[data-slide="next"]').focus(),
		'focus of a thumbnail': page => page.locator('[data-slide-to="3"]').focus(),
		async 'touch swipe'(page) {
			const client = await page.context().newCDPSession(page);
			await client.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 600, y: 300}]});
			await client.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 300, y: 300}]});
			await client.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
		},
	};

	for (const [name, interact] of Object.entries(interactions)) {
		test(`autoplay stops for good after ${name}`, async ({browser}) => {
			const context = await browser.newContext({hasTouch: true, reducedMotion: 'no-preference', viewport: {width: 1000, height: 700}});
			const page = await context.newPage();
			await page.goto('/');
			await interact(page);
			await page.mouse.move(900, 100);
			await page.waitForTimeout(6500);
			await expect(current(page)).toHaveAttribute('data-slide-to', name === 'touch swipe' ? '1' : '0');
			await context.close();
		});
	}

	test('hovering alone does not pause autoplay', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		await page.mouse.move(300, 300);
		await expect(current(page)).toHaveAttribute('data-slide-to', '1', {timeout: 8000});
	});

	test('autoplay cross-fades without ever showing a blank frame between slides or shifting layout', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		const samples = await page.evaluate(async () => {
			const link = document.querySelectorAll('.slide a');
			const scroller = document.querySelector('[data-slides]');
			const readings = [];
			const start = performance.now();
			await new Promise(resolve => {
				const tick = () => {
					readings.push({
						at: performance.now() - start,
						opacities: [...link].map(element => Number(getComputedStyle(element).opacity)),
						left: scroller.scrollLeft,
						height: scroller.getBoundingClientRect().height,
					});
					if (performance.now() - start > 7000) {
						resolve();
					} else {
						requestAnimationFrame(tick);
					}
				};

				tick();
			});
			return readings;
		});
		const heights = new Set(samples.map(sample => sample.height));
		expect(heights.size).toBe(1);
		const mid = samples.filter(sample => sample.opacities[0] > 0.05 && sample.opacities[0] < 0.95);
		expect(mid.length).toBeGreaterThan(10);
		const lefts = new Set(samples.map(sample => sample.left));
		expect(lefts.size).toBe(2);
		const jump = samples.findIndex((sample, index) => index > 0 && sample.left !== samples[index - 1].left);
		expect(samples[jump].opacities[0]).toBeLessThan(0.05);
	});

	test('does not advance by itself with reduced motion', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'reduce'});
		await page.goto('/');
		await page.waitForTimeout(6500);
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
	});
});
