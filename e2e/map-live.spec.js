/* global document */
import {expect, test} from '@playwright/test';

import {policyFor} from './helpers.js';

const liveUrl = process.env.MAP_LIVE_URL;
const noEval = policy => policy.replace(' \'unsafe-eval\'', '');
const withoutBlobFetch = policy => policy.replace('data: blob:', 'data:').replace('connect-src \'self\' blob:', 'connect-src \'self\'');

test.skip(!liveUrl, 'Set MAP_LIVE_URL to a deployed origin whose referrer the Maps key allows');
test.use({baseURL: liveUrl, launchOptions: {args: ['--use-angle=gl', '--use-gl=angle', '--ignore-gpu-blocklist']}});

const watch = async (page, {reportOnly} = {}) => {
	const violations = [];
	const problems = [];
	await page.exposeFunction('reportViolation', description => {
		violations.push(description);
	});
	await page.addInitScript(() => {
		document.addEventListener('securitypolicyviolation', event => {
			globalThis.reportViolation(`${event.disposition} ${event.violatedDirective} ${event.blockedURI}`);
		});
	});
	page.on('console', message => {
		if (message.type() === 'error' && !/Vector Map/v.test(message.text())) {
			problems.push(message.text().replaceAll(/key=[^\s"&]+/gv, 'key=REDACTED'));
		}
	});
	if (reportOnly) {
		await page.route('**/*', async route => {
			if (route.request().resourceType() !== 'document') {
				return route.continue();
			}

			const response = await route.fetch();
			const {'content-security-policy': enforced, ...headers} = response.headers();
			headers['content-security-policy-report-only'] = reportOnly(enforced);
			return route.fulfill({response, headers});
		});
	}

	return {violations, problems};
};

const expectRendered = async (page, selector = '[data-map]') => {
	const map = page.locator(selector);
	await map.scrollIntoViewIfNeeded();
	await expect(map).toHaveAttribute('data-map-ready', '', {timeout: 30_000});
	await expect(map).not.toHaveAttribute('data-map-error', '');
	await expect(map.locator('.gm-style').first()).toBeVisible();
	await expect(map.locator('.gm-err-container')).toHaveCount(0);
};

test.describe('real Google Maps under the delivered map policy', () => {
	test('worldmap renders, opens an info window and switches theme without violations', async ({page}) => {
		const {violations, problems} = await watch(page);
		const response = await page.goto('/worldmap/');
		const delivered = response.headers()['content-security-policy'];
		expect(delivered).toBe(policyFor('/worldmap/*'));
		const headers = await response.headersArray();
		expect(headers.filter(({name}) => name.toLowerCase() === 'content-security-policy')).toHaveLength(1);

		await expectRendered(page);
		await page.locator('gmp-advanced-marker').first().click({force: true});
		await expect(page.locator('.gm-style-iw a')).toHaveAttribute('href', /^\/picture\/[^\/]+\/$/v);
		await page.locator('[data-theme-switcher]').click();
		await expect(page.locator('.map-layer')).toHaveCount(2);
		await expect(page.locator('.map-layer:not([hidden]) .gm-style')).toBeVisible();

		expect(problems).toEqual([]);
		expect(violations).toEqual([]);
	});

	test('picture page map renders without violations', async ({page}) => {
		const {violations, problems} = await watch(page);
		await page.goto(process.env.MAP_LIVE_PICTURE ?? '/picture/exoplanet/');
		await expectRendered(page);
		expect(problems).toEqual([]);
		expect(violations).toEqual([]);
	});
});

test.describe('tightened probe policies (report-only, so the map still runs)', () => {
	test('without unsafe-eval', async ({page}) => {
		const {violations, problems} = await watch(page, {reportOnly: noEval});
		await page.goto('/worldmap/');
		await expectRendered(page);
		expect(problems).toEqual([]);
		expect(violations).toEqual([]);
	});

	test('without unsafe-eval and without blob: in img-src and connect-src', async ({page}) => {
		const {violations, problems} = await watch(page, {reportOnly: policy => withoutBlobFetch(noEval(policy))});
		await page.goto('/worldmap/');
		await expectRendered(page);
		expect(problems).toEqual([]);
		expect(violations).toEqual([]);
	});
});
