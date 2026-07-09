import {fixupConfigRules} from '@eslint/compat';
import {globalIgnores} from 'eslint/config';
import pluginJest from 'eslint-plugin-jest';
import xoReact from 'eslint-config-xo-react';

/** @type {import('xo').FlatXoConfig} */
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
	...fixupConfigRules(xoReact().map(config => ({...config, files: ['**/*.{js,jsx}']}))),
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
			'react/require-default-props': [
				'error',
				{
					forbidDefaultForRequired: true,
					functions: 'defaultArguments',
				},
			],
			'react/no-unknown-property': [
				'error',
				{
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
