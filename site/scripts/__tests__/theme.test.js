import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {describe, expect, test} from 'vitest';

import {
	applyTheme,
	initThemeSwitcher,
	readStoredPreference,
	resolveIsDark,
	storePreference,
	STORAGE_KEY,
} from '../theme.js';

const storageOf = (initial = {}) => {
	const data = new Map(Object.entries(initial));
	return {getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), data};
};

const makeDocument = () => {
	const metas = [];
	const buttons = [];
	return {
		documentElement: {
			dataset: {}, attrs: {}, setAttribute(k, v) {
				this.attrs[k] = v;
			},
		},
		head: {
			append(node) {
				metas.push(node);
			},
			appendChild(node) {
				metas.push(node);
			},
		},
		querySelector: () => metas[0] ?? null,
		createElement: () => ({}),
		querySelectorAll: () => buttons,
		metas,
		buttons,
	};
};

describe('stored preference', () => {
	test('parses JSON booleans only', () => {
		expect(readStoredPreference(storageOf({[STORAGE_KEY]: 'true'}))).toBe(true);
		expect(readStoredPreference(storageOf({[STORAGE_KEY]: 'false'}))).toBe(false);
		expect(readStoredPreference(storageOf({[STORAGE_KEY]: 'nope'}))).toBeNull();
		expect(readStoredPreference(storageOf({[STORAGE_KEY]: '"x"'}))).toBeNull();
		expect(readStoredPreference(storageOf())).toBeNull();
		expect(readStoredPreference(undefined)).toBeNull();
	});

	test('survives throwing storage', () => {
		const broken = {
			getItem() {
				throw new Error('blocked');
			}, setItem() {
				throw new Error('blocked');
			},
		};
		expect(readStoredPreference(broken)).toBeNull();
		expect(storePreference(broken, true)).toBe(false);
	});

	test('stores as JSON boolean', () => {
		const storage = storageOf();
		expect(storePreference(storage, true)).toBe(true);
		expect(storage.data.get(STORAGE_KEY)).toBe('true');
	});
});

describe('resolveIsDark', () => {
	test('storage beats system', () => {
		expect(resolveIsDark(storageOf({[STORAGE_KEY]: 'false'}), true)).toBe(false);
		expect(resolveIsDark(storageOf({[STORAGE_KEY]: 'true'}), false)).toBe(true);
	});

	test('falls back to system', () => {
		expect(resolveIsDark(storageOf(), true)).toBe(true);
		expect(resolveIsDark(storageOf(), undefined)).toBe(false);
	});
});

test('applyTheme sets data-theme and creates theme-color meta', () => {
	const doc = makeDocument();
	applyTheme(doc, true);
	expect(doc.documentElement.dataset.theme).toBe('dark');
	expect(doc.metas[0]).toMatchObject({name: 'theme-color', content: '#000000'});
	applyTheme(doc, false);
	expect(doc.documentElement.dataset.theme).toBe('light');
	expect(doc.metas).toHaveLength(1);
	expect(doc.metas[0].content).toBe('#ffffff');
});

describe('initThemeSwitcher', () => {
	const setup = ({stored, systemDark}) => {
		const doc = makeDocument();
		const click = [];
		doc.buttons.push({
			addEventListener(_, fn) {
				click.push(fn);
			},
		});
		const mediaListeners = [];
		const winListeners = {};
		const win = {
			document: doc,
			localStorage: storageOf(stored),
			matchMedia: () => ({
				matches: systemDark, addEventListener(_, fn) {
					mediaListeners.push(fn);
				},
			}),
			addEventListener(type, fn) {
				winListeners[type] = fn;
			},
		};
		initThemeSwitcher(win);
		return {
			doc, win, click: click[0], media: mediaListeners[0], winListeners,
		};
	};

	test('initial theme follows system, click toggles and persists', () => {
		const {doc, win, click} = setup({systemDark: true});
		expect(doc.documentElement.dataset.theme).toBe('dark');
		click();
		expect(doc.documentElement.dataset.theme).toBe('light');
		expect(win.localStorage.getItem(STORAGE_KEY)).toBe('false');
	});

	test('stored preference wins and blocks OS change updates', () => {
		const {doc, media} = setup({stored: {[STORAGE_KEY]: 'false'}, systemDark: true});
		expect(doc.documentElement.dataset.theme).toBe('light');
		media({matches: true});
		expect(doc.documentElement.dataset.theme).toBe('light');
	});

	test('OS change applies when nothing is stored', () => {
		const {doc, media} = setup({systemDark: false});
		media({matches: true});
		expect(doc.documentElement.dataset.theme).toBe('dark');
	});

	test('storage event syncs other tabs', () => {
		const {doc, win, winListeners} = setup({systemDark: false});
		win.localStorage.setItem(STORAGE_KEY, 'true');
		winListeners.storage({key: STORAGE_KEY});
		expect(doc.documentElement.dataset.theme).toBe('dark');
	});
});

describe('public/theme-init.js', () => {
	const source = readFileSync(new URL('../../public/theme-init.js', import.meta.url), 'utf8');
	const run = ({stored, systemDark, throwStorage = false}) => {
		const doc = makeDocument();
		const localStorage = throwStorage
			? {
				getItem() {
					throw new Error('blocked');
				},
			}
			: storageOf(stored);
		vm.runInNewContext(source, {
			document: doc,
			localStorage,
			window: {matchMedia: () => ({matches: systemDark})},
		});
		return doc;
	};

	test('uses system preference without storage', () => {
		expect(run({systemDark: true}).documentElement.attrs['data-theme']).toBe('dark');
		expect(run({systemDark: false}).documentElement.attrs['data-theme']).toBe('light');
	});

	test('stored preference wins', () => {
		const doc = run({stored: {[STORAGE_KEY]: 'false'}, systemDark: true});
		expect(doc.documentElement.attrs['data-theme']).toBe('light');
		expect(doc.metas[0].content).toBe('#ffffff');
	});

	test('falls back when storage throws', () => {
		expect(run({systemDark: true, throwStorage: true}).documentElement.attrs['data-theme']).toBe('dark');
	});

	test('does not use inline style', () => {
		expect(source).not.toContain('.style');
	});
});
