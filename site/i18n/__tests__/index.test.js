import {describe, expect, test} from 'vitest';

import de from '../locales/de.json';
import en from '../locales/en.json';
import {localizedTitle, t, tCount} from '../index.js';

const flatten = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => (
	typeof value === 'object' && value !== null ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`]
));

describe('locale parity', () => {
	test('en and de define identical keys', () => {
		expect(flatten(de).toSorted((a, b) => a.localeCompare(b))).toEqual(flatten(en).toSorted((a, b) => a.localeCompare(b)));
	});

	test('every key resolves to a non-empty string in both languages', () => {
		for (const key of flatten(en)) {
			for (const lang of ['en', 'de']) {
				expect(t(key, lang, {language: 'x', siteName: 'x'}).length).toBeGreaterThan(0);
			}
		}
	});

	test('placeholders match between languages', () => {
		const placeholders = text => text.matchAll(/\{\{\s*(?<name>\w+)\s*\}\}/gv).map(match => match.groups.name).toArray().toSorted((a, b) => a.localeCompare(b));
		for (const key of flatten(en)) {
			expect(placeholders(t(key, 'de', {language: 'x', siteName: 'x'}))).toEqual(placeholders(t(key, 'en', {language: 'x', siteName: 'x'})));
		}
	});
});

describe('German translations', () => {
	test('no German text is just the English text, except proper names and shared terms', () => {
		const untranslated = flatten(en).filter(key => t(key, 'de', {language: 'x', siteName: 'x'}) === t(key, 'en', {language: 'x', siteName: 'x'}) && !key.endsWith('Url'));
		expect(untranslated.toSorted((a, b) => a.localeCompare(b))).toEqual(['imprint.address.website', 'imprint.design', 'privacy.maps.heading', 'privacy.s1.terms.e.title']);
	});

	test('lists have the same length in both languages', () => {
		expect(tCount('privacy.s5.b.list')).toBe(8);
		expect(tCount('privacy.s5.d.list')).toBe(6);
		expect(tCount('privacy.s5.e.list')).toBe(4);
	});
});

describe('tCount', () => {
	test('throws for text that is not a list', () => {
		expect(() => tCount('privacy.s5.b.title')).toThrow('is not a list');
		expect(() => tCount('privacy.nope')).toThrow('is not a list');
	});
});

describe('localizedTitle', () => {
	test('returns the English title and both languages as data attributes', () => {
		expect(localizedTitle('imprint.license.nc')).toEqual({
			title: t('imprint.license.nc', 'en'),
			'data-title-en': t('imprint.license.nc', 'en'),
			'data-title-de': t('imprint.license.nc', 'de'),
		});
	});
});

describe('t', () => {
	test('translates per language', () => {
		expect(t('navigation.menu', 'en')).toBe(en.navigation.menu);
		expect(t('navigation.menu', 'de')).toBe(de.navigation.menu);
	});

	test('interpolates parameters', () => {
		expect(t('language.switchTo', 'en', {language: 'German'})).toBe('Switch to German');
	});

	test('throws on missing key, non-leaf key, unknown language and missing parameter', () => {
		expect(() => t('navigation.nope', 'en')).toThrow('Missing translation');
		expect(() => t('navigation', 'en')).toThrow('Missing translation');
		expect(() => t('navigation.menu', 'fr')).toThrow('Unsupported language');
		expect(() => t('language.switchTo', 'en')).toThrow('Missing parameter');
	});
});
