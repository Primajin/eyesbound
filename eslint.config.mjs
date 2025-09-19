import xo from 'xo';
import xoReactConfig from 'eslint-config-xo-react';
import {globalIgnores} from 'eslint/config';
import pluginJest from 'eslint-plugin-jest';

/** @type {import('xo').FlatXoConfig} */
const eslintConfig = [
	globalIgnores([
		'__mocks__',
		'__snapshots__',
		'gatsby-config.js',
		'gatsby-node.js',
		'jest-preprocess.js',
		'jest.config.js',
		'loadershim.js',
		'package-lock.json',
	]),
	...xoReactConfig,
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
			'n/prefer-global/process': 'off', // ?
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
	},
];

export default xo.xoToEslintConfig(eslintConfig);
