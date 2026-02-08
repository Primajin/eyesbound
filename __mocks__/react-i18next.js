// Mock i18next for tests
module.exports = {
	useTranslation: () => ({
		t: key => key,
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
