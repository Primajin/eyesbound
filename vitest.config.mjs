import {getViteConfig} from 'astro/config';

export default getViteConfig({
	test: {
		include: ['{site,scripts}/**/*.test.js'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['site/**/*.{js,jsx,astro}'],
			exclude: ['site/**/__tests__/**', 'site/public/**'],
		},
	},
});
