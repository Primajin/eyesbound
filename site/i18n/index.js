import de from './locales/de.json';
import en from './locales/en.json';

export const languages = ['en', 'de'];
export const defaultLanguage = 'en';
export const storageKey = 'userLanguage';

const dictionaries = {en, de};

const resolve = (dictionary, key) => {
	let value = dictionary;
	for (const part of key.split('.')) {
		value = value !== null && typeof value === 'object' ? value[part] : undefined;
	}

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
