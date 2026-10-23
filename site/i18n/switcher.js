import {defaultLanguage, languages, storageKey} from './index.js';

/**
 Wires every language switcher button inside `root`: toggles `<html lang>`, updates every `[data-title-en][data-title-de]` title and persists the choice.
 Initial detection happens earlier in public/lang-init.js to avoid a flash of the wrong language.
 @param {Document} root - Document containing the buttons.
 @param {Storage} [storage] - Storage used for persistence.
 */
export const initLanguageSwitcher = (root, storage = localStorage) => {
	const html = root.documentElement;
	const buttons = root.querySelectorAll('[data-language-switcher]');
	const titled = root.querySelectorAll('[data-title-en][data-title-de]');

	const sync = () => {
		const lang = languages.includes(html.lang) ? html.lang : defaultLanguage;
		for (const element of titled) {
			const title = element.dataset[lang === 'de' ? 'titleDe' : 'titleEn'];
			if (title) {
				element.title = title;
			}
		}
	};

	for (const button of buttons) {
		button.addEventListener('click', () => {
			const next = html.lang === 'en' ? 'de' : 'en';
			html.lang = next;
			try {
				storage.setItem(storageKey, next);
			} catch {
				// Storage blocked: the choice only lasts for this page view
			}

			sync();
		});
	}

	sync();
};
