const babelOptions = {
	presets: [
		// `reactRuntime`/`reactImportSource` must match `gatsby-config.js`'s `jsxRuntime: 'automatic'` /
		// `jsxImportSource: '@emotion/react'` — otherwise Jest silently falls back to the classic JSX runtime
		// (`babel-preset-gatsby`'s default), which requires `React` in scope, unlike the real Gatsby build.
		['babel-preset-gatsby', {reactRuntime: 'automatic', reactImportSource: '@emotion/react'}],
	],
	plugins: [
		// `@emotion/babel-preset-css-prop` internally re-runs `@babel/plugin-transform-react-jsx` with a custom
		// classic-style pragma (and `pragmaFrag: 'React.Fragment'`), which silently overrides the automatic runtime
		// configured above and requires `React` in scope even for `<>...</>` fragments. `@emotion/babel-plugin` alone
		// (its own docs' recommended replacement) transforms the `css` prop without touching the JSX transform.
		[
			'@emotion/babel-plugin',
			{
				sourceMap: false,
				autoLabel: 'dev-only',
				labelFormat: '[local]',
				cssPropOptimization: true,
			},
		],
	],
};

module.exports = require('babel-jest').default.createTransformer(babelOptions);
