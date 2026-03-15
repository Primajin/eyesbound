import xo from 'xo';
import {globalIgnores} from 'eslint/config';
import pluginJest from 'eslint-plugin-jest';

/** @type {import('xo').FlatXoConfig} */
const eslintConfig = [
	globalIgnores([
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
	{
		files: ['**/*.test.{js,jsx,ts,tsx}'],
		...pluginJest.configs['flat/recommended'],
		...pluginJest.configs['flat/style'],
		rules: {
			...pluginJest.configs['flat/recommended'].rules,
			...pluginJest.configs['flat/style'].rules,
			'unicorn/prefer-global-this': 'off',
		},
	},
	{
		react: true,
		files: ['**/*.{js,jsx,ts,tsx}'],
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
			'react/react-in-jsx-scope': 'off',
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
		},
		settings: {
			react: {version: '19'},
		},
	},
];

export default xo.xoToEslintConfig(eslintConfig);
