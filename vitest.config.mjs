import {getViteConfig} from 'astro/config';

export default getViteConfig({
	test: {
		include: ['{site,scripts,worker}/**/*.test.js'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['site/**/*.{js,jsx,astro}', 'worker/**/*.js'],
			exclude: ['site/**/__tests__/**', 'site/public/**', 'worker/**/*.test.js'],
		},
	},
});
