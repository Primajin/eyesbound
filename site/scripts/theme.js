/**
 Same key and JSON-boolean format as src/hooks/use-theme-preference.js, so existing users keep their choice.
 */
export const STORAGE_KEY = 'userPrefersDark';

export const THEME_COLORS = {dark: '#000000', light: '#ffffff'};

/**
 Reads the stored preference.
 @param {Pick<Storage, 'getItem'>} [storage] Storage to read from
 @returns {boolean | null} The stored preference, or null when absent, invalid or storage is unavailable
 */
export function readStoredPreference(storage) {
	try {
		const raw = storage?.getItem(STORAGE_KEY);
		if (raw === null || raw === undefined) {
			return null;
		}

		const parsed = JSON.parse(raw);
		return typeof parsed === 'boolean' ? parsed : null;
	} catch {
		return null;
	}
}

/**
 Persists the preference; fails silently like the Gatsby hook.
 @param {Pick<Storage, 'setItem'>} [storage] Storage to write to
 @param {boolean} isDark True to persist dark, false to persist light
 @returns {boolean} Whether it was persisted
 */
export function storePreference(storage, isDark) {
	try {
		storage.setItem(STORAGE_KEY, JSON.stringify(isDark));
		return true;
	} catch {
		return false;
	}
}

/**
 Stored preference wins, otherwise the OS setting.
 @param {Pick<Storage, 'getItem'>} [storage] Storage to read from
 @param {boolean} systemPrefersDark OS preference
 @returns {boolean} Whether dark is active
 */
export function resolveIsDark(storage, systemPrefersDark) {
	return readStoredPreference(storage) ?? Boolean(systemPrefersDark);
}

/**
 Applies the theme to the document (data-theme + theme-color meta).
 @param {Document} doc Document
 @param {boolean} isDark True for the dark theme, false for light
 @returns {void}
 */
export function applyTheme(doc, isDark) {
	const theme = isDark ? 'dark' : 'light';
	doc.documentElement.dataset.theme = theme;

	let meta = doc.querySelector('meta[name="theme-color"]');
	if (!meta) {
		meta = doc.createElement('meta');
		meta.name = 'theme-color';
		doc.head.append(meta);
	}

	meta.content = THEME_COLORS[theme];
}

/**
 Wires up the switcher buttons, OS changes and cross-tab sync.
 @param {Window} win Window
 @returns {void}
 */
export function initThemeSwitcher(win) {
	const doc = win.document;
	const media = win.matchMedia?.('(prefers-color-scheme: dark)');
	let storage;
	try {
		storage = win.localStorage;
	} catch {
		// Storage blocked: theme still works for the session
	}

	let isDark = resolveIsDark(storage, media?.matches);
	applyTheme(doc, isDark);

	for (const button of doc.querySelectorAll('[data-theme-switcher]')) {
		button.addEventListener('click', () => {
			isDark = !isDark;
			storePreference(storage, isDark);
			applyTheme(doc, isDark);
		});
	}

	media?.addEventListener('change', event => {
		if (readStoredPreference(storage) !== null) {
			return;
		}

		isDark = event.matches;
		applyTheme(doc, isDark);
	});

	win.addEventListener('storage', event => {
		if (event.key !== STORAGE_KEY) {
			return;
		}

		isDark = resolveIsDark(storage, media?.matches);
		applyTheme(doc, isDark);
	});
}
