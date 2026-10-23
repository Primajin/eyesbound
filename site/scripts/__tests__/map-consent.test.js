// @vitest-environment jsdom
/* global document, window */
import {
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {
	consentKey,
	grantConsent,
	hasConsent,
	initConsentRevoke,
	revokeConsent,
} from '../map-consent.js';

beforeEach(() => {
	revokeConsent(window);
	window.localStorage.clear();
});

describe('consent storage', () => {
	test('is absent by default and only the exact granted value counts', () => {
		expect(hasConsent(window)).toBe(false);
		window.localStorage.setItem(consentKey, 'maybe');
		expect(hasConsent(window)).toBe(false);
	});

	test('grant is remembered in localStorage and revoke removes it', () => {
		grantConsent(window);
		expect(window.localStorage.getItem(consentKey)).toBe('granted');
		expect(hasConsent(window)).toBe(true);
		revokeConsent(window);
		expect(window.localStorage.getItem(consentKey)).toBeNull();
		expect(hasConsent(window)).toBe(false);
	});

	test('a stored grant is found by a later page view', () => {
		window.localStorage.setItem(consentKey, 'granted');
		expect(hasConsent(window)).toBe(true);
	});

	test('falls back to this page view when storage throws, and revoke does not throw', () => {
		const storage = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
			throw new Error('denied');
		});
		expect(hasConsent(window)).toBe(false);
		grantConsent(window);
		expect(hasConsent(window)).toBe(true);
		revokeConsent(window);
		expect(hasConsent(window)).toBe(false);
		storage.mockRestore();
	});
});

describe('initConsentRevoke', () => {
	test('withdraws the consent on click and reveals the confirmation in every language', () => {
		document.body.innerHTML = '<button data-map-consent-revoke>x</button><span data-map-consent-done hidden></span><span data-map-consent-done hidden></span>';
		initConsentRevoke(document);
		grantConsent(window);
		document.querySelector('button').click();
		expect(hasConsent(window)).toBe(false);
		expect([...document.querySelectorAll('[data-map-consent-done]')].map(message => message.hidden)).toEqual([false, false]);
	});

	test('works without a confirmation element', () => {
		document.body.innerHTML = '<button data-map-consent-revoke>x</button>';
		initConsentRevoke(document);
		grantConsent(window);
		document.querySelector('button').click();
		expect(hasConsent(window)).toBe(false);
	});
});
