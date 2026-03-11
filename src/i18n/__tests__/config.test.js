import {getBrowserLanguage} from '../config.js';

describe('getBrowserLanguage', () => {
	const originalNavigator = globalThis.navigator;

	afterEach(() => {
		Object.defineProperty(globalThis, 'navigator', {
			value: originalNavigator,
			writable: true,
			configurable: true,
		});
	});

	it('returns "en" when navigator is undefined (SSR)', () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: undefined,
			writable: true,
			configurable: true,
		});
		expect(getBrowserLanguage()).toBe('en');
	});

	it('returns "de" for German browser language', () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: {language: 'de-DE'},
			writable: true,
			configurable: true,
		});
		expect(getBrowserLanguage()).toBe('de');
	});

	it('returns "en" for English browser language', () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: {language: 'en-US'},
			writable: true,
			configurable: true,
		});
		expect(getBrowserLanguage()).toBe('en');
	});

	it('returns "en" for unsupported languages', () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: {language: 'fr-FR'},
			writable: true,
			configurable: true,
		});
		expect(getBrowserLanguage()).toBe('en');
	});
});
