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

	test('advances by itself without reduced motion within the interval', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
		await expect(current(page)).toHaveAttribute('data-slide-to', '1', {timeout: 8000});
	});

	const stoppers = {
		async 'a horizontal swipe on the slideshow'(page) {
			const client = await page.context().newCDPSession(page);
			await client.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 600, y: 300}]});
			await client.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: 300, y: 300}]});
			await client.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
		},
		'a horizontal wheel on the slideshow': page => page.mouse.move(300, 300).then(() => page.mouse.wheel(120, 0)),
		'a click on an arrow': page => page.locator('[data-slide="next"]').click(),
		'a click on a thumbnail': page => page.locator('[data-slide-to="3"]').click(),
		async 'the keyboard on the slideshow'(page) {
			await page.locator('[data-slides]').focus();
			await page.keyboard.press('ArrowRight');
		},
		async 'the keyboard on an arrow'(page) {
			await page.locator('[data-slide="previous"]').focus();
			await page.keyboard.press('ArrowLeft');
		},
	};

	for (const [name, interact] of Object.entries(stoppers)) {
		test(`autoplay stops for good after ${name}`, async ({browser}) => {
			const context = await browser.newContext({hasTouch: true, reducedMotion: 'no-preference', viewport: {width: 1000, height: 700}});
			const page = await context.newPage();
			await page.goto('/');
			await interact(page);
			await page.mouse.move(900, 100);
			await page.waitForTimeout(2000);
			const settled = await current(page).getAttribute('data-slide-to');
			await page.waitForTimeout(6500);
			await expect(current(page)).toHaveAttribute('data-slide-to', settled);
			await context.close();
		});
	}

	const bystanders = {
		'hovering the slideshow': page => page.mouse.move(300, 300),
		'clicking the theme switch': page => page.locator('[data-theme-switcher]').click(),
		async 'pressing a key in the header'(page) {
			await page.locator('[data-theme-switcher]').focus();
			await page.keyboard.press('Tab');
		},
		'scrolling the page': page => page.mouse.move(300, 300).then(() => page.mouse.wheel(0, 200)),
	};

	for (const [name, interact] of Object.entries(bystanders)) {
		test(`autoplay keeps running after ${name}`, async ({page}) => {
			await page.emulateMedia({reducedMotion: 'no-preference'});
			await page.goto('/');
			await interact(page);
			await expect(current(page)).toHaveAttribute('data-slide-to', '1', {timeout: 8000});
		});
	}

	const watchFade = (page, duration) => page.evaluate(async ms => {
		const layer = document.querySelector('[data-fade]');
		const scroller = document.querySelector('[data-slides]');
		const readings = [];
		const start = performance.now();
		await new Promise(resolve => {
			const tick = () => {
				readings.push({
					opacity: Number(getComputedStyle(layer).opacity),
					shown: layer.dataset.state !== undefined,
					left: scroller.scrollLeft,
					height: scroller.getBoundingClientRect().height,
					slideOpacities: [...document.querySelectorAll('.slide a')].map(element => Number(getComputedStyle(element).opacity)),
				});
				if (performance.now() - start > ms) {
					resolve();
				} else {
					requestAnimationFrame(tick);
				}
			};

			tick();
		});
		return readings;
	}, duration);

	const expectCrossFade = (samples, {from, to}) => {
		const fading = samples.filter(sample => sample.shown);
		expect(fading.length).toBeGreaterThan(20);
		const opacities = fading.map(sample => sample.opacity);
		expect(opacities.slice(1).every((opacity, index) => opacity >= opacities[index])).toBe(true);
		expect(fading.filter(sample => sample.opacity > 0.05 && sample.opacity < 0.95).length).toBeGreaterThan(10);
		expect(new Set(fading.filter(entry => entry.opacity < 0.95).map(entry => entry.left))).toEqual(new Set([from]));

		expect(samples.at(-1).left).toBe(to);
		expect(new Set(samples.map(sample => sample.left)).size).toBe(2);
		expect(new Set(samples.map(sample => sample.height)).size).toBe(1);
		expect(samples.every(sample => sample.slideOpacities.every(opacity => opacity === 1))).toBe(true);
	};

	test('autoplay cross-fades the next image over the current one without ever scrolling through other slides or shifting layout', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		const width = await page.locator('[data-slides]').evaluate(element => element.clientWidth);
		expectCrossFade(await watchFade(page, 7000), {from: 0, to: width});
	});

	test('the last slide cross-fades back to the first', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'no-preference'});
		await page.goto('/');
		const total = await page.locator('[data-slide-to]').count();
		await page.locator(`[data-slide-to="${total - 1}"]`).click();
		await expect(current(page)).toHaveAttribute('data-slide-to', String(total - 1));
		await page.waitForTimeout(1500);
		const last = await page.locator('[data-slides]').evaluate(element => element.scrollLeft);
		const watching = watchFade(page, 2000);
		await page.locator('[data-slide="next"]').click();
		expectCrossFade(await watching, {from: last, to: 0});
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
	});

	test('does not advance by itself with reduced motion', async ({page}) => {
		await page.emulateMedia({reducedMotion: 'reduce'});
		await page.goto('/');
		await page.waitForTimeout(6500);
		await expect(current(page)).toHaveAttribute('data-slide-to', '0');
	});
});
