import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {initLanguageSwitcher} from '../switcher.js';

const runInit = ({stored = null, language = 'en-US', throws = false} = {}) => {
	const documentElement = {lang: 'en'};
	const localStorage = {
		getItem() {
			if (throws) {
				throw new Error('blocked');
			}

			return stored;
		},
	};
	vm.runInNewContext(readFileSync(new URL('../../public/lang-init.js', import.meta.url), 'utf8'), {document: {documentElement}, localStorage, navigator: {language}});
	return documentElement.lang;
};

describe('lang-init.js', () => {
	test('detects German browsers', () => expect(runInit({language: 'de-DE'})).toBe('de'));
	test('falls back to English for other browsers', () => expect(runInit({language: 'fr-FR'})).toBe('en'));
	test('stored choice wins over the browser', () => expect(runInit({stored: 'en', language: 'de'})).toBe('en'));
	test('ignores invalid stored values', () => expect(runInit({stored: 'xx', language: 'de'})).toBe('de'));
	test('keeps default when storage throws', () => expect(runInit({throws: true, language: 'de'})).toBe('en'));
});

describe('initLanguageSwitcher', () => {
	const setup = (lang = 'en') => {
		let click;
		const button = {
			title: '', dataset: {titleEn: 'Switch to German', titleDe: 'Wechseln zu Englisch'}, addEventListener(_event, callback) {
				click = callback;
			},
		};
		const root = {documentElement: {lang}, querySelectorAll: () => [button]};
		return {root, button, click: () => click()};
	};

	test('sets the initial title and toggles language, title and storage', () => {
		const {root, button, click} = setup();
		const storage = {setItem: vi.fn()};
		initLanguageSwitcher(root, storage);
		expect(button.title).toBe('Switch to German');
		click();
		expect(root.documentElement.lang).toBe('de');
		expect(button.title).toBe('Wechseln zu Englisch');
		expect(storage.setItem).toHaveBeenCalledWith('userLanguage', 'de');
		click();
		expect(root.documentElement.lang).toBe('en');
	});

	test('treats an unsupported html language as the default one', () => {
		const {root, button} = setup('fr');
		initLanguageSwitcher(root, {setItem: vi.fn()});
		expect(button.title).toBe('Switch to German');
	});

	test('keeps the existing title when the button has none for the language', () => {
		const {root, button} = setup('de');
		button.title = 'Preset';
		delete button.dataset.titleDe;
		initLanguageSwitcher(root, {setItem: vi.fn()});
		expect(button.title).toBe('Preset');
	});

	test('survives blocked storage', () => {
		const {root, click} = setup();
		initLanguageSwitcher(root, {
			setItem() {
				throw new Error('blocked');
			},
		});
		click();
		expect(root.documentElement.lang).toBe('de');
	});
});
