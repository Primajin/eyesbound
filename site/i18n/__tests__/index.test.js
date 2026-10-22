import {describe, expect, test} from 'vitest';

import de from '../../../src/i18n/locales/de.json';
import en from '../../../src/i18n/locales/en.json';
import {t} from '../index.js';

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
				expect(t(key, lang, {language: 'x'}).length).toBeGreaterThan(0);
			}
		}
	});

	test('placeholders match between languages', () => {
		const placeholders = text => text.matchAll(/\{\{\s*(?<name>\w+)\s*\}\}/gv).map(match => match.groups.name).toArray().toSorted((a, b) => a.localeCompare(b));
		for (const key of flatten(en)) {
			expect(placeholders(t(key, 'de', {language: 'x', count: 1}))).toEqual(placeholders(t(key, 'en', {language: 'x', count: 1})));
		}
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
