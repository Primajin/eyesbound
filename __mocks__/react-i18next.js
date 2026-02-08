// Mock i18next for tests
const translations = {
	navigation: {
		menu: 'Menu',
		overview: 'Overview',
		contact: 'Contact',
		worldmap: 'Worldmap',
	},
	picture: {
		category: 'Category',
		series: 'Series',
		tags: 'Tags',
		captured: 'Captured',
		location: 'Location',
	},
	imprint: {
		pageTitle: 'Contact & Imprint',
		metaTitle: 'Imprint & Contact',
		design: 'Design:',
		privacyPolicy: 'Privacy Policy',
	},
	language: {
		switchTo: 'Switch to {{language}}',
		english: 'English',
		german: 'German',
	},
};

const translate = key => {
	const keys = key.split('.');
	let value = translations;

	for (const k of keys) {
		value = value?.[k];
		if (value === undefined) {
			return key; // Fallback to key if translation not found
		}
	}

	return value;
};

module.exports = {
	useTranslation: () => ({
		t: translate,
		i18n: {
			language: 'en',
			changeLanguage: jest.fn(),
		},
	}),
	initReactI18next: {
		type: '3rdParty',
		init: jest.fn(),
	},
};
