module.exports = {
	transform: {
		'^.+\\.jsx?$': '<rootDir>/jest-preprocess.js',
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/file-mock.js',
	},
	testPathIgnorePatterns: ['node_modules', String.raw`\.cache`, '<rootDir>.*/public'],
	transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
	globals: {
		__PATH_PREFIX__: '',
	},
	testEnvironment: 'jest-environment-jsdom',
	testEnvironmentOptions: {
		url: 'http://localhost',
	},
	setupFiles: ['<rootDir>/loadershim.js', '<rootDir>/jest-mocks.js'],
	watchPathIgnorePatterns: ['node_modules', String.raw`\.cache`, '<rootDir>.*/public'],
};
