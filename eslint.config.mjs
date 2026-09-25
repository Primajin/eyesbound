import {fixupConfigRules} from '@eslint/compat';
import {globalIgnores} from 'eslint/config';
import pluginJest from 'eslint-plugin-jest';
import xoReact from 'eslint-config-xo-react';

/**
@type {import('xo').FlatXoConfig}
*/
const eslintConfig = [
	globalIgnores([
		'.github/agents/**',
		'__mocks__',
		'__snapshots__',
		'csp-utils.js',
		'gatsby-config.js',
		'gatsby-node.js',
		'jest-preprocess.js',
		'jest.config.js',
		'loadershim.js',
		'package-lock.json',
	]),
	// Only the base `xo/react` block's `files` is narrowed to `.js`/`.jsx` (this repo has no `.mjs`/`.cjs`/`.ts` sources
	// besides this config file itself). The `xo/react/typescript` block must keep its own `**/*.{ts,tsx,mts,cts}`
	// glob — it carries `@eslint-react/no-leaked-conditional-rendering`, a type-aware rule that throws when applied
	// to a file with no TypeScript parser/project configured, which broadening its `files` to `.js`/`.jsx` would do.
	...fixupConfigRules(xoReact().map(config => config.name === 'xo/react' ? {...config, files: ['**/*.{js,jsx}']} : config)),
	{
		files: ['**/*.test.{js,jsx}'],
		...pluginJest.configs['flat/recommended'],
		...pluginJest.configs['flat/style'],
		rules: {
			...pluginJest.configs['flat/recommended'].rules,
			...pluginJest.configs['flat/style'].rules,
			'unicorn/prefer-global-this': 'off',
			'unicorn/no-global-object-property-assignment': 'off',
		},
	},
	{
		files: ['src/i18n/config.js'],
		rules: {
			'unicorn/no-top-level-side-effects': 'off',
		},
	},
	{
		files: ['package.json'],
		rules: {
			// `xo@5`'s bundled `eslint-config-xo` now lints `package.json` and wants `"type": "module"` set. Flipping
			// that would switch the whole package (Gatsby config files, Jest, etc.) from CommonJS to ESM resolution —
			// out of scope for this lint-tooling version bump; left as a deliberate follow-up, not fixed here.
			'package-json/prefer-type-module': 'off',
		},
	},
	{
		files: ['**/*.{js,jsx}'],
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
			// `react/require-default-props` had no `eslint-config-xo-react@0.32.0` successor: `@eslint-react/eslint-plugin`
			// dropped `eslint-plugin-react` (and its legacy propTypes/defaultProps rules) entirely in favor of rules
			// scoped to React idioms (hooks, JSX, DOM). See https://github.com/xojs/eslint-config-xo-react/issues/42.
			'@eslint-react/dom-no-unknown-property': [
				'error',
				{
					requireDataLowercase: true,
					ignore: [
						'css',
						'fill',
					],
				},
			],
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
