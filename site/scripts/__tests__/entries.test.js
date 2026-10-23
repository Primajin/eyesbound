// @vitest-environment jsdom
/* global document */
import {
	afterEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {initMaps} from '../map.js';
import {initConsentRevoke} from '../map-consent.js';
import {initSlideshows} from '../slideshow.js';
import {initThemeSwitcher} from '../theme.js';

vi.mock('../map.js', () => ({initMaps: vi.fn()}));
vi.mock('../map-consent.js', () => ({initConsentRevoke: vi.fn()}));
vi.mock('../slideshow.js', () => ({initSlideshows: vi.fn()}));
vi.mock('../theme.js', () => ({initThemeSwitcher: vi.fn()}));

afterEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
});

describe('bundled entry modules start their feature on import', () => {
	test.each([
		['map-init.js', initMaps, () => document],
		['consent-init.js', initConsentRevoke, () => document],
		['slideshow-init.js', initSlideshows, () => document],
		['theme-switcher.js', initThemeSwitcher, () => globalThis],
	])('%s', async (file, init, expectedRoot) => {
		expect(init).not.toHaveBeenCalled();
		await import(`../${file}`);
		expect(init).toHaveBeenCalledTimes(1);
		expect(init).toHaveBeenCalledWith(expectedRoot());
	});
});
