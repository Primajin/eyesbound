// @vitest-environment jsdom
/* global document */
import {
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {initFullscreen, toggleFullscreen} from '../fullscreen.js';

const setup = () => {
	document.body.innerHTML = '<figure data-fullscreen-target></figure><button data-fullscreen-toggle="[data-fullscreen-target]" aria-pressed="false"></button>';
	delete document.documentElement.dataset.fullscreen;
	Object.defineProperty(document, 'fullscreenElement', {value: null, configurable: true, writable: true});
	document.exitFullscreen = vi.fn(async () => {});
	return document.querySelector('figure');
};

describe('fullscreen', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	test('requests fullscreen on the target element', async () => {
		const figure = setup();
		figure.requestFullscreen = vi.fn(async () => {});
		await toggleFullscreen(document, '[data-fullscreen-target]');
		expect(figure.requestFullscreen).toHaveBeenCalledTimes(1);
	});

	test('falls back to the document element when the target is missing', async () => {
		setup();
		document.documentElement.requestFullscreen = vi.fn(async () => {});
		await toggleFullscreen(document, '.missing');
		expect(document.documentElement.requestFullscreen).toHaveBeenCalledTimes(1);
	});

	test('exits when already fullscreen', async () => {
		setup();
		document.fullscreenElement = document.body;
		await toggleFullscreen(document, '[data-fullscreen-target]');
		expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
	});

	test('stays inert when the browser refuses', async () => {
		const figure = setup();
		figure.requestFullscreen = vi.fn(async () => {
			throw new Error('denied');
		});
		await expect(toggleFullscreen(document, '[data-fullscreen-target]')).resolves.toBeUndefined();
	});

	test('mirrors fullscreenchange as html attribute and aria-pressed', () => {
		const figure = setup();
		figure.requestFullscreen = vi.fn(async () => {});
		initFullscreen(document);
		const button = document.querySelector('button');
		button.click();
		expect(figure.requestFullscreen).toHaveBeenCalledTimes(1);

		document.fullscreenElement = figure;
		document.dispatchEvent(new Event('fullscreenchange'));
		expect(Object.hasOwn(document.documentElement.dataset, 'fullscreen')).toBe(true);
		expect(button.getAttribute('aria-pressed')).toBe('true');

		document.fullscreenElement = null;
		document.dispatchEvent(new Event('fullscreenchange'));
		expect(Object.hasOwn(document.documentElement.dataset, 'fullscreen')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');
	});
});
