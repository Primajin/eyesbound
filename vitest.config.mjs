import {getViteConfig} from 'astro/config';

export default getViteConfig({
	test: {
		include: ['site/**/*.test.{js,jsx}'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			include: ['site/**/*.{js,jsx,astro}'],
			exclude: ['site/**/__tests__/**', 'site/public/**'],
		},
	},
});
