import {describe, expect, test} from 'vitest';

import {buildCanonicalUrl, buildTitle} from '../seo.js';

describe('buildTitle', () => {
	test('appends the site name to a page title', () => {
		expect(buildTitle('Imprint', 'EYESBOUND')).toBe('Imprint | EYESBOUND');
	});

	test('falls back to the site name without a title', () => {
		expect(buildTitle('', 'EYESBOUND')).toBe('EYESBOUND');
		expect(buildTitle(undefined, 'EYESBOUND')).toBe('EYESBOUND');
	});
});

describe('buildCanonicalUrl', () => {
	test('keeps a trailing slash', () => {
		expect(buildCanonicalUrl('/picture/exoplanet/', 'https://eyesbound.com')).toBe('https://eyesbound.com/picture/exoplanet/');
	});

	test('adds a missing trailing slash', () => {
		expect(buildCanonicalUrl('/picture/exoplanet', 'https://eyesbound.com')).toBe('https://eyesbound.com/picture/exoplanet/');
	});
});
