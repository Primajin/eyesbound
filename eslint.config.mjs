import {globalIgnores} from 'eslint/config';
import pluginJest from 'eslint-plugin-jest';

/**
@type {import('xo').FlatXoConfig}
*/
const eslintConfig = [
	globalIgnores([
		'.github/agents/**',
		'**/*.astro',
		'package-lock.json',
		// Classic pre-paint scripts copied verbatim to dist/ (not bundled); theme-init.js is tested in site/scripts/__tests__/theme.test.js
		'site/public/**',
	]),
	{
		// Tests run on Vitest; the plugin only supplies its test-style rules (Vitest mirrors the Jest API), hence the pinned version.
		files: ['**/*.test.js'],
		...pluginJest.configs['flat/recommended'],
		...pluginJest.configs['flat/style'],
		settings: {jest: {version: 30}},
		rules: {
			...pluginJest.configs['flat/recommended'].rules,
			...pluginJest.configs['flat/style'].rules,
			'unicorn/prefer-global-this': 'off',
			'unicorn/no-global-object-property-assignment': 'off',
		},
	},
	{
		files: ['astro.config.mjs', 'vitest.config.mjs', 'playwright.config.mjs'],
		rules: {
			'n/prefer-global/process': 'off',
			'unicorn/no-top-level-side-effects': 'off',
		},
	},
	{
		files: ['package.json'],
		rules: {
			// `xo@5`'s bundled `eslint-config-xo` lints `package.json` and wants `"type": "module"`. Flipping it
			// would also switch `.ncurc` (CommonJS) to ESM resolution; left as a deliberate follow-up.
			'package-json/prefer-type-module': 'off',
		},
	},
	{
		files: ['**/*.js'],
		rules: {
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [
						['builtin', 'external'],
						['parent', 'sibling'],
						'index',
					],
				},
			],
			'n/prefer-global/process': 'off',
			'unicorn/filename-case': [
				'error',
				{
					ignore: [/^__\w+__$/v],
				},
			],
		},
	},
];

export default eslintConfig;
