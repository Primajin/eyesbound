import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';

const resources = {
	en: {
		translation: en,
	},
	de: {
		translation: de,
	},
};

// Detect browser language
const getBrowserLanguage = () => {
	if (typeof navigator === 'undefined') {
		return 'en'; // Default for SSR
	}

	const browserLang = navigator.language || navigator.userLanguage;
	// Extract the language code (e.g., 'en' from 'en-US')
	const langCode = browserLang?.split('-')[0];

	// Check if we support this language
	return langCode === 'de' ? 'de' : 'en';
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: getBrowserLanguage(),
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // React already escapes
		},
	});

export {default} from 'i18next';
