import de from './locales/de.json';
import en from './locales/en.json';

export const languages = ['en', 'de'];
export const defaultLanguage = 'en';
export const storageKey = 'userLanguage';

const dictionaries = {en, de};

const lookup = (dictionary, key) => {
	let value = dictionary;
	for (const part of key.split('.')) {
		value = value !== null && typeof value === 'object' ? value[part] : undefined;
	}

	return value;
};

const resolve = (dictionary, key) => {
	const value = lookup(dictionary, key);
	return typeof value === 'string' ? value : undefined;
};

/**
 Translates a key. Throws on unknown language, missing key or missing interpolation value, so raw keys never reach the HTML.
 @param {string} key - Dot separated key, e.g. `navigation.menu`.
 @param {string} lang - One of `languages`.
 @param {Record<string, string>} [parameters] - Values for `{{name}}` placeholders.
 @returns {string} The translated text.
 */
export const t = (key, lang, parameters = {}) => {
	const dictionary = dictionaries[lang];
	if (!dictionary) {
		throw new Error(`Unsupported language "${lang}"`);
	}

	const template = resolve(dictionary, key);
	if (template === undefined) {
		throw new Error(`Missing translation "${key}" for language "${lang}"`);
	}

	return template.replaceAll(/\{\{\s*(?<name>\w+)\s*\}\}/gv, (_match, name) => {
		if (!Object.hasOwn(parameters, name)) {
			throw new Error(`Missing parameter "${name}" for translation "${key}"`);
		}

		return String(parameters[name]);
	});
};

/**
 Counts the entries of a list translation (a JSON array) so templates can render every item. Throws when the key is not a list or the languages disagree on its length.
 @param {string} key - Dot separated key of an array, e.g. `privacy.s5.b.list`.
 @returns {number} The number of items.
 */
export const tCount = key => {
	const lengths = languages.map(lang => {
		const value = lookup(dictionaries[lang], key);
		return Array.isArray(value) ? value.length : -1;
	});
	if (lengths[0] < 1 || new Set(lengths).size !== 1) {
		throw new Error(`"${key}" is not a list with the same length in every language`);
	}

	return lengths[0];
};

/**
 Attributes for an element whose `title` follows the language switcher without duplicating DOM: the English title, plus both titles as data attributes that `initLanguageSwitcher` applies.
 @param {string} key - Dot separated key of the title text.
 @returns {{title: string, 'data-title-en': string, 'data-title-de': string}} Attributes to spread onto the element.
 */
export const localizedTitle = key => ({title: t(key, 'en'), 'data-title-en': t(key, 'en'), 'data-title-de': t(key, 'de')});
